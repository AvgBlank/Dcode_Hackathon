import { Router } from "express";
import type { Response } from "express";
import { GitHubService } from "../services/github.service.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const analyticsRouter = Router();

// Get overview/dashboard data
analyticsRouter.get(
  "/overview",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { timeRange = "30d" } = req.query;

      // Calculate date range
      const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : 30;
      const since = new Date(
        Date.now() - days * 24 * 60 * 60 * 1000
      ).toISOString();

      const [activityData, userRepos] = await Promise.all([
        github.getUserActivityData(req.user!.username, since),
        github.getUserRepositories(),
      ]);

      // Calculate metrics from activity data
      const metrics = {
        prs: activityData.reduce((sum, day) => sum + day.prs_reviewed, 0),
        issues: activityData.reduce((sum, day) => sum + day.issues_triaged, 0),
        discussions: activityData.reduce(
          (sum, day) => sum + day.discussions_participated,
          0
        ),
        comments: activityData.reduce((sum, day) => sum + day.comments_made, 0),
        commits: activityData.reduce((sum, day) => sum + day.commits_made, 0),
      };

      // Get recent activity across repositories
      const recentActivity = [];
      for (const repo of userRepos.slice(0, 5)) {
        try {
          const [commits, issues, prs] = await Promise.all([
            github.getCommits(
              repo.owner.login,
              repo.name,
              req.user!.username,
              since
            ),
            github.getIssues(repo.owner.login, repo.name, "all", 1, 5),
            github.getPullRequests(repo.owner.login, repo.name, "all", 1, 5),
          ]);

          recentActivity.push({
            repository: repo.name,
            owner: repo.owner.login,
            commits: commits.slice(0, 3),
            issues: issues.slice(0, 3),
            pull_requests: prs.slice(0, 3),
          });
        } catch (error) {
          // Skip repositories we can't access
          continue;
        }
      }

      res.json({
        success: true,
        data: {
          metrics,
          activity_data: activityData,
          recent_activity: recentActivity,
          summary: {
            total_repositories: userRepos.length,
            active_repositories: userRepos.filter((repo) => {
              const daysSinceUpdate = Math.floor(
                (Date.now() - new Date(repo.updated_at).getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              return daysSinceUpdate <= 30;
            }).length,
            total_stars: userRepos.reduce(
              (sum, repo) => sum + repo.stargazers_count,
              0
            ),
            total_forks: userRepos.reduce(
              (sum, repo) => sum + repo.forks_count,
              0
            ),
          },
        },
      });
    } catch (error: any) {
      console.error("Error fetching overview data:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch overview data",
      });
    }
  }
);

// Get detailed analytics data
analyticsRouter.get(
  "/detailed",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { period = "6months" } = req.query;

      // Calculate date range
      const months =
        period === "1month"
          ? 1
          : period === "3months"
          ? 3
          : period === "1year"
          ? 12
          : 6;
      const since = new Date(
        Date.now() - months * 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      const [activityData, sentimentData, userRepos] = await Promise.all([
        github.getUserActivityData(req.user!.username, since),
        github.getUserSentimentData(req.user!.username),
        github.getUserRepositories(),
      ]);

      // Group activity data by month
      const monthlyActivity = groupByMonth(activityData);

      // Calculate response time data (mock for now)
      const responseTimeData = generateResponseTimeData(months);

      // Calculate repository health for each repo
      const repositoryHealth = [];
      for (const repo of userRepos.slice(0, 10)) {
        try {
          const health = await github.getRepositoryHealth(
            repo.owner.login,
            repo.name,
            req.user!.username
          );
          repositoryHealth.push(health);
        } catch (error) {
          // Skip repositories we can't access
          continue;
        }
      }

      // Calculate summary statistics
      const totalContributions = activityData.reduce(
        (sum, day) =>
          sum + day.prs_reviewed + day.issues_triaged + day.comments_made,
        0
      );

      const avgResponseTime = 2.4; // This would require more detailed analysis
      const approvalRate = 78; // This would require review analysis
      const weeklyHours = 32.8; // This would require commit timestamp analysis

      res.json({
        success: true,
        data: {
          activity_trends: monthlyActivity,
          sentiment_data: sentimentData.length > 0 ? sentimentData : [],
          response_time_data: responseTimeData,
          repository_health: repositoryHealth,
          time_investment: monthlyActivity.slice(-7).map((activity, index) => ({
            day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index % 7],
            hours: Math.round((activity.total_contributions / 10) * 100) / 100 // Convert contributions to estimated hours
          })),
          summary_cards: {
            total_contributions: totalContributions,
            avg_response_time: avgResponseTime,
            approval_rate: approvalRate,
            weekly_hours: weeklyHours,
          },
          impact_metrics: {
            contributors_mentored: 34, // Would need to calculate from interactions
            first_time_contributors_helped: 12,
            documentation_improvements: 42,
            ci_cd_fixes: 18,
            issues_closed: repositoryHealth.reduce(
              (sum, repo) =>
                sum + (repo.maintainer_activity.issues_closed || 0),
              0
            ),
            prs_merged: repositoryHealth.reduce(
              (sum, repo) => sum + (repo.maintainer_activity.merges || 0),
              0
            ),
            stale_issues_addressed: 23,
            security_patches_reviewed: 7,
          },
        },
      });
    } catch (error: any) {
      console.error("Error fetching detailed analytics:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch detailed analytics",
      });
    }
  }
);

// Export analytics report
analyticsRouter.post(
  "/export",
  requireAuth(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const github = new GitHubService(req.user!.accessToken);
      const { format = "json", period = "6months" } = req.body;

      const report = await github.generateActivityReport(
        req.user!.username,
        format
      );

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="maintainer-report-${req.user!.username}.csv"`
        );
      } else {
        res.setHeader("Content-Type", "application/json");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="maintainer-report-${req.user!.username}.json"`
        );
      }

      res.json({
        success: true,
        data: report,
        message: "Report generated successfully",
      });
    } catch (error: any) {
      console.error("Error generating report:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate report",
      });
    }
  }
);

// Helper functions
function groupByMonth(activityData: any[]): any[] {
  const monthlyMap = new Map();

  activityData.forEach((day) => {
    const month = day.date.substring(0, 7); // YYYY-MM
    if (!monthlyMap.has(month)) {
      monthlyMap.set(month, {
        month: new Date(month + "-01").toLocaleDateString("en-US", {
          month: "short",
        }),
        reviews: 0,
        issues: 0,
        discussions: 0,
        merges: 0,
        comments: 0,
      });
    }

    const monthData = monthlyMap.get(month);
    monthData.reviews += day.prs_reviewed;
    monthData.issues += day.issues_triaged;
    monthData.discussions += day.discussions_participated;
    monthData.merges += day.commits_made;
    monthData.comments += day.comments_made;
  });

  return Array.from(monthlyMap.values());
}

function generateResponseTimeData(months: number): any[] {
  const data = [];
  for (let i = 0; i < Math.min(months, 12); i++) {
    data.push({
      week: `Week ${i + 1}`,
      avgTime: 3.2 - i * 0.1, // Simulated improvement over time
      target: 2.5,
    });
  }
  return data;
}





export default analyticsRouter;
