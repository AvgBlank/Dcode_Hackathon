"use client"

import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitPullRequest, MessageSquare, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"

const metricHistory = {
  prs: {
    title: "PR Review History",
    description: "All pull requests you've reviewed",
    icon: GitPullRequest,
    color: "text-chart-1",
    data: [
      { id: 1, title: "Add dark mode support", repo: "react-ui-kit", date: "2024-02-10", status: "approved" },
      { id: 2, title: "Fix memory leak", repo: "next-starter", date: "2024-02-09", status: "changes-requested" },
      { id: 3, title: "Update dependencies", repo: "api-client", date: "2024-02-08", status: "approved" },
      { id: 4, title: "Refactor auth flow", repo: "react-ui-kit", date: "2024-02-07", status: "commented" },
      { id: 5, title: "Add tests", repo: "docs-site", date: "2024-02-06", status: "approved" },
      { id: 6, title: "Improve performance", repo: "react-ui-kit", date: "2024-02-05", status: "approved" },
      { id: 7, title: "Fix TypeScript errors", repo: "next-starter", date: "2024-02-04", status: "changes-requested" },
      { id: 8, title: "Add new feature", repo: "api-client", date: "2024-02-03", status: "commented" },
    ],
  },
  issues: {
    title: "Issue Triage History",
    description: "All issues you've triaged",
    icon: AlertCircle,
    color: "text-chart-4",
    data: [
      {
        id: 1,
        title: "Build fails on Windows",
        repo: "next-starter",
        date: "2024-02-10",
        reason: "Added bug label and assigned to team",
      },
      {
        id: 2,
        title: "Documentation unclear",
        repo: "docs-site",
        date: "2024-02-09",
        reason: "Labeled as documentation and linked to PR",
      },
      {
        id: 3,
        title: "Feature request: Dark mode",
        repo: "react-ui-kit",
        date: "2024-02-08",
        reason: "Labeled as enhancement and added to roadmap",
      },
      {
        id: 4,
        title: "Performance issue",
        repo: "api-client",
        date: "2024-02-07",
        reason: "Reproduced and labeled as performance",
      },
      {
        id: 5,
        title: "Security vulnerability",
        repo: "react-ui-kit",
        date: "2024-02-06",
        reason: "Marked as critical and escalated",
      },
    ],
  },
  discussions: {
    title: "Discussion Participation History",
    description: "All discussions you've participated in",
    icon: MessageSquare,
    color: "text-chart-2",
    data: [
      { id: 1, title: "How to customize theme?", repo: "react-ui-kit", date: "2024-02-10", replies: 3 },
      { id: 2, title: "Best practices for testing", repo: "next-starter", date: "2024-02-09", replies: 5 },
      { id: 3, title: "Migration guide needed", repo: "api-client", date: "2024-02-08", replies: 2 },
      { id: 4, title: "Feature proposal: SSR support", repo: "react-ui-kit", date: "2024-02-07", replies: 8 },
      { id: 5, title: "Performance optimization tips", repo: "docs-site", date: "2024-02-06", replies: 4 },
    ],
  },
  comments: {
    title: "Comment History",
    description: "All comments you've made",
    icon: MessageSquare,
    color: "text-chart-3",
    data: [
      {
        id: 1,
        content: "Great work! Just a few minor suggestions...",
        repo: "react-ui-kit",
        date: "2024-02-10",
        type: "PR Review",
      },
      { id: 2, content: "Can you add tests for this?", repo: "next-starter", date: "2024-02-09", type: "PR Comment" },
      {
        id: 3,
        content: "This looks like a duplicate of #123",
        repo: "api-client",
        date: "2024-02-08",
        type: "Issue Comment",
      },
      {
        id: 4,
        content: "Have you tried using the new API?",
        repo: "docs-site",
        date: "2024-02-07",
        type: "Discussion Reply",
      },
      {
        id: 5,
        content: "Please update the documentation",
        repo: "react-ui-kit",
        date: "2024-02-06",
        type: "PR Review",
      },
    ],
  },
}

export default function HistoryPage() {
  const params = useParams()
  const type = params.type as keyof typeof metricHistory

  const history = metricHistory[type]
  const Icon = history.icon

  return (
    <div className="flex flex-col">
      <Header title={history.title} subtitle={history.description} />

      <div className="flex-1 p-4 md:p-8">
        <Breadcrumbs items={[{ label: "Overview", href: "/" }, { label: history.title }]} />

        <Card className="bg-card border-border mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${history.color}`} />
              {history.title}
            </CardTitle>
            <CardDescription>{history.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {type === "prs" &&
                history.data.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <Icon className={`h-4 w-4 mt-1 ${history.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-mono">{item.repo}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              {type === "issues" &&
                history.data.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <Icon className={`h-4 w-4 mt-1 ${history.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">Triage reason: {item.reason}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-mono">{item.repo}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              {type === "discussions" &&
                history.data.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <Icon className={`h-4 w-4 mt-1 ${history.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="font-mono">{item.repo}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.replies} replies</span>
                      </div>
                    </div>
                  </div>
                ))}
              {type === "comments" &&
                history.data.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <Icon className={`h-4 w-4 mt-1 ${history.color}`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        <span>•</span>
                        <span className="font-mono">{item.repo}</span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
