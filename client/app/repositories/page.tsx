"use client"

import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, GitFork, Eye, GitPullRequest, AlertCircle, ExternalLink, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default function RepositoriesPage() {
  const repositories = [
    {
      name: "react-ui-kit",
      description: "A comprehensive React component library with TypeScript support",
      stars: 2847,
      forks: 342,
      watchers: 156,
      openPRs: 12,
      openIssues: 23,
      language: "TypeScript",
      activity: "high",
      healthScore: 92,
      yourContributions: {
        reviews: 45,
        merges: 23,
        issues: 12,
      },
    },
    {
      name: "next-starter",
      description: "Production-ready Next.js starter template with best practices",
      stars: 1523,
      forks: 234,
      watchers: 89,
      openPRs: 8,
      openIssues: 15,
      language: "JavaScript",
      activity: "medium",
      healthScore: 85,
      yourContributions: {
        reviews: 32,
        merges: 18,
        issues: 8,
      },
    },
    {
      name: "docs-site",
      description: "Documentation site built with Next.js and MDX",
      stars: 892,
      forks: 123,
      watchers: 45,
      openPRs: 5,
      openIssues: 9,
      language: "TypeScript",
      activity: "medium",
      healthScore: 88,
      yourContributions: {
        reviews: 28,
        merges: 15,
        issues: 6,
      },
    },
    {
      name: "api-client",
      description: "REST API client with automatic retry and caching",
      stars: 645,
      forks: 78,
      watchers: 34,
      openPRs: 3,
      openIssues: 7,
      language: "TypeScript",
      activity: "low",
      healthScore: 78,
      yourContributions: {
        reviews: 18,
        merges: 9,
        issues: 4,
      },
    },
  ]

  return (
    <div className="flex flex-col">
      <Header title="Repositories" subtitle="Manage and track your maintained repositories" />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Breadcrumbs items={[{ label: "Repositories" }]} />

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search repositories..." className="pl-9 bg-background border-border" />
          </div>
          <Button variant="outline" className="gap-2 bg-background">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="all">All Repositories</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="active">Most Active</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {repositories.map((repo, i) => (
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
                            repo.activity === "high"
                              ? "bg-chart-3/20 text-chart-3"
                              : repo.activity === "medium"
                                ? "bg-chart-4/20 text-chart-4"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {repo.activity} activity
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            repo.healthScore >= 90
                              ? "bg-chart-3/20 text-chart-3"
                              : repo.healthScore >= 80
                                ? "bg-chart-1/20 text-chart-1"
                                : "bg-chart-4/20 text-chart-4"
                          }
                        >
                          {repo.healthScore}% health
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
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-4 w-4" />
                        <span>{repo.forks}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{repo.watchers}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitPullRequest className="h-4 w-4 text-chart-1" />
                        <span>{repo.openPRs} open PRs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4 text-chart-4" />
                        <span>{repo.openIssues} open issues</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{repo.yourContributions.reviews}</div>
                          <div className="text-xs text-muted-foreground">Reviews</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{repo.yourContributions.merges}</div>
                          <div className="text-xs text-muted-foreground">Merges</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground">{repo.yourContributions.issues}</div>
                          <div className="text-xs text-muted-foreground">Issues</div>
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
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Star repositories to see them here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4 mt-6">
            {repositories
              .filter((r) => r.activity === "high")
              .map((repo, i) => (
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
                          <Badge variant="secondary" className="bg-chart-3/20 text-chart-3">
                            {repo.activity} activity
                          </Badge>
                        </div>
                        <CardDescription>{repo.description}</CardDescription>
                      </div>
                      <Link href={`/repositories/${repo.name}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
