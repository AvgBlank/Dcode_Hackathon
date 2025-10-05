import axios, { AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the auth page and not checking auth status
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth") &&
        !error.config?.url?.includes("/auth-check")
      ) {
        console.log("Authentication required, redirecting to login");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Types for API responses
export interface User {
  id: number;
  githubId: string;
  username: string;
  name?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  company?: string;
  blog?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  owner: {
    login: string;
    avatarUrl: string;
  };
  htmlUrl: string;
  language?: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  size: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  healthScore?: number;
  activityLevel?: "high" | "medium" | "low";
  openPullRequests?: number;
  totalContributors?: number;
}

export interface MetricsData {
  totalRepositories: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  totalPullRequests: number;
  averageResponseTime: number;
  activeRepositories: number;
  contributorCount: number;
  recentActivity: {
    date: string;
    pullRequests: number;
    issues: number;
    reviews: number;
    commits: number;
  }[];
  topRepositories: Repository[];
  activityTrend: {
    date: string;
    value: number;
  }[];
  reviewSentiment: {
    approved: number;
    changesRequested: number;
    commented: number;
  };
  timeInvestment: {
    category: string;
    hours: number;
  }[];
  responseTimeData: {
    date: string;
    avgResponseTime: number;
  }[];
}

export interface AnalyticsData extends MetricsData {
  weeklyActivity: {
    week: string;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
  }[];
  languageDistribution: {
    language: string;
    percentage: number;
    linesOfCode: number;
  }[];
  collaborationMetrics: {
    totalCollaborators: number;
    averageReviewTime: number;
    mergeRate: number;
  };
}

export interface TriageStats {
  pendingReviews: number;
  openIssues: number;
  discussionsNeedingResponse: number;
  priorityItems: number;
  avgResponseTime: number;
  thisWeekActivity: number;
}

export interface PullRequest {
  id: number;
  title: string;
  number: number;
  state: "open" | "closed" | "merged";
  author: {
    login: string;
    avatarUrl: string;
  };
  repository: {
    name: string;
    owner: string;
  };
  createdAt: string;
  updatedAt: string;
  priority?: "high" | "medium" | "low";
  labels: Array<string | { name: string; color?: string }>;
  requestedReviewers: string[];
  assignees: string[];
}

export interface Issue {
  id: number;
  title: string;
  number: number;
  state: "open" | "closed";
  author: {
    login: string;
    avatarUrl: string;
  };
  repository: {
    name: string;
    owner: string;
  };
  createdAt: string;
  updatedAt: string;
  priority?: "high" | "medium" | "low";
  labels: Array<string | { name: string; color?: string }>;
  assignees: string[];
  comments: number;
}

export interface Discussion {
  id: string;
  title: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  repository: {
    name: string;
    owner: string;
  };
  category: string;
  createdAt: string;
  updatedAt: string;
  answerChosenAt?: string;
  upvoteCount: number;
  commentCount: number;
}

export interface HistoryItem {
  id: string;
  type: "pr" | "issue" | "discussion" | "comment";
  title: string;
  repository: {
    name: string;
    owner: string;
  };
  action: string;
  date: string;
  metadata?: any;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  priorityAlerts: boolean;
  autoAssignment: boolean;
  githubIntegration: boolean;
  theme: "light" | "dark" | "system";
  timezone: string;
  language: string;
}

// API Client Class
export class ApiClient {
  // Authentication endpoints
  static async checkAuth(): Promise<{
    authenticated: boolean;
    user?: { id: number; username: string };
  }> {
    try {
      const response = await api.get("/user/auth-check");
      return { authenticated: true, user: response.data.user };
    } catch (error) {
      return { authenticated: false };
    }
  }

  // User/Profile endpoints
  static async getProfile(): Promise<User> {
    const response: AxiosResponse<{ success: boolean; data: any }> =
      await api.get("/user/profile");
    const data = response.data.data;

    // Map backend response to frontend interface
    return {
      id: data.id,
      githubId: data.id.toString(),
      username: data.login,
      name: data.name,
      email: data.email,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      location: data.location,
      company: data.company,
      blog: data.blog,
      publicRepos: data.public_repos,
      publicGists: data.public_gists || 0,
      followers: data.followers,
      following: data.following,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
  }

  static async updateProfile(data: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await api.put("/user/profile", data);
    return response.data;
  }

  static async shareProfile(): Promise<{ shareUrl: string }> {
    const response: AxiosResponse<{
      success: boolean;
      data: { share_url: string };
    }> = await api.post("/user/profile/share");
    return {
      shareUrl: response.data.data.share_url,
    };
  }

  // Repository endpoints
  static async getRepositories(): Promise<Repository[]> {
    const response: AxiosResponse<{ success: boolean; data: any[] }> =
      await api.get("/repositories");

    // Map backend response to frontend interface
    return response.data.data.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
      htmlUrl: repo.html_url,
      language: repo.language,
      stargazersCount: repo.stargazers_count || 0,
      forksCount: repo.forks_count || 0,
      openIssuesCount: repo.open_issues_count || 0,
      size: repo.size || 0,
      defaultBranch: repo.default_branch,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      healthScore: repo.health_score,
      activityLevel: repo.activity_level,
      openPullRequests: repo.open_pull_requests || 0,
      totalContributors: repo.contributors_count || 0,
    }));
  }

  static async getRepository(owner: string, repo: string): Promise<Repository> {
    const response: AxiosResponse<Repository> = await api.get(
      `/repositories/${owner}/${repo}`
    );
    return response.data;
  }

  static async getRepositoryContributors(
    owner: string,
    repo: string
  ): Promise<any[]> {
    const response = await api.get(
      `/repositories/${owner}/${repo}/contributors`
    );
    return response.data;
  }

  static async getRepositoryLanguages(
    owner: string,
    repo: string
  ): Promise<any> {
    const response = await api.get(`/repositories/${owner}/${repo}/languages`);
    return response.data;
  }

  // Analytics endpoints
  static async getOverviewMetrics(): Promise<MetricsData> {
    const response: AxiosResponse<{ success: boolean; data: any }> =
      await api.get("/analytics/overview");

    const data = response.data.data;

    // Map backend response to frontend interface
    return {
      totalRepositories: data.summary?.total_repositories || 0,
      totalStars: data.summary?.total_stars || 0,
      totalForks: data.summary?.total_forks || 0,
      totalIssues: data.metrics?.issues || 0,
      totalPullRequests: data.metrics?.prs || 0,
      averageResponseTime: 2.4, // This would need to be calculated from the data
      activeRepositories: data.summary?.active_repositories || 0,
      contributorCount: data.metrics?.comments || 0, // Using comments as a proxy
      recentActivity: (data.activity_data || []).map((item: any) => ({
        date: item.date,
        pullRequests: item.prs_reviewed || 0,
        issues: item.issues_triaged || 0,
        reviews: item.prs_reviewed || 0,
        commits: item.commits_made || 0,
      })),
      topRepositories: [], // This would need to be populated from recent_activity
      activityTrend: (data.activity_data || []).map((item: any) => ({
        date: item.date,
        value:
          (item.prs_reviewed || 0) +
          (item.issues_triaged || 0) +
          (item.commits_made || 0),
      })),
      reviewSentiment: data.sentiment_data || {
        approved: 0,
        changesRequested: 0,
        commented: 0,
      },
      timeInvestment: data.time_investment || [],
      responseTimeData: data.response_time_data || [],
    };
  }

  static async getDetailedAnalytics(): Promise<AnalyticsData> {
    const response: AxiosResponse<{ success: boolean; data: AnalyticsData }> =
      await api.get("/analytics/detailed");
    return response.data.data;
  }

  static async exportActivityReport(
    format: "json" | "csv" = "json"
  ): Promise<Blob> {
    const response = await api.post(
      "/analytics/export",
      { format },
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  // Triage endpoints
  static async getTriageStats(): Promise<TriageStats> {
    const response: AxiosResponse<{ success: boolean; data: TriageStats }> =
      await api.get("/triage/stats");
    return response.data.data;
  }

  static async getPullRequests(): Promise<PullRequest[]> {
    const response: AxiosResponse<{ success: boolean; data: PullRequest[] }> =
      await api.get("/triage/pull-requests");
    return response.data.data;
  }

  static async getIssues(): Promise<Issue[]> {
    const response: AxiosResponse<{ success: boolean; data: Issue[] }> =
      await api.get("/triage/issues");
    return response.data.data;
  }

  static async getDiscussions(): Promise<Discussion[]> {
    const response: AxiosResponse<{ success: boolean; data: Discussion[] }> =
      await api.get("/triage/discussions");
    return response.data.data;
  }

  // History endpoints
  static async getPRHistory(): Promise<HistoryItem[]> {
    const response: AxiosResponse<{ success: boolean; data: HistoryItem[] }> =
      await api.get("/history/prs");
    return response.data.data;
  }

  static async getIssueHistory(): Promise<HistoryItem[]> {
    const response: AxiosResponse<{ success: boolean; data: HistoryItem[] }> =
      await api.get("/history/issues");
    return response.data.data;
  }

  static async getDiscussionHistory(): Promise<HistoryItem[]> {
    const response: AxiosResponse<{ success: boolean; data: HistoryItem[] }> =
      await api.get("/history/discussions");
    return response.data.data;
  }

  static async getCommentHistory(): Promise<HistoryItem[]> {
    const response: AxiosResponse<{ success: boolean; data: HistoryItem[] }> =
      await api.get("/history/comments");
    return response.data.data;
  }

  // Settings endpoints
  static async getSettings(): Promise<UserSettings> {
    const response: AxiosResponse<{ success: boolean; data: UserSettings }> =
      await api.get("/settings");
    return response.data.data;
  }

  static async updateSettings(
    data: Partial<UserSettings>
  ): Promise<UserSettings> {
    const response: AxiosResponse<{ success: boolean; data: UserSettings }> =
      await api.put("/settings", data);
    return response.data.data;
  }

  static async updateGithubToken(token: string): Promise<{ success: boolean }> {
    const response = await api.put("/settings/github-token", { token });
    return response.data;
  }

  static async disconnectGithub(): Promise<{ success: boolean }> {
    const response = await api.delete("/settings/github-token");
    return response.data;
  }
}

export default ApiClient;
