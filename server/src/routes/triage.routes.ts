import { Router } from "express";
import type { Response } from "express";
import { GitHubService } from "../services/github.service.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const triageRouter = Router();

// Get triage overview/stats
triageRouter.get(
  "/stats",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const repos = await github.getUserRepositories();

      let totalPRsNeedingReview = 0;
      let totalIssuesNeedingTriage = 0;
      let totalDiscussionsUnanswered = 0;
      let totalCriticalItems = 0;

      // Get counts from each repository
      for (const repo of repos.slice(0, 10)) {
        // Limit to avoid rate limits
        try {
          const [prs, issues] = await Promise.all([
            github.getPullRequests(repo.owner.login, repo.name, "open", 1, 100),
            github.getIssues(repo.owner.login, repo.name, "open", 1, 100),
          ]);

          // Count PRs that need review (not authored by user)
          const prsNeedingReview = prs.filter(
            (pr) => pr.user.login !== req.user!.username && pr.state === "open"
          );
          totalPRsNeedingReview += prsNeedingReview.length;

          // Count issues that might need triage (recently created, no assignee)
          const issuesNeedingTriage = issues.filter((issue) => {
            const daysSinceCreated = Math.floor(
              (Date.now() - new Date(issue.created_at).getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return daysSinceCreated <= 7 && issue.assignees.length === 0;
          });
          totalIssuesNeedingTriage += issuesNeedingTriage.length;

          // Count critical items (high priority labels)
          const criticalItems = [...prs, ...issues].filter((item) =>
            item.labels.some((label) =>
              ["critical", "urgent", "high priority", "bug"].includes(
                label.name.toLowerCase()
              )
            )
          );
          totalCriticalItems += criticalItems.length;
        } catch (error) {
          // Skip repositories we can't access
          continue;
        }
      }

      res.json({
        success: true,
        data: {
          pendingReviews: totalPRsNeedingReview,
          openIssues: totalIssuesNeedingTriage,
          discussionsNeedingResponse: totalDiscussionsUnanswered,
          priorityItems: totalCriticalItems,
          avgResponseTime: 2.5, // Default value, could be calculated from actual data
          thisWeekActivity: totalPRsNeedingReview + totalIssuesNeedingTriage + totalDiscussionsUnanswered,
        },
      });
    } catch (error: any) {
      console.error("Error fetching triage stats:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch triage stats",
      });
    }
  }
);

// Get pull requests for triage
triageRouter.get(
  "/pull-requests",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const {
        repository,
        status,
        priority,
        page = 1,
        per_page = 20,
      } = req.query;

      const repos = repository
        ? await github
            .getUserRepositories()
            .then((repos) => repos.filter((r) => r.name === repository))
        : await github.getUserRepositories();

      const allPRs = [];

      for (const repo of repos.slice(0, 10)) {
        try {
          const prs = await github.getPullRequests(
            repo.owner.login,
            repo.name,
            "open",
            1,
            50
          );

          // Filter PRs that need attention from the maintainer
          const relevantPRs = prs.filter((pr) => {
            if (status === "needs-review") {
              return (
                pr.user.login !== req.user!.username && pr.state === "open"
              );
            }
            if (status === "changes-requested") {
              // This would require checking review status
              return pr.user.login !== req.user!.username;
            }
            return pr.user.login !== req.user!.username;
          });

          // Enhance PR data with additional info
          const enhancedPRs = relevantPRs.map((pr) => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state as "open" | "closed" | "merged",
            repository: {
              name: repo.name,
              owner: repo.owner.login,
            },
            author: {
              login: pr.user.login,
              avatarUrl: pr.user.avatar_url,
            },
            priority: determinePriority(pr),
            labels: pr.labels.map((label) => ({
              name: label.name,
              color: label.color,
            })),
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
            requestedReviewers: pr.requested_reviewers?.map((reviewer: any) => reviewer.login) || [],
            assignees: pr.assignees?.map((assignee: any) => assignee.login) || [],
          }));

          allPRs.push(...enhancedPRs);
        } catch (error) {
          continue;
        }
      }

      // Sort by priority and recent activity
      allPRs.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority =
          priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority =
          priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      // Paginate results
      const startIndex = (Number(page) - 1) * Number(per_page);
      const paginatedPRs = allPRs.slice(
        startIndex,
        startIndex + Number(per_page)
      );

      res.json({
        success: true,
        data: paginatedPRs,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          total: allPRs.length,
          total_pages: Math.ceil(allPRs.length / Number(per_page)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching pull requests:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch pull requests",
      });
    }
  }
);

