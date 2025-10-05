"use client"
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
  Loader2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import ApiClient, { Repository } from "@/lib/api"

export default function RepositoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('')
  const [repository, setRepository] = useState<any>(null)
  const [repositoryDetails, setRepositoryDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    params.then(({ slug }) => setSlug(slug))
  }, [params])

  useEffect(() => {
    const fetchRepositoryData = async () => {
      if (!isAuthenticated || authLoading || !slug) return

      try {
        setLoading(true)
        const repositories = await ApiClient.getRepositories()
        const repo = repositories.find(r => 
          r.name === slug || 
          r.fullName === slug || 
          r.fullName.split('/')[1] === slug
        )
        
        if (repo) {
          setRepository(repo)
          
          // Fetch detailed repository data
          const [owner, repoName] = repo.fullName.split('/')
          try {
            const detailResponse = await fetch(`http://localhost:8000/api/repositories/${owner}/${repoName}`, {
              credentials: 'include'
            })
            if (detailResponse.ok) {
              const detailData = await detailResponse.json()
              setRepositoryDetails(detailData.data)
            }
          } catch (detailError) {
            console.log('Could not fetch detailed repository data:', detailError)
          }
        } else {
          toast({
            title: "Repository not found",
            description: "The requested repository could not be found.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Failed to fetch repository data:', error)
        toast({
          title: "Error",
          description: "Failed to load repository data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRepositoryData()
  }, [isAuthenticated, authLoading, slug])

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Loading..." subtitle="Fetching repository data" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!repository) {
    return (
      <div className="flex flex-col">
        <Header title="Repository Not Found" subtitle="The requested repository could not be found" />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-muted-foreground">Repository not found or you don't have access to it.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <Header
        title={repository.name}
        subtitle={`Repository maintainer dashboard - ${repository.fullName}`}
        actions={
          <Button 
            variant="outline" 
            className="gap-2 bg-transparent"
            onClick={() => window.open(repository.htmlUrl, '_blank')}
          >
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
              <div className="text-2xl font-bold text-foreground">{repository.stargazersCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-chart-3" />
                <span className="text-chart-3">GitHub Stars</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Forks</CardTitle>
              <GitFork className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{repository.forksCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">GitHub Forks</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{repository.openIssuesCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Open Issues</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Size</CardTitle>
              <GitPullRequest className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{(repository.size / 1024).toFixed(1)}MB</div>
              <p className="text-xs text-muted-foreground mt-1">Repository Size</p>
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
                  <span className="text-muted-foreground">Repository Stars</span>
                  <span className="font-medium text-foreground">{repository.stargazersCount}</span>
                </div>
                <Progress value={Math.min(repository.stargazersCount / 10, 100)} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-chart-3" />
                    GitHub stars
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Open Issues</span>
                  <span className="font-medium text-foreground">{repository.openIssuesCount}</span>
                </div>
                <Progress value={Math.max(100 - repository.openIssuesCount, 10)} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Issues to resolve</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Repository Forks</span>
                  <span className="font-medium text-foreground">{repository.forksCount}</span>
                </div>
                <Progress value={Math.min(repository.forksCount / 5, 100)} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Community forks</span>
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
                {repositoryDetails?.recent_activity?.pull_requests?.length > 0 ? (
                  repositoryDetails.recent_activity.pull_requests.map((pr: any) => (
                    <div
                      key={pr.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {pr.user?.login?.slice(0, 2).toUpperCase() || 'PR'}
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
                              <span>by {pr.user?.login || 'Unknown'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {pr.comments || 0}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(pr.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`gap-1 ${
                              pr.state === 'closed' ? 'bg-chart-1/20 text-chart-1' : 'bg-chart-2/20 text-chart-2'
                            }`}>
                              {pr.state === 'closed' ? (
                                <>
                                  <GitMerge className="h-3 w-3" />
                                  {pr.merged_at ? 'Merged' : 'Closed'}
                                </>
                              ) : (
                                <>
                                  <GitPullRequest className="h-3 w-3" />
                                  Open
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent pull requests found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {repositoryDetails?.recent_activity?.issues?.length > 0 ? (
                  repositoryDetails.recent_activity.issues.map((issue: any) => (
                    <div
                      key={issue.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {issue.user?.login?.slice(0, 2).toUpperCase() || 'IS'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground leading-relaxed">{issue.title}</p>
                              <Badge variant="outline" className="text-xs">
                                #{issue.number}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>by {issue.user?.login || 'Unknown'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {issue.comments || 0}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(issue.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`gap-1 ${
                              issue.state === 'closed' ? 'bg-chart-1/20 text-chart-1' : 'bg-chart-5/20 text-chart-5'
                            }`}>
                              {issue.state === 'closed' ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  Closed
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  Open
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent issues found.</p>
                )}
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
              <CardHeader>
                <CardTitle className="text-foreground">Recent Commits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {repositoryDetails?.recent_activity?.commits?.length > 0 ? (
                  repositoryDetails.recent_activity.commits.map((commit: any) => (
                    <div
                      key={commit.sha}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {commit.commit?.author?.name?.slice(0, 2).toUpperCase() || 'CM'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium text-foreground leading-relaxed">{commit.commit?.message}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>by {commit.commit?.author?.name || 'Unknown'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(commit.commit?.author?.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {commit.sha.slice(0, 7)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <GitMerge className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent commits found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
