import { Router } from "express";
import type { Response } from "express";
import { GitHubService } from "../services/github.service.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const historyRouter = Router();

// Get PR review history
historyRouter.get(
  "/prs",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { page = 1, per_page = 30, state = "all" } = req.query;

      // Search for PRs where user was involved as reviewer
      const reviewedPRs = await github.searchPullRequestsByUser(
        req.user!.username,
        "review-requested"
      );
      const authoredPRs = await github.searchPullRequestsByUser(
        req.user!.username,
        "author"
      );

      // Combine and sort by update time
      const allPRs = [
        ...(reviewedPRs.items || []),
        ...(authoredPRs.items || []),
      ]
        .filter(
          (pr, index, self) => index === self.findIndex((p) => p.id === pr.id)
        ) // Remove duplicates
        .map((pr: any) => ({
          id: pr.id,
          number: pr.number,
          title: pr.title,
          repository: pr.repository_url.split("/").slice(-1)[0],
          owner: pr.repository_url.split("/").slice(-2, -1)[0],
          author: pr.user.login,
          state: pr.state,
          created_at: pr.created_at,
          updated_at: pr.updated_at,
          closed_at: pr.closed_at,
          merged_at: pr.pull_request?.merged_at || null,
          html_url: pr.html_url,
          labels: pr.labels,
          assignees: pr.assignees,
          your_role:
            pr.user.login === req.user!.username ? "author" : "reviewer",
        }))
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      // Filter by state if specified
      const filteredPRs =
        state === "all" ? allPRs : allPRs.filter((pr) => pr.state === state);

      // Paginate
      const startIndex = (Number(page) - 1) * Number(per_page);
      const paginatedPRs = filteredPRs.slice(
        startIndex,
        startIndex + Number(per_page)
      );

      res.json({
        success: true,
        data: paginatedPRs,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          total: filteredPRs.length,
          total_pages: Math.ceil(filteredPRs.length / Number(per_page)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching PR history:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch PR history",
      });
    }
  }
);

// Get issue triage history
historyRouter.get(
  "/issues",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { page = 1, per_page = 30, state = "all" } = req.query;

      // Search for issues where user was involved
      const authoredIssues = await github.searchIssuesByUser(
        req.user!.username,
        "author"
      );
      const assignedIssues = await github.searchIssuesByUser(
        req.user!.username,
        "assignee"
      );

      // Combine and sort
      const allIssues = [
        ...(authoredIssues.items || []),
        ...(assignedIssues.items || []),
      ]
        .filter(
          (issue, index, self) =>
            index === self.findIndex((i) => i.id === issue.id)
        )
        .map((issue: any) => ({
          id: issue.id,
          number: issue.number,
          title: issue.title,
          repository: issue.repository_url.split("/").slice(-1)[0],
          owner: issue.repository_url.split("/").slice(-2, -1)[0],
          author: issue.user.login,
          state: issue.state,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          closed_at: issue.closed_at,
          html_url: issue.html_url,
          labels: issue.labels,
          assignees: issue.assignees,
          comments: issue.comments,
          your_role:
            issue.user.login === req.user!.username ? "author" : "assignee",
        }))
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      // Filter by state
      const filteredIssues =
        state === "all"
          ? allIssues
          : allIssues.filter((issue) => issue.state === state);

      // Paginate
      const startIndex = (Number(page) - 1) * Number(per_page);
      const paginatedIssues = filteredIssues.slice(
        startIndex,
        startIndex + Number(per_page)
      );

      res.json({
        success: true,
        data: paginatedIssues,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          total: filteredIssues.length,
          total_pages: Math.ceil(filteredIssues.length / Number(per_page)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching issue history:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch issue history",
      });
    }
  }
);

// Get discussions history
historyRouter.get(
  "/discussions",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Discussions require GraphQL API - placeholder for now
      res.json({
        success: true,
        data: [],
        message: "Discussions history not implemented (requires GraphQL API)",
      });
    } catch (error: any) {
      console.error("Error fetching discussions history:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch discussions history",
      });
    }
  }
);

// Get comments history
historyRouter.get(
  "/comments",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const repos = await github.getUserRepositories();

      const allComments = [];

      // Get recent comments from user's repositories
      for (const repo of repos.slice(0, 5)) {
        try {
          // Get recent issues and PRs to find comments
          const [issues, prs] = await Promise.all([
            github.getIssues(repo.owner.login, repo.name, "all", 1, 20),
            github.getPullRequests(repo.owner.login, repo.name, "all", 1, 20),
          ]);

          // Get comments for recent issues
          for (const issue of issues.slice(0, 5)) {
            try {
              const comments = await github.getIssueComments(
                repo.owner.login,
                repo.name,
                issue.number
              );
              const userComments = comments.filter(
                (comment) => comment.user.login === req.user!.username
              );

              allComments.push(
                ...userComments.map((comment) => ({
                  ...comment,
                  type: "issue",
                  item_number: issue.number,
                  item_title: issue.title,
                  repository: repo.name,
                  owner: repo.owner.login,
                }))
              );
            } catch (error) {
              continue;
            }
          }

          // Get comments for recent PRs
          for (const pr of prs.slice(0, 5)) {
            try {
              const comments = await github.getPullRequestComments(
                repo.owner.login,
                repo.name,
                pr.number
              );
              const userComments = comments.filter(
                (comment) => comment.user.login === req.user!.username
              );

              allComments.push(
                ...userComments.map((comment) => ({
                  ...comment,
                  type: "pull_request",
                  item_number: pr.number,
                  item_title: pr.title,
                  repository: repo.name,
                  owner: repo.owner.login,
                }))
              );
            } catch (error) {
              continue;
            }
          }
        } catch (error) {
          continue;
        }
      }

      // Sort by creation date
      allComments.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Paginate
      const { page = 1, per_page = 30 } = req.query;
      const startIndex = (Number(page) - 1) * Number(per_page);
      const paginatedComments = allComments.slice(
        startIndex,
        startIndex + Number(per_page)
      );

      res.json({
        success: true,
        data: paginatedComments,
        pagination: {
          page: Number(page),
          per_page: Number(per_page),
          total: allComments.length,
          total_pages: Math.ceil(allComments.length / Number(per_page)),
        },
      });
    } catch (error: any) {
      console.error("Error fetching comments history:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch comments history",
      });
    }
  }
);

export default historyRouter;
