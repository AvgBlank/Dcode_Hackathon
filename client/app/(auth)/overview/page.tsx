"use client"

import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GitPullRequest,
  MessageSquare,
  GitMerge,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Share2,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"
import { ApiClient, MetricsData } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function OverviewPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [showTriageInfo, setShowTriageInfo] = useState(false)
  const [activityView, setActivityView] = useState<"recent" | "attention">("recent")
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("30d")
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!isAuthenticated || authLoading) return;
      
      try {
        setLoading(true)
        const data = await ApiClient.getOverviewMetrics()
        setMetricsData(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
        toast({
          title: "Error",
          description: "Failed to load metrics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [isAuthenticated, authLoading, user])

  const handleShareProfile = async () => {
    try {
      const result = await ApiClient.shareProfile()
      setShareUrl(result.shareUrl)
      navigator.clipboard.writeText(result.shareUrl)
      toast({
        title: "Profile shared!",
        description: "Profile URL copied to clipboard",
      })
    } catch (error) {
      console.error('Failed to share profile:', error)
      toast({
        title: "Error",
        description: "Failed to generate share URL. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Show auth loading state
  if (authLoading) {
    return (
      <div className="flex flex-col">
        <Header
          title="Overview"
          subtitle="Your maintainer activity at a glance"
          actions={
            <Button className="gap-2" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
            </Button>
          }
        />
        <div className="flex-1 p-4 md:p-8">
          <Breadcrumbs items={[{ label: "Overview" }]} />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <Header
          title="Overview"
          subtitle="Please sign in to view your maintainer activity"
          actions={
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          }
        />
        <div className="flex-1 p-4 md:p-8">
          <Breadcrumbs items={[{ label: "Overview" }]} />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Please sign in to access your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading || !metricsData) {
    return (
      <div className="flex flex-col">
        <Header
          title="Overview"
          subtitle="Your maintainer activity at a glance"
          actions={
            <Button className="gap-2" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Loading...</span>
            </Button>
          }
        />
        <div className="flex-1 p-4 md:p-8">
          <Breadcrumbs items={[{ label: "Overview" }]} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-20" />
                  <div className="h-5 w-5 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse w-16 mb-2" />
                  <div className="h-3 bg-muted rounded animate-pulse w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Overview"
        subtitle="Your maintainer activity at a glance"
        actions={
          <Button className="gap-2" onClick={handleShareProfile}>
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share Profile</span>
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-8">
        <Breadcrumbs items={[{ label: "Overview" }]} />

        <div className="space-y-6">
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-border bg-card p-1">
              <Button
                variant={timeRange === "1d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("1d")}
                className="text-xs"
              >
                1 Day
              </Button>
              <Button
                variant={timeRange === "7d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("7d")}
                className="text-xs"
              >
                7 Days
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("30d")}
                className="text-xs"
              >
                30 Days
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/history/prs">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">PRs Reviewed</CardTitle>
                  <GitPullRequest className="h-5 w-5 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metricsData.totalPullRequests}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+12%</span> from last period
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/history/issues">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Issues Triaged</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info
                            className="h-3 w-3 text-muted-foreground cursor-help"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShowTriageInfo(true)
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click for more info</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <AlertCircle className="h-5 w-5 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metricsData.totalIssues}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+8%</span> from last period
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/repositories">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Contributors</CardTitle>
                  <MessageSquare className="h-5 w-5 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metricsData.contributorCount}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+23%</span> from last period
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/analytics">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
                  <Clock className="h-5 w-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metricsData.averageResponseTime}h</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">-15%</span> faster response
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Activity Trends
              </CardTitle>
              <CardDescription>Recent activity across pull requests, issues, reviews, and commits</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pullRequests: {
                    label: "Pull Requests",
                    color: "hsl(142, 76%, 36%)",
                  },
                  issues: {
                    label: "Issues",
                    color: "hsl(38, 92%, 50%)",
                  },
                  reviews: {
                    label: "Reviews",
                    color: "hsl(262, 83%, 58%)",
                  },
                  commits: {
                    label: "Commits",
                    color: "hsl(220, 91%, 60%)",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metricsData.recentActivity?.map((item, index) => ({
                    date: new Date(item.date).toLocaleDateString(),
                    pullRequests: item.pullRequests || 0,
                    issues: item.issues || 0,
                    reviews: item.reviews || 0,
                    commits: item.commits || 0
                  })) || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pullRequests"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      name="Pull Requests"
                      dot={{ fill: "hsl(142, 76%, 36%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="issues"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      name="Issues"
                      dot={{ fill: "hsl(38, 92%, 50%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reviews"
                      stroke="hsl(262, 83%, 58%)"
                      strokeWidth={2}
                      name="Reviews"
                      dot={{ fill: "hsl(262, 83%, 58%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commits"
                      stroke="hsl(220, 91%, 60%)"
                      strokeWidth={2}
                      name="Commits"
                      dot={{ fill: "hsl(220, 91%, 60%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <Tabs value={activityView} onValueChange={(v) => setActivityView(v as "recent" | "attention")}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                  <TabsTrigger value="attention">Needs Attention</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {activityView === "recent" && (
                <div className="space-y-4">
                  {(metricsData.recentActivity || []).slice(0, 4).map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="mt-1">
                        <GitPullRequest className="h-5 w-5 text-chart-1" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground leading-relaxed">
                          Daily activity: {activity.pullRequests} PRs, {activity.issues} issues, {activity.reviews} reviews
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">Multiple repositories</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activityView === "attention" && (
                <div className="space-y-4">
                  {(metricsData.topRepositories || []).slice(0, 4).map((repo, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="mt-1">
                        <GitPullRequest className="h-5 w-5 text-chart-1" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{repo.name}</p>
                          <Badge
                            variant={repo.openIssuesCount > 10 ? "destructive" : "secondary"}
                            className={repo.openIssuesCount > 5 ? "bg-chart-4 text-white" : ""}
                          >
                            {repo.openIssuesCount > 10 ? "high" : repo.openIssuesCount > 5 ? "medium" : "low"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{repo.fullName}</span>
                          <span>•</span>
                          <span>{repo.openIssuesCount} open issues</span>
                          <span>•</span>
                          <span>⭐ {repo.stargazersCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showTriageInfo} onOpenChange={setShowTriageInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What are Triaged Issues?</DialogTitle>
            <DialogDescription>Understanding how we calculate triaged issues</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>
              An issue is considered <strong>triaged</strong> when a maintainer has taken meaningful action to organize,
              categorize, or prepare it for resolution. This includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Adding labels (bug, enhancement, documentation, etc.)</li>
              <li>Assigning the issue to a team member or milestone</li>
              <li>Linking related issues or pull requests</li>
              <li>Requesting additional information from the reporter</li>
              <li>Confirming reproduction steps or validating the issue</li>
              <li>Marking as duplicate and closing with reference</li>
            </ul>
            <p className="text-muted-foreground">
              Each maintainer may have different criteria for what constitutes triage based on their project's workflow.
              This metric helps showcase the invisible organizational work that keeps projects running smoothly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
