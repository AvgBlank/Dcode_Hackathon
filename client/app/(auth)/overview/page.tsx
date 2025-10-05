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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import Link from "next/link"

const sentimentData = [
  { date: "Jan 1", approved: 45, requestChanges: 12, comments: 23 },
  { date: "Jan 8", approved: 52, requestChanges: 15, comments: 28 },
  { date: "Jan 15", approved: 48, requestChanges: 18, comments: 25 },
  { date: "Jan 22", approved: 61, requestChanges: 14, comments: 31 },
  { date: "Jan 29", approved: 58, requestChanges: 16, comments: 29 },
  { date: "Feb 5", approved: 65, requestChanges: 11, comments: 34 },
  { date: "Feb 12", approved: 71, requestChanges: 13, comments: 38 },
]

export default function OverviewPage() {
  const [showTriageInfo, setShowTriageInfo] = useState(false)
  const [activityView, setActivityView] = useState<"recent" | "attention">("recent")
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("30d")

  const getMetricsForTimeRange = () => {
    switch (timeRange) {
      case "1d":
        return { prs: 8, issues: 6, discussions: 5, comments: 12 }
      case "7d":
        return { prs: 42, issues: 31, discussions: 28, comments: 67 }
      case "30d":
      default:
        return { prs: 247, issues: 189, discussions: 156, comments: 534 }
    }
  }

  const metrics = getMetricsForTimeRange()

  return (
    <div className="flex flex-col">
      <Header
        title="Overview"
        subtitle="Your maintainer activity at a glance"
        actions={
          <Button className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share Profile</span>
          </Button>
        }
      />

      <div className="flex-1 p-4 md:p-8">
        {/* <Breadcrumbs items={[{ label: "Overview" }]} /> */}

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
                  <div className="text-3xl font-bold text-foreground">{metrics.prs}</div>
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
                  <div className="text-3xl font-bold text-foreground">{metrics.issues}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+8%</span> from last period
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/history/discussions">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Discussions</CardTitle>
                  <MessageSquare className="h-5 w-5 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metrics.discussions}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+23%</span> from last period
                  </p>
                  <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/history/comments">
              <Card className="bg-card border-border cursor-pointer hover:border-primary transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Comments</CardTitle>
                  <MessageSquare className="h-5 w-5 text-chart-3" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{metrics.comments}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-chart-3" />
                    <span className="text-chart-3">+15%</span> from last period
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
                Maintainer Sentiment Analysis
              </CardTitle>
              <CardDescription>Review patterns over time (Approved vs Request Changes vs Comments)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  approved: {
                    label: "Approved",
                    color: "hsl(142, 76%, 36%)",
                  },
                  requestChanges: {
                    label: "Request Changes",
                    color: "hsl(38, 92%, 50%)",
                  },
                  comments: {
                    label: "Comments",
                    color: "hsl(262, 83%, 58%)",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      name="Approved"
                      dot={{ fill: "hsl(142, 76%, 36%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requestChanges"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      name="Request Changes"
                      dot={{ fill: "hsl(38, 92%, 50%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="hsl(262, 83%, 58%)"
                      strokeWidth={2}
                      name="Comments"
                      dot={{ fill: "hsl(262, 83%, 58%)" }}
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
                  {[
                    {
                      type: "review",
                      repo: "react-ui-kit",
                      title: "Reviewed PR #234: Add dark mode support",
                      time: "2 hours ago",
                      status: "approved",
                    },
                    {
                      type: "issue",
                      repo: "next-starter",
                      title: "Triaged issue #89: Build fails on Windows",
                      time: "4 hours ago",
                      status: "labeled",
                    },
                    {
                      type: "discussion",
                      repo: "react-ui-kit",
                      title: "Answered: How to customize theme colors?",
                      time: "6 hours ago",
                      status: "answered",
                    },
                    {
                      type: "merge",
                      repo: "docs-site",
                      title: "Merged PR #45: Update installation guide",
                      time: "1 day ago",
                      status: "merged",
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="mt-1">
                        {activity.status === "approved" && <CheckCircle2 className="h-5 w-5 text-chart-3" />}
                        {activity.status === "labeled" && <AlertCircle className="h-5 w-5 text-chart-4" />}
                        {activity.status === "answered" && <MessageSquare className="h-5 w-5 text-chart-2" />}
                        {activity.status === "merged" && <GitMerge className="h-5 w-5 text-chart-1" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground leading-relaxed">{activity.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{activity.repo}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activityView === "attention" && (
                <div className="space-y-4">
                  {[
                    {
                      type: "pr",
                      repo: "react-ui-kit",
                      title: "Add TypeScript support for components",
                      count: 3,
                      priority: "high",
                    },
                    {
                      type: "issue",
                      repo: "next-starter",
                      title: "Critical: Memory leak in production",
                      count: 1,
                      priority: "critical",
                    },
                    {
                      type: "discussion",
                      repo: "docs-site",
                      title: "Feature request: Add search functionality",
                      count: 5,
                      priority: "medium",
                    },
                    {
                      type: "pr",
                      repo: "api-client",
                      title: "Refactor authentication flow",
                      count: 2,
                      priority: "medium",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="mt-1">
                        <GitPullRequest className="h-5 w-5 text-chart-1" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground leading-relaxed flex-1">{item.title}</p>
                          <Badge
                            variant={item.priority === "critical" ? "destructive" : "secondary"}
                            className={item.priority === "high" ? "bg-chart-4 text-white" : ""}
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-mono">{item.repo}</span>
                          <span>•</span>
                          <span>{item.count} comments</span>
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
