"use client"

import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, GitFork, Eye, GitPullRequest, AlertCircle, ExternalLink, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { ApiClient, Repository } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true)
        const data = await ApiClient.getRepositories()
        // Remove duplicates based on repository full name
        const uniqueRepos = data.filter((repo, index, arr) => 
          arr.findIndex(r => r.fullName === repo.fullName) === index
        )
        setRepositories(uniqueRepos)
      } catch (error) {
        console.error('Failed to fetch repositories:', error)
        toast({
          title: "Error",
          description: "Failed to load repositories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRepositories()
  }, [])

  const filteredRepositories = (repositories || []).filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const highActivityRepos = (repositories || []).filter(repo => repo.activityLevel === 'high')
  const starredRepos = (repositories || []).filter(repo => repo.stargazersCount > 50) // Arbitrary threshold

  return (
    <div className="flex flex-col">
      <Header title="Repositories" subtitle="Manage and track your maintained repositories" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Breadcrumbs items={[{ label: "Repositories" }]} />

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search repositories..." 
              className="pl-9 bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 bg-background">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-muted rounded animate-pulse w-48" />
                      <div className="h-4 bg-muted rounded animate-pulse w-full" />
                    </div>
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-6">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 bg-muted rounded animate-pulse w-16" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-secondary border border-border">
              <TabsTrigger value="all">All Repositories ({repositories.length})</TabsTrigger>
              <TabsTrigger value="starred">Starred ({starredRepos.length})</TabsTrigger>
              <TabsTrigger value="active">Most Active ({highActivityRepos.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              {filteredRepositories.map((repo, i) => (
              <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <Link href={`/repositories/${repo.name}`}>
                          <CardTitle className="text-foreground hover:text-primary transition-colors cursor-pointer">
                            {repo.name}
                          </CardTitle>
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {repo.language}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            repo.activityLevel === "high"
                              ? "bg-chart-3/20 text-chart-3"
                              : repo.activityLevel === "medium"
                                ? "bg-chart-4/20 text-chart-4"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {repo.activityLevel || 'medium'} activity
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            (repo.healthScore || 0) >= 90
                              ? "bg-chart-3/20 text-chart-3"
                              : (repo.healthScore || 0) >= 80
                                ? "bg-chart-1/20 text-chart-1"
                                : "bg-chart-4/20 text-chart-4"
                          }
                        >
                          {repo.healthScore || 85}% health
                        </Badge>
                      </div>
                      <CardDescription>{repo.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{repo.stargazersCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forksCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{repo.size}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitPullRequest className="h-4 w-4 text-chart-1" />
                        <span>{repo.openPullRequests || 0} open PRs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-chart-4" />
                        <span>{repo.openIssuesCount} open issues</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{repo.totalContributors || 0}</div>
                          <div className="text-xs text-muted-foreground">Contributors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{repo.forksCount}</div>
                          <div className="text-xs text-muted-foreground">Forks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{new Date(repo.pushedAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : Math.floor((Date.now() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24))}</div>
                          <div className="text-xs text-muted-foreground">Days ago</div>
                        </div>
                      </div>
                      <Link href={`/repositories/${repo.name}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

            <TabsContent value="starred" className="space-y-4 mt-6">
              {starredRepos.length > 0 ? (
                starredRepos.map((repo, i) => (
                  <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <Link href={`/repositories/${repo.owner.login}/${repo.name}`}>
                              <CardTitle className="text-foreground hover:text-primary transition-colors cursor-pointer">
                                {repo.name}
                              </CardTitle>
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {repo.language || 'Unknown'}
                            </Badge>
                            <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
                              ⭐ {repo.stargazersCount}
                            </Badge>
                          </div>
                          <CardDescription>{repo.description}</CardDescription>
                        </div>
                        <Link href={`/repositories/${repo.owner.login}/${repo.name}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No starred repositories found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4 mt-6">
              {highActivityRepos.length > 0 ? (
                highActivityRepos.map((repo, i) => (
                  <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <Link href={`/repositories/${repo.owner.login}/${repo.name}`}>
                              <CardTitle className="text-foreground hover:text-primary transition-colors cursor-pointer">
                                {repo.name}
                              </CardTitle>
                            </Link>
                            <Badge variant="outline" className="text-xs">
                              {repo.language || 'Unknown'}
                            </Badge>
                            <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
                              {repo.activityLevel} activity
                            </Badge>
                          </div>
                          <CardDescription>{repo.description}</CardDescription>
                        </div>
                        <Link href={`/repositories/${repo.owner.login}/${repo.name}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <GitPullRequest className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No highly active repositories found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
