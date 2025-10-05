"use client"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitPullRequest, AlertCircle, MessageSquare, Filter, AlertTriangle, ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { ApiClient, PullRequest, Issue, Discussion, TriageStats } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export default function TriagePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<TriageStats | null>(null)
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])

  useEffect(() => {
    const fetchTriageData = async () => {
      if (!isAuthenticated || authLoading) return;
      
      try {
        setLoading(true)
        const [statsData, prData, issueData, discussionData] = await Promise.all([
          ApiClient.getTriageStats(),
          ApiClient.getPullRequests(),
          ApiClient.getIssues(),
          ApiClient.getDiscussions()
        ])
        
        setStats(statsData)
        setPullRequests(prData)
        setIssues(issueData)
        setDiscussions(discussionData)
      } catch (error) {
        console.error('Error fetching triage data:', error)
        toast({
          title: "Error",
          description: "Failed to load triage data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTriageData()
  }, [isAuthenticated, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading triage data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
                <p className="text-muted-foreground mb-4">
                  Please log in with GitHub to access the triage center.
                </p>
                <Button asChild>
                  <a href="/auth/login">Sign in with GitHub</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }



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
              <div className="text-3xl font-bold text-foreground">{stats?.pendingReviews || 0}</div>
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
              <div className="text-3xl font-bold text-foreground">{stats?.openIssues || 0}</div>
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
              <div className="text-3xl font-bold text-foreground">{stats?.discussionsNeedingResponse || 0}</div>
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
              <div className="text-3xl font-bold text-foreground">{stats?.priorityItems || 0}</div>
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
            {pullRequests.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <GitPullRequest className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pull Requests</h3>
                  <p className="text-muted-foreground">No pull requests need your attention right now.</p>
                </CardContent>
              </Card>
            ) : pullRequests.filter(pr => pr && pr.id).map((pr, index) => (
              <Card key={`pr-${pr.id}-${index}`} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">{pr.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{pr.number}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{pr.repository?.owner || 'unknown'}/{pr.repository?.name || 'unknown'}</span>
                      <span>•</span>
                      <span>{pr.author?.login || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(pr.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            pr.state === "open" 
                              ? "bg-green-500/10 text-green-600 border-green-500/20" 
                              : pr.state === "closed"
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                          }
                          variant="outline"
                        >
                          {pr.state}
                        </Badge>
                        {pr.priority && (
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
                        )}
                        {(pr.labels || []).map((label, index) => {
                          const labelText = typeof label === 'string' ? label : (label && (label as any).name) || `label-${index}`;
                          const labelKey = `pr-${pr.id}-label-${index}-${labelText}`;
                          return (
                            <Badge key={labelKey} variant="secondary" className="text-xs">
                              {labelText}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{pr.labels.length} labels</span>
                        </div>
                        <div className="text-xs">
                          <span>Updated: {new Date(pr.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="gap-2"
                        onClick={() => {
                          if (pr.repository?.owner && pr.repository?.name) {
                            window.open(`https://github.com/${pr.repository.owner}/${pr.repository.name}/pull/${pr.number}`, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Review PR
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`PR #${pr.number}: ${pr.title}`);
                        }}
                      >
                        📋 Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="issues" className="space-y-3 mt-6">
            {issues.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Issues</h3>
                  <p className="text-muted-foreground">No issues need your attention right now.</p>
                </CardContent>
              </Card>
            ) : issues.filter(issue => issue && issue.id).map((issue, index) => (
              <Card key={`issue-${issue.id}-${index}`} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-foreground">{issue.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{issue.number}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{issue.repository?.owner || 'unknown'}/{issue.repository?.name || 'unknown'}</span>
                      <span>•</span>
                      <span>{issue.author?.login || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            issue.state === "open" 
                              ? "bg-green-500/10 text-green-600 border-green-500/20" 
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          }
                          variant="outline"
                        >
                          {issue.state}
                        </Badge>
                        {issue.priority && (
                          <Badge 
                            className={
                              issue.priority === "high"
                                ? "bg-red-400/10 text-red-500 border-red-400/20"
                                : issue.priority === "medium"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-green-500/10 text-green-600 border-green-500/20"
                            }
                            variant="outline"
                          >
                            {issue.priority} priority
                          </Badge>
                        )}
                        {(issue.labels || []).map((label, index) => {
                          const labelText = typeof label === 'string' ? label : (label && (label as any).name) || `label-${index}`;
                          const labelKey = `issue-${issue.id}-label-${index}-${labelText}`;
                          return (
                            <Badge key={labelKey} variant="secondary" className="text-xs">
                              {labelText}
                            </Badge>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{issue.comments}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="gap-2"
                        onClick={() => {
                          if (issue.repository?.owner && issue.repository?.name) {
                            window.open(`https://github.com/${issue.repository.owner}/${issue.repository.name}/issues/${issue.number}`, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Resolve Issue
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`Issue #${issue.number}: ${issue.title}`);
                        }}
                      >
                        📋 Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="gap-2"
                      >
                        🔄 Mark Progress
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="discussions" className="space-y-3 mt-6">
            {discussions.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Discussions</h3>
                  <p className="text-muted-foreground">No discussions need your attention right now.</p>
                </CardContent>
              </Card>
            ) : discussions.filter(discussion => discussion && discussion.id).map((discussion, index) => (
              <Card key={`discussion-${discussion.id}-${index}`} className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">{discussion.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{discussion.repository?.owner || 'unknown'}/{discussion.repository?.name || 'unknown'}</span>
                      <span>•</span>
                      <span>{discussion.author?.login || 'Unknown'}</span>
                      <span>•</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          className={
                            discussion.answerChosenAt 
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                          }
                          variant="outline"
                        >
                          {discussion.answerChosenAt ? "Answered" : "Unanswered"}
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
                        <span>{discussion.commentCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="gap-2"
                        onClick={() => {
                          if (discussion.repository?.owner && discussion.repository?.name) {
                            window.open(`https://github.com/${discussion.repository.owner}/${discussion.repository.name}/discussions/${discussion.id}`, '_blank');
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Join Discussion
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(`Discussion: ${discussion.title}`);
                        }}
                      >
                        📋 Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="gap-2"
                        onClick={() => {
                          // In a real app, this would mark as helpful
                          console.log(`Marked discussion ${discussion.id} as helpful`);
                        }}
                      >
                        👍 Helpful
                      </Button>
                    </div>
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
