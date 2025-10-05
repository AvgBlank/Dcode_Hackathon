import { Router } from "express";
import type { Response } from "express";
import { GitHubService } from "../services/github.service.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const repositoriesRouter = Router();

// Get user's repositories
repositoriesRouter.get(
  "/",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { search, language, type = "all" } = req.query;

      let repositories = await github.getUserRepositories(
        undefined,
        type as any
      );

      // Filter by search term
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        repositories = repositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(searchTerm) ||
            repo.description?.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by language
      if (language && language !== "all") {
        repositories = repositories.filter(
          (repo) =>
            repo.language?.toLowerCase() === (language as string).toLowerCase()
        );
      }

      // Calculate additional metrics for each repository
      const enhancedRepos = await Promise.all(
        repositories.map(async (repo) => {
          try {
            const [contributors, healthData] = await Promise.all([
              github.getRepositoryContributors(repo.owner.login, repo.name),
              github.getRepositoryHealth(
                repo.owner.login,
                repo.name,
                req.user!.username
              ),
            ]);

            return {
              ...repo,
              contributors_count: contributors.length,
              health_score: healthData.health_score,
              your_contributions: healthData.maintainer_activity,
              activity_level: getActivityLevel(repo),
              last_activity: repo.updated_at,
            };
          } catch (error) {
            // If we can't get additional data, return basic repo info
            return {
              ...repo,
              contributors_count: 0,
              health_score: 0,
              your_contributions: { reviews: 0, merges: 0, issues_closed: 0 },
              activity_level: getActivityLevel(repo),
              last_activity: repo.updated_at,
            };
          }
        })
      );

      res.json({
        success: true,
        data: enhancedRepos,
        pagination: {
          total: enhancedRepos.length,
          page: 1,
          per_page: enhancedRepos.length,
        },
      });
    } catch (error: any) {
      console.error("Error fetching repositories:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch repositories",
      });
    }
  }
);

// Get single repository details
repositoriesRouter.get(
  "/:owner/:repo",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { owner, repo } = req.params;

      if (!owner || !repo) {
        return res.status(400).json({
          success: false,
          error: "Owner and repository name are required",
        });
      }

      const github = new GitHubService(req.user!.accessToken);

      const [repository, contributors, issues, prs, commits, healthData] =
        await Promise.all([
          github.getRepository(owner, repo),
          github.getRepositoryContributors(owner, repo),
          github.getIssues(owner, repo, "open"),
          github.getPullRequests(owner, repo, "open"),
          github.getCommits(
            owner,
            repo,
            req.user!.username,
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          ),
          github.getRepositoryHealth(owner, repo, req.user!.username),
        ]);

      const recentActivity = await Promise.all([
        github.getCommits(
          owner,
          repo,
          undefined,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        ),
        github.getIssues(owner, repo, "all", 1, 10),
        github.getPullRequests(owner, repo, "all", 1, 10),
      ]);

      res.json({
        success: true,
        data: {
          ...repository,
          health_score: healthData.health_score,
          contributors_count: contributors.length,
          your_contributions: healthData.maintainer_activity,
          open_issues_count: issues.length,
          open_prs_count: prs.length,
          recent_commits_count: commits.length,
          activity_level: getActivityLevel(repository),
          recent_activity: {
            commits: recentActivity[0].slice(0, 5),
            issues: recentActivity[1].slice(0, 5),
            pull_requests: recentActivity[2].slice(0, 5),
          },
          statistics: {
            total_issues: repository.open_issues_count, // This includes PRs in GitHub API
            total_prs: prs.length,
            contributors: contributors.length,
            stars: repository.stargazers_count,
            forks: repository.forks_count,
            watchers: repository.watchers_count,
          },
        },
      });
    } catch (error: any) {
      console.error("Error fetching repository details:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch repository details",
      });
    }
  }
);

// Get repository contributors
repositoriesRouter.get(
  "/:owner/:repo/contributors",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { owner, repo } = req.params;

      if (!owner || !repo) {
        return res.status(400).json({
          success: false,
          error: "Owner and repository name are required",
        });
      }

      const github = new GitHubService(req.user!.accessToken);

      const contributors = await github.getRepositoryContributors(owner, repo);

      res.json({
        success: true,
        data: contributors,
      });
    } catch (error: any) {
      console.error("Error fetching contributors:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch contributors",
      });
    }
  }
);

// Get repository languages
repositoriesRouter.get(
  "/:owner/:repo/languages",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { owner, repo } = req.params;

      if (!owner || !repo) {
        return res.status(400).json({
          success: false,
          error: "Owner and repository name are required",
        });
      }

      const github = new GitHubService(req.user!.accessToken);

      // GitHub API endpoint for languages
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        {
          headers: {
            Authorization: `Bearer ${req.user!.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch languages");
      }

      const languages = await response.json();

      res.json({
        success: true,
        data: languages,
      });
    } catch (error: any) {
      console.error("Error fetching repository languages:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch repository languages",
      });
    }
  }
);

// Helper function to determine activity level
function getActivityLevel(repo: any): "high" | "medium" | "low" {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceUpdate <= 7) return "high";
  if (daysSinceUpdate <= 30) return "medium";
  return "low";
}

export default repositoriesRouter;
