export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  blog: string;
  twitter_username: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  language: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  disabled: boolean;
  topics: string[];
  owner: {
    login: string;
    id: number;
    avatar_url: string;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed" | "merged";
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  draft: boolean;
  additions: number;
  deletions: number;
  changed_files: number;
  comments: number;
  review_comments: number;
  commits: number;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
  requested_reviewers: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  comments: number;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  assignees: Array<{
    login: string;
    avatar_url: string;
  }>;
}

export interface GitHubComment {
  id: number;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubDiscussion {
  id: number;
  number: number;
  title: string;
  body: string;
  category: {
    id: string;
    name: string;
    emoji: string;
  };
  state: "open" | "closed";
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  comments: {
    totalCount: number;
  };
  upvotes: {
    totalCount: number;
  };
  answer?: {
    id: string;
    body: string;
    created_at: string;
    author: {
      login: string;
      avatar_url: string;
    };
  };
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
  };
  committer: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface GitHubReview {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED";
  html_url: string;
  pull_request_url: string;
  submitted_at: string;
  commit_id: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
  type: string;
}

// Analytics types
export interface ActivityData {
  date: string;
  prs_reviewed: number;
  issues_triaged: number;
  discussions_participated: number;
  comments_made: number;
  commits_made: number;
}

export interface SentimentData {
  date: string;
  approved: number;
  changes_requested: number;
  commented: number;
}

export interface ResponseTimeData {
  period: string;
  avg_response_time_hours: number;
  target_hours: number;
}

export interface RepositoryHealth {
  repository: string;
  health_score: number;
  open_issues: number;
  open_prs: number;
  last_activity: string;
  maintainer_activity: {
    reviews: number;
    merges: number;
    issues_closed: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}
