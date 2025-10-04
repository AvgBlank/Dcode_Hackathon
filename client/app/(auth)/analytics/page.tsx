"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react"
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

export default function AnalyticsPage() {
  const activityData = [
    { month: "Jan", reviews: 45, issues: 23, discussions: 12, merges: 18 },
    { month: "Feb", reviews: 52, issues: 28, discussions: 15, merges: 22 },
    { month: "Mar", reviews: 48, issues: 31, discussions: 18, merges: 20 },
    { month: "Apr", reviews: 61, issues: 25, discussions: 14, merges: 25 },
    { month: "May", reviews: 58, issues: 29, discussions: 16, merges: 23 },
    { month: "Jun", reviews: 67, issues: 34, discussions: 21, merges: 28 },
  ]

  const sentimentData = [
    { month: "Jan", approved: 35, changesRequested: 10, neutral: 5 },
    { month: "Feb", approved: 40, changesRequested: 12, neutral: 8 },
    { month: "Mar", approved: 38, changesRequested: 10, neutral: 6 },
    { month: "Apr", approved: 48, changesRequested: 13, neutral: 7 },
    { month: "May", approved: 45, changesRequested: 13, neutral: 8 },
    { month: "Jun", approved: 52, changesRequested: 15, neutral: 9 },
  ]

  const timeData = [
    { day: "Mon", hours: 4.5 },
    { day: "Tue", hours: 6.2 },
    { day: "Wed", hours: 5.8 },
    { day: "Thu", hours: 7.1 },
    { day: "Fri", hours: 5.3 },
    { day: "Sat", hours: 2.1 },
    { day: "Sun", hours: 1.8 },
  ]

  const responseTimeData = [
    { week: "Week 1", avgTime: 3.2, target: 2.5 },
    { week: "Week 2", avgTime: 2.8, target: 2.5 },
    { week: "Week 3", avgTime: 2.4, target: 2.5 },
    { week: "Week 4", avgTime: 2.1, target: 2.5 },
  ]

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
            <Button className="gap-2">
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
              <div className="text-3xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">+18%</span> from last period
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-medium text-foreground">331</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Issues</span>
                  <span className="font-medium text-foreground">170</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">2.4h</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">-12%</span> faster than before
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-medium text-foreground">2.5h</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-chart-3 text-white h-4 text-[10px] px-1.5">On Track</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">78%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">+5%</span> from last period
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="font-medium text-foreground">258</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Changes Req.</span>
                  <span className="font-medium text-foreground">73</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">32.8h</div>
              <p className="text-xs text-muted-foreground mt-1">Avg per week</p>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Peak Day</span>
                  <span className="font-medium text-foreground">Thursday</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Peak Hours</span>
                  <span className="font-medium text-foreground">7.1h</span>
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
                    <div className="text-2xl font-bold text-foreground">331</div>
                    <p className="text-sm text-muted-foreground">Total PR Reviews</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">170</div>
                    <p className="text-sm text-muted-foreground">Issues Triaged</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">96</div>
                    <p className="text-sm text-muted-foreground">Discussions</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">136</div>
                    <p className="text-sm text-muted-foreground">PRs Merged</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Review Patterns Analysis</CardTitle>
                <CardDescription>
                  Your review patterns and sentiment - higher "changes requested" indicates thorough code review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    approved: {
                      label: "Approved",
                      color: "hsl(var(--chart-3))",
                    },
                    changesRequested: {
                      label: "Changes Requested",
                      color: "hsl(var(--chart-4))",
                    },
                    neutral: {
                      label: "Commented",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sentimentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="changesRequested" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="neutral" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Approval Rate</span>
                          <Badge className="bg-chart-3 text-white">78%</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          You approve most PRs, showing trust in contributors
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Thoroughness Score</span>
                          <Badge className="bg-chart-4 text-white">22%</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          You request changes when needed, maintaining code quality
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50 border-border">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Engagement</span>
                          <Badge className="bg-chart-2 text-white">High</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Active participation in code discussions
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
                    <BarChart data={timeData}>
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
                    <div className="text-2xl font-bold text-foreground">32.8h</div>
                    <p className="text-sm text-muted-foreground">Total weekly hours</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">4.7h</div>
                    <p className="text-sm text-muted-foreground">Average per day</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground">Thu</div>
                    <p className="text-sm text-muted-foreground">Most active day</p>
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
                    <LineChart data={responseTimeData}>
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
                            <span className="text-muted-foreground">Current Avg</span>
                            <span className="font-medium text-foreground">2.1h</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Target</span>
                            <span className="font-medium text-foreground">2.5h</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Improvement</span>
                            <span className="font-medium text-chart-3">-34%</span>
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
                          Your response time has consistently improved over the past month, now beating the target by
                          16%. Keep up the excellent work!
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
                      <span className="text-sm text-muted-foreground">Contributors Mentored</span>
                      <span className="text-xl font-bold text-foreground">34</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">First-time Contributors Helped</span>
                      <span className="text-xl font-bold text-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Documentation Improvements</span>
                      <span className="text-xl font-bold text-foreground">42</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">CI/CD Fixes</span>
                      <span className="text-xl font-bold text-foreground">18</span>
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
                      <span className="text-xl font-bold text-foreground">156</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">PRs Merged</span>
                      <span className="text-xl font-bold text-foreground">89</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Stale Issues Addressed</span>
                      <span className="text-xl font-bold text-foreground">23</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground">Security Patches Reviewed</span>
                      <span className="text-xl font-bold text-foreground">7</span>
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
                    <div className="text-3xl font-bold text-chart-3 mb-1">92%</div>
                    <p className="text-sm text-muted-foreground">Repository Health Score</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="text-3xl font-bold text-chart-1 mb-1">Top 5%</div>
                    <p className="text-sm text-muted-foreground">Among All Maintainers</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-secondary/30">
                    <div className="text-3xl font-bold text-chart-4 mb-1">4.8/5</div>
                    <p className="text-sm text-muted-foreground">Community Rating</p>
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
