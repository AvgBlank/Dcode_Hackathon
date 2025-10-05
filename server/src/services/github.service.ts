import axios, { type AxiosInstance, AxiosError } from "axios";
import type {
  GitHubUser,
  GitHubRepository,
  GitHubPullRequest,
  GitHubIssue,
  GitHubComment,
  GitHubDiscussion,
  GitHubCommit,
  GitHubReview,
  GitHubContributor,
  ActivityData,
  SentimentData,
  ResponseTimeData,
  RepositoryHealth,
} from "../types/github.js";

export class GitHubService {
  private api: AxiosInstance;
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
  }

  // User methods
  async getAuthenticatedUser(): Promise<GitHubUser> {
    try {
      const response = await this.api.get("/user");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await this.api.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Repository methods
  async getUserRepositories(
    username?: string,
    type: "all" | "owner" | "member" = "all"
  ): Promise<GitHubRepository[]> {
    try {
      const url = username ? `/users/${username}/repos` : "/user/repos";
      const response = await this.api.get(url, {
        params: {
          type,
          sort: "updated",
          per_page: 100,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepositoryContributors(
    owner: string,
    repo: string
  ): Promise<GitHubContributor[]> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/contributors`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Pull Request methods
  async getPullRequests(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
    page = 1,
    per_page = 30
  ): Promise<GitHubPullRequest[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/pulls`, {
        params: { state, page, per_page, sort: "updated", direction: "desc" },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPullRequest(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<GitHubPullRequest> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/pulls/${pull_number}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPullRequestReviews(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<GitHubReview[]> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/pulls/${pull_number}/reviews`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Issues methods
  async getIssues(
    owner: string,
    repo: string,
    state: "open" | "closed" | "all" = "open",
    page = 1,
    per_page = 30
  ): Promise<GitHubIssue[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/issues`, {
        params: { state, page, per_page, sort: "updated", direction: "desc" },
      });
      // Filter out pull requests (GitHub API returns PRs as issues)
      return response.data.filter((issue: any) => !issue.pull_request);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getIssue(
    owner: string,
    repo: string,
    issue_number: number
  ): Promise<GitHubIssue> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/issues/${issue_number}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getIssueComments(
    owner: string,
    repo: string,
    issue_number: number
  ): Promise<GitHubComment[]> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/issues/${issue_number}/comments`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Comments methods
  async getPullRequestComments(
    owner: string,
    repo: string,
    pull_number: number
  ): Promise<GitHubComment[]> {
    try {
      const response = await this.api.get(
        `/repos/${owner}/${repo}/pulls/${pull_number}/comments`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Commits methods
  async getCommits(
    owner: string,
    repo: string,
    author?: string,
    since?: string,
    until?: string
  ): Promise<GitHubCommit[]> {
    try {
      const params: any = { per_page: 100 };
      if (author) params.author = author;
      if (since) params.since = since;
      if (until) params.until = until;

      const response = await this.api.get(`/repos/${owner}/${repo}/commits`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search methods
  async searchPullRequestsByUser(
    username: string,
    action: "author" | "assignee" | "mentions" | "review-requested" = "author"
  ): Promise<any> {
    try {
      const query = `type:pr ${action}:${username}`;
      const response = await this.api.get("/search/issues", {
        params: { q: query, sort: "updated", order: "desc", per_page: 100 },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchIssuesByUser(
    username: string,
    action: "author" | "assignee" | "mentions" = "author"
  ): Promise<any> {
    try {
      const query = `type:issue ${action}:${username}`;
      const response = await this.api.get("/search/issues", {
        params: { q: query, sort: "updated", order: "desc", per_page: 100 },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Analytics methods
  async getUserActivityData(
    username: string,
    since?: string
  ): Promise<ActivityData[]> {
    try {
      const sinceDate =
        since || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Get PRs reviewed (where user is reviewer)
      const reviewedPRs = await this.searchPullRequestsByUser(
        username,
        "review-requested"
      );

      // Get issues authored/assigned
      const authoredIssues = await this.searchIssuesByUser(username, "author");

      // Get PRs authored
      const authoredPRs = await this.searchPullRequestsByUser(
        username,
        "author"
      );

      // Process and aggregate by date
      const activityMap = new Map<string, ActivityData>();

      // Process PRs
      reviewedPRs.items?.forEach((pr: any) => {
        const date = new Date(pr.updated_at).toISOString().split("T")[0];
        if (date && !activityMap.has(date)) {
          activityMap.set(date, {
            date,
            prs_reviewed: 0,
            issues_triaged: 0,
            discussions_participated: 0,
            comments_made: 0,
            commits_made: 0,
          });
        }
        if (date) {
          const activity = activityMap.get(date)!;
          activity.prs_reviewed += 1;
        }
      });

      // Process Issues
      authoredIssues.items?.forEach((issue: any) => {
        const date = new Date(issue.updated_at).toISOString().split("T")[0];
        if (date && !activityMap.has(date)) {
          activityMap.set(date, {
            date,
            prs_reviewed: 0,
            issues_triaged: 0,
            discussions_participated: 0,
            comments_made: 0,
            commits_made: 0,
          });
        }
        if (date) {
          const activity = activityMap.get(date)!;
          activity.issues_triaged += 1;
        }
      });

      return Array.from(activityMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserSentimentData(username: string): Promise<SentimentData[]> {
    try {
      // This would require analyzing review comments/states
      // For now, return mock data structure - implement with more detailed API calls
      const reviews = await this.api.get("/search/issues", {
        params: {
          q: `type:pr reviewed-by:${username}`,
          sort: "updated",
          order: "desc",
          per_page: 100,
        },
      });

      // Process reviews and categorize by sentiment
      const sentimentMap = new Map<string, SentimentData>();

      return Array.from(sentimentMap.values());
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Discussions (requires GraphQL API)
  async getRepositoryDiscussions(
    owner: string,
    repo: string
  ): Promise<GitHubDiscussion[]> {
    try {
      // Note: This requires GraphQL API for full discussions support
      // For now, we'll return empty array and implement with GraphQL later
      return [];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Repository health metrics
  async getRepositoryHealth(
    owner: string,
    repo: string,
    username: string
  ): Promise<RepositoryHealth> {
    try {
      const [repoData, issues, prs, commits] = await Promise.all([
        this.getRepository(owner, repo),
        this.getIssues(owner, repo, "open"),
        this.getPullRequests(owner, repo, "open"),
        this.getCommits(
          owner,
          repo,
          username,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
      ]);

      // Calculate health score based on activity and issue/PR ratios
      const totalIssues = issues.length;
      const totalPRs = prs.length;
      const recentCommits = commits.length;
      const daysSinceLastUpdate = Math.floor(
        (Date.now() - new Date(repoData.updated_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let healthScore = 100;
      if (totalIssues > 50) healthScore -= 20;
      if (totalPRs > 20) healthScore -= 15;
      if (daysSinceLastUpdate > 30) healthScore -= 30;
      if (recentCommits === 0) healthScore -= 25;

      healthScore = Math.max(0, healthScore);

      return {
        repository: `${owner}/${repo}`,
        health_score: healthScore,
        open_issues: totalIssues,
        open_prs: totalPRs,
        last_activity: repoData.updated_at,
        maintainer_activity: {
          reviews: 0, // Would need to implement review counting
          merges: 0, // Would need to implement merge counting
          issues_closed: 0, // Would need to implement closed issue counting
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export functionality
  async generateActivityReport(
    username: string,
    format: "json" | "csv" = "json"
  ): Promise<any> {
    try {
      const [activityData, repos, user] = await Promise.all([
        this.getUserActivityData(username),
        this.getUserRepositories(username),
        this.getUser(username),
      ]);

      const report = {
        user: user,
        period: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
        },
        summary: {
          total_repositories: repos.length,
          total_activity_days: activityData.length,
          total_prs_reviewed: activityData.reduce(
            (sum, day) => sum + day.prs_reviewed,
            0
          ),
          total_issues_triaged: activityData.reduce(
            (sum, day) => sum + day.issues_triaged,
            0
          ),
          total_comments_made: activityData.reduce(
            (sum, day) => sum + day.comments_made,
            0
          ),
        },
        activity_data: activityData,
        repositories: repos.map((repo) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          last_updated: repo.updated_at,
        })),
      };

      if (format === "csv") {
        // Convert to CSV format
        // Implementation would depend on CSV library
        return report;
      }

      return report;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const status = axiosError.response.status;
        const message =
          (axiosError.response.data as any)?.message || axiosError.message;

        switch (status) {
          case 401:
            throw new Error(
              "GitHub authentication failed. Please check your access token."
            );
          case 403:
            throw new Error("GitHub API rate limit exceeded or access denied.");
          case 404:
            throw new Error("GitHub resource not found.");
          default:
            throw new Error(`GitHub API error: ${message}`);
        }
      } else {
        throw new Error(`GitHub API request failed: ${axiosError.message}`);
      }
    }
    throw error;
  }
}
