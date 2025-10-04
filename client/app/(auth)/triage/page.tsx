"use client"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitPullRequest, AlertCircle, MessageSquare, Filter, AlertTriangle, ExternalLink } from "lucide-react"

export default function TriagePage() {
  const pullRequests = [
    {
      id: 1,
      number: 234,
      title: "Add dark mode support to all components",
      repo: "react-ui-kit",
      author: "contributor1",
      status: "needs-review",
      priority: "high",
      labels: ["enhancement", "ui"],
      comments: 5,
      time: "2 hours ago",
      additions: 234,
      deletions: 45,
    },
    {
      id: 2,
      number: 233,
      title: "Fix TypeScript types for Button component",
      repo: "react-ui-kit",
      author: "contributor2",
      status: "changes-requested",
      priority: "medium",
      labels: ["bug", "typescript"],
      comments: 3,
      time: "5 hours ago",
      additions: 12,
      deletions: 8,
    },
  ]

  const issues = [
    {
      id: 1,
      number: 89,
      title: "Build fails on Windows with Node 18",
      repo: "next-starter",
      author: "user1",
      status: "needs-triage",
      priority: "critical",
      labels: ["bug"],
      comments: 8,
      time: "4 hours ago",
    },
    {
      id: 2,
      number: 88,
      title: "Feature request: Add search functionality to docs",
      repo: "docs-site",
      author: "user2",
      status: "labeled",
      priority: "medium",
      labels: ["enhancement", "documentation"],
      comments: 12,
      time: "1 day ago",
    },
  ]

  const discussions = [
    {
      id: 1,
      title: "How to customize theme colors?",
      repo: "react-ui-kit",
      author: "user4",
      category: "Q&A",
      status: "unanswered",
      comments: 3,
      time: "6 hours ago",
    },
    {
      id: 2,
      title: "Proposal: Add support for custom hooks",
      repo: "react-ui-kit",
      author: "user5",
      category: "Ideas",
      status: "answered",
      comments: 18,
      time: "2 days ago",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header title="Triage Center" subtitle="Manage issues, PRs, and discussions across all repositories" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
                <GitPullRequest className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground mt-1.5">Pull requests waiting</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Needs Triage</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">8</div>
              <p className="text-xs text-muted-foreground mt-1.5">Issues to categorize</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Unanswered</CardTitle>
                <MessageSquare className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">5</div>
              <p className="text-xs text-muted-foreground mt-1.5">Discussions pending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">3</div>
              <p className="text-xs text-muted-foreground mt-1.5">High priority items</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title, author, or label..."
                    className="bg-secondary/50 border-border h-10 w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border h-10">
                      <SelectValue placeholder="Repository" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Repositories</SelectItem>
                      <SelectItem value="react-ui-kit">react-ui-kit</SelectItem>
                      <SelectItem value="next-starter">next-starter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="gap-2 bg-secondary/50 h-10">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="prs" className="w-full">
          <TabsList className="bg-secondary/50 border border-border">
            <TabsTrigger value="prs">Pull Requests</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="prs" className="space-y-3 mt-6">
            {pullRequests.map((pr) => (
              <Card key={pr.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">{pr.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{pr.number}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{pr.repo}</span>
                      <span>•</span>
                      <span>{pr.author}</span>
                      <span>•</span>
                      <span>{pr.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            pr.status === "needs-review" 
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20" 
                              : pr.status === "changes-requested"
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                          variant="outline"
                        >
                          {pr.status.replace("-", " ")}
                        </Badge>
                        <Badge 
                          className={
                            pr.priority === "high" 
                              ? "bg-red-500/10 text-red-600 border-red-500/20" 
                              : pr.priority === "medium"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/20"
                          }
                          variant="outline"
                        >
                          {pr.priority} priority
                        </Badge>
                        {pr.labels.map((label) => (
                          <Badge key={label} variant="secondary" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{pr.comments}</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-green-500">+{pr.additions}</span>
                          <span className="text-red-500 ml-1">-{pr.deletions}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      View on GitHub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="issues" className="space-y-3 mt-6">
            {issues.map((issue) => (
              <Card key={issue.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">{issue.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{issue.number}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{issue.repo}</span>
                      <span>•</span>
                      <span>{issue.author}</span>
                      <span>•</span>
                      <span>{issue.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            issue.status === "needs-triage" 
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20" 
                              : issue.status === "labeled"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : issue.status === "assigned"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                          }
                          variant="outline"
                        >
                          {issue.status.replace("-", " ")}
                        </Badge>
                        <Badge 
                          className={
                            issue.priority === "critical" 
                              ? "bg-red-500/10 text-red-600 border-red-500/20" 
                              : issue.priority === "high"
                              ? "bg-red-400/10 text-red-500 border-red-400/20"
                              : issue.priority === "medium"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-green-500/10 text-green-600 border-green-500/20"
                          }
                          variant="outline"
                        >
                          {issue.priority} priority
                        </Badge>
                        {issue.labels.map((label) => (
                          <Badge key={label} variant="secondary" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{issue.comments}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      View on GitHub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-3 mt-6">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">{discussion.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{discussion.repo}</span>
                      <span>•</span>
                      <span>{discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            discussion.status === "unanswered" 
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20" 
                              : discussion.status === "answered"
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : discussion.status === "closed"
                              ? "bg-gray-500/10 text-gray-600 border-gray-500/20"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          }
                          variant="outline"
                        >
                          {discussion.status}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/20"
                        >
                          {discussion.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.comments}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      View on GitHub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
