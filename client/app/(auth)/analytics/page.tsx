"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, TrendingDown, Calendar, Loader2 } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import ApiClient, { AnalyticsData } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!isAuthenticated || authLoading) return;
      
      try {
        setLoading(true)
        const data = await ApiClient.getDetailedAnalytics()
        setAnalyticsData(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
        toast({
          title: "Error", 
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [isAuthenticated, authLoading])

  const handleExport = async (format: 'pdf') => {
    try {
      // Generate HTML CV content
      const htmlContent = generateReportHTML()
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `maintainer-analytics-report.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Export successful",
        description: "Analytics report downloaded as HTML! You can print it as PDF from your browser.",
      })
    } catch (error) {
      console.error('Failed to export:', error)
      toast({
        title: "Export failed",
        description: "Failed to export analytics report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintainer Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .metric { padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center; background: #f9f9f9; }
            h1, h2 { color: #333; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Maintainer Analytics Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <h3>Total Contributions</h3>
              <p style="font-size: 24px; font-weight: bold;">${(analyticsData as any)?.summary_cards?.total_contributions || 0}</p>
            </div>
            <div class="metric">
              <h3>PRs Merged</h3>
              <p style="font-size: 24px; font-weight: bold;">${(analyticsData as any)?.impact_metrics?.prs_merged || 0}</p>
            </div>
            <div class="metric">
              <h3>Issues Closed</h3>
              <p style="font-size: 24px; font-weight: bold;">${(analyticsData as any)?.impact_metrics?.issues_closed || 0}</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  if (authLoading || loading) {
    return (
      <div className="flex flex-col">
        <Header title="Analytics" subtitle="Deep dive into your maintainer metrics" />
        <div className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex flex-col">
        <Header title="Analytics" subtitle="Deep dive into your maintainer metrics" />
        <div className="flex-1 p-4 md:p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No analytics data available. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    )
  }

  // Prepare chart data from API response  
  const activityData = (analyticsData as any).activity_trends || []
  const sentimentData = (analyticsData as any).sentiment_data || []

  return (
    <div className="flex flex-col">
      <Header
        title="Analytics"
        subtitle="Deep insights into your maintainer contributions"
        actions={
          <div className="flex items-center gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[140px] bg-background">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="gap-2" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        }
      />

      <div className="flex-1 space-y-6 p-8">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {((analyticsData as any)?.summary_cards?.total_contributions || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">+18%</span> from last period
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.impact_metrics?.prs_merged || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Issues</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.impact_metrics?.issues_closed || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">PRs Merged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(analyticsData as any)?.impact_metrics?.prs_merged || 0}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">
                  +{Math.floor(((analyticsData as any)?.impact_metrics?.prs_merged || 0) * 0.15)}
                </span> this period
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Issues Closed</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.impact_metrics?.issues_closed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-chart-3 text-white h-4 text-[10px] px-1.5">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(analyticsData as any)?.summary?.active_repositories || 0}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">
                  {Math.round(((analyticsData as any)?.summary?.active_repositories || 0) / ((analyticsData as any)?.summary?.total_repositories || 1) * 100)}%
                </span> of total repos
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Repos</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.summary?.total_repositories || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Stars</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.summary?.total_stars || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Forks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {(analyticsData as any)?.summary?.total_forks || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all repositories</p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Stars</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.summary?.total_stars || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Repositories</span>
                  <span className="font-medium text-foreground">
                    {(analyticsData as any)?.summary?.total_repositories || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="activity">Activity Trends</TabsTrigger>
            <TabsTrigger value="sentiment">Review Patterns</TabsTrigger>
            <TabsTrigger value="time">Time Investment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Maintainer Activity Over Time</CardTitle>
                <CardDescription>Your contributions across different categories</CardDescription>
              </CardHeader>
              <CardContent>

  <ChartContainer
  config={{
    reviews: { label: "PR Reviews", color: "#FFC300" },
    issues: { label: "Issues Triaged", color: "#FF5733" },
    discussions: { label: "Discussions", color: "#28A745" },
    merges: { label: "PRs Merged", color: "#33C1FF" },
  }}
  className="h-[400px]"
>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="reviews"
                        stackId="1"
                        stroke="#3B82F6"  // soft blue stroke
                        fill="#3B82F6"    // soft blue fill
                        fillOpacity={0.9}
                      />
                      <Area
                        type="monotone"
                        dataKey="issues"
                        stackId="1"
                        stroke="#10B981"  // soft green stroke
                        fill="#10B981"    // soft green fill
                        fillOpacity={0.9}
                      />
                      <Area
                        type="monotone"
                        dataKey="discussions"
                        stackId="1"
                        stroke="#8B5CF6"  // soft purple stroke
                        fill="#8B5CF6"
                        fillOpacity={0.9}
                      />
                      <Area
                        type="monotone"
                        dataKey="merges"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                        fillOpacity={0.9}
                      />

                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {activityData.reduce((sum: number, day: any) => sum + (day.reviews || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total PR Reviews</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {activityData.reduce((sum: number, day: any) => sum + (day.issues || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Issues Triaged</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {activityData.reduce((sum: number, day: any) => sum + (day.discussions || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Discussions</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {activityData.reduce((sum: number, day: any) => sum + (day.merges || 0), 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">PRs Merged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Repository Distribution</CardTitle>
                <CardDescription>
                  Your repositories by programming language and activity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    stars: {
                      label: "Stars",
                      color: "hsl(var(--chart-3))",
                    },
                    forks: {
                      label: "Forks",
                      color: "hsl(var(--chart-4))",
                    },
                    issues: {
                      label: "Open Issues",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      {
                        category: "Your Repos",
                        stars: (analyticsData as any)?.summary?.total_stars || 0,
                        forks: (analyticsData as any)?.summary?.total_forks || 0,
                        issues: (analyticsData as any)?.impact_metrics?.issues_closed || 0,
                      }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="stars" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="forks" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="issues" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Active Repositories</span>
                          <Badge className="bg-chart-3 text-white">
                            {(analyticsData as any)?.summary?.active_repositories || 0}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Repositories with recent activity
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Stars</span>
                          <Badge className="bg-chart-4 text-white">
                            {(analyticsData as any)?.summary?.total_stars || 0}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Stars across all repositories
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Forks</span>
                          <Badge className="bg-chart-2 text-white">
                            {(analyticsData as any)?.summary?.total_forks || 0}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Community engagement through forks
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Time Investment</CardTitle>
                <CardDescription>Average hours spent on maintainer activities per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    hours: {
                      label: "Hours",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData.slice(0, 7).map((item: any) => ({ 
                      day: new Date(item.date || item.month).toLocaleDateString('en-US', { weekday: 'short' }),
                      hours: (item.total || item.reviews + item.issues + item.discussions + item.merges) / 20 
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {(analyticsData as any)?.impact_metrics?.prs_merged || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">PRs Merged</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {(analyticsData as any)?.impact_metrics?.issues_closed || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Issues Closed</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">
                      {(analyticsData as any)?.summary?.total_stars || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Stars</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Response Time Performance</CardTitle>
                <CardDescription>Tracking your average response time against target goals</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgTime: {
                      label: "Avg Response Time",
                      color: "hsl(var(--chart-1))",
                    },
                    target: {
                      label: "Target",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData.slice(0, 8).map((item: any, index: number) => ({ 
                      week: `W${index + 1}`,
                      avgTime: item.total_contributions > 0 ? (item.total_contributions / 10) : 0.5, // Convert contributions to estimated hours
                      target: 2.5
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="avgTime"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#3b82f6" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Current Performance</span>
                          <Badge className="bg-chart-3 text-white">Excellent</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">PRs Merged</span>
                            <span className="font-medium text-foreground">
                              {(analyticsData as any)?.impact_metrics?.prs_merged || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Issues Closed</span>
                            <span className="font-medium text-foreground">
                              {(analyticsData as any)?.impact_metrics?.issues_closed || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Forks</span>
                            <span className="font-medium text-chart-3">
                              {(analyticsData as any)?.summary?.total_forks || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Trend Analysis</span>
                          <TrendingDown className="h-4 w-4 text-chart-3" />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Your maintainer activity shows consistent engagement across repositories. 
                          Active participation in {(analyticsData as any)?.summary?.active_repositories || 0} repositories.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Community Impact</CardTitle>
                  <CardDescription>How your work helps the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Total Repositories</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.total_repositories || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Active Repositories</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.active_repositories || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Total Stars</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.total_stars || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Total Forks</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.total_forks || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Repository Health</CardTitle>
                  <CardDescription>Your contribution to project health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Issues Closed</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.impact_metrics?.issues_closed || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">PRs Merged</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.impact_metrics?.prs_merged || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Active Repositories</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.active_repositories || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Total Stars</span>
                      <span className="text-xl font-bold text-foreground">
                        {(analyticsData as any)?.summary?.total_stars || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Key Achievements</CardTitle>
                <CardDescription>Notable milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="text-3xl font-bold text-chart-3 mb-1">
                      {(analyticsData as any)?.summary?.total_stars || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Stars Received</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="text-3xl font-bold text-chart-1 mb-1">
                      {(analyticsData as any)?.summary?.total_repositories || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Repositories</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="text-3xl font-bold text-chart-4 mb-1">
                      {(analyticsData as any)?.summary?.total_forks || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Forks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
