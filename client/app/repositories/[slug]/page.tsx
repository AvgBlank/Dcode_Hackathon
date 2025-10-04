import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Star,
  GitFork,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  GitMerge,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function RepositoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <div className="flex flex-col">
      <Header
        title={slug}
        subtitle="Repository maintainer dashboard"
        actions={
          <Button variant="outline" className="gap-2 bg-transparent">
            <ExternalLink className="h-4 w-4" />
            View on GitHub
          </Button>
        }
      />

      <div className="flex-1 space-y-6 p-8">
        {/* Repository Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Stars</CardTitle>
              <Star className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">+156</span> this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open PRs</CardTitle>
              <GitPullRequest className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground mt-1">3 need your review</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">23</div>
              <p className="text-xs text-muted-foreground mt-1">5 need triage</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contributors</CardTitle>
              <GitFork className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">87</div>
              <p className="text-xs text-muted-foreground mt-1">12 active this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Your Maintainer Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Your Maintainer Activity</CardTitle>
            <CardDescription>Your contributions to this repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">PR Reviews</span>
                  <span className="font-medium text-foreground">45</span>
                </div>
                <Progress value={75} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-chart-3" />
                    32 approved
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-chart-5" />
                    13 changes requested
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issues Triaged</span>
                  <span className="font-medium text-foreground">12</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>8 labeled</span>
                  <span>4 closed</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">PRs Merged</span>
                  <span className="font-medium text-foreground">23</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>18 features</span>
                  <span>5 fixes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Activity Tabs */}
        <Tabs defaultValue="prs" className="w-full">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="prs">Pull Requests</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="commits">Recent Commits</TabsTrigger>
          </TabsList>

          <TabsContent value="prs" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Pull Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    number: 234,
                    title: "Add dark mode support",
                    author: "contributor1",
                    status: "approved",
                    comments: 5,
                    time: "2 hours ago",
                  },
                  {
                    number: 233,
                    title: "Fix TypeScript types for Button component",
                    author: "contributor2",
                    status: "changes-requested",
                    comments: 3,
                    time: "5 hours ago",
                  },
                  {
                    number: 232,
                    title: "Update documentation for installation",
                    author: "contributor3",
                    status: "merged",
                    comments: 2,
                    time: "1 day ago",
                  },
                ].map((pr, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {pr.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground leading-relaxed">{pr.title}</p>
                            <Badge variant="outline" className="text-xs">
                              #{pr.number}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>by {pr.author}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {pr.comments}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {pr.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {pr.status === "approved" && (
                            <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Approved
                            </Badge>
                          )}
                          {pr.status === "changes-requested" && (
                            <Badge variant="secondary" className="bg-chart-5/20 text-chart-5 gap-1">
                              <XCircle className="h-3 w-3" />
                              Changes Requested
                            </Badge>
                          )}
                          {pr.status === "merged" && (
                            <Badge variant="secondary" className="bg-chart-1/20 text-chart-1 gap-1">
                              <GitMerge className="h-3 w-3" />
                              Merged
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Open Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    number: 89,
                    title: "Build fails on Windows",
                    author: "user1",
                    labels: ["bug", "help wanted"],
                    comments: 8,
                    time: "4 hours ago",
                  },
                  {
                    number: 88,
                    title: "Feature request: Add search functionality",
                    author: "user2",
                    labels: ["enhancement"],
                    comments: 12,
                    time: "1 day ago",
                  },
                ].map((issue, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {issue.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground leading-relaxed">{issue.title}</p>
                            <Badge variant="outline" className="text-xs">
                              #{issue.number}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {issue.labels.map((label, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {label}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>by {issue.author}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {issue.comments}
                            </span>
                            <span>•</span>
                            <span>{issue.time}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Triage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No recent discussions</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commits" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GitMerge className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No recent commits</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