// Get issues for triage
triageRouter.get(
  "/issues",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const {
        repository,
        status,
        priority,
        page = 1,
        per_page = 20,
      } = req.query;

      const repos = repository
        ? await github
            .getUserRepositories()
            .then((repos) => repos.filter((r) => r.name === repository))
        : await github.getUserRepositories();

      const allIssues = [];

      for (const repo of repos.slice(0, 10)) {
        try {
          const issues = await github.getIssues(
            repo.owner.login,
            repo.name,
            "open",
            1,
            50
          );

          // Enhance issue data
          const enhancedIssues = issues.map((issue: any) => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            state: issue.state as "open" | "closed",
            repository: {
              name: repo.name,
              owner: repo.owner.login,
            },
            author: {
              login: issue.user.login,
              avatarUrl: issue.user.avatar_url,
            },
            priority: determinePriority(issue),
            labels: issue.labels.map((label: any) => ({
              name: label.name,
              color: label.color,
            })),
            comments: issue.comments,
            assignees: issue.assignees.map((assignee: any) => assignee.login),
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
          }));

          allIssues.push(...enhancedIssues);
        } catch (error) {
          continue;
        }
      }

      // Sort by priority and recent activity
      allIssues.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority =
          priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority =
          priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });

      // Paginate results
      const startIndex = (Number(page) - 1) * Number(per_page);
      const paginatedIssues = allIssues.slice(
        startIndex,
        startIndex + Number(per_page)
      );

      res.json({
        success: true,
        data: paginatedIssues,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          total: allIssues.length,
          total_pages: Math.ceil(allIssues.length / Number(per_page)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching issues:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch issues",
      });
    }
  }
);

// Get discussions for triage
triageRouter.get(
  "/discussions",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // For now, return empty as discussions require GraphQL API
      res.json({
        success: true,
        data: [],
        message: "Discussions API not fully implemented (requires GraphQL)",
      });
    } catch (error: any) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch discussions",
      });
    }
  }
);

// Helper functions
function determinePRStatus(pr: any): string {
  if (pr.draft) return "draft";
  if (pr.requested_reviewers && pr.requested_reviewers.length > 0)
    return "needs-review";
  if (pr.comments > 0 || pr.review_comments > 0) return "in-discussion";
  return "needs-review";
}

function determineIssueStatus(issue: any): string {
  if (issue.assignees && issue.assignees.length > 0) return "assigned";
  if (issue.labels && issue.labels.length > 0) return "labeled";

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreated <= 3) return "needs-triage";

  return "open";
}

function determinePriority(item: any): "critical" | "high" | "medium" | "low" {
  if (!item.labels) return "medium";

  const labels = item.labels.map((label: any) => label.name.toLowerCase());

  if (
    labels.some((label: string) => ["critical", "urgent", "p0"].includes(label))
  ) {
    return "critical";
  }
  if (
    labels.some((label: string) =>
      ["high", "important", "p1", "bug"].includes(label)
    )
  ) {
    return "high";
  }
  if (
    labels.some((label: string) =>
      ["low", "minor", "p3", "documentation"].includes(label)
    )
  ) {
    return "low";
  }

  return "medium";
}

export default triageRouter;
