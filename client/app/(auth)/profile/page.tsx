"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Share2,
  Download,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  LinkIcon,
  Calendar,
  Award,
  TrendingUp,
  GitPullRequest,
  AlertCircle,
  MessageSquare,
  FileText,
  Settings,
  ExternalLink,
  Star,
  Users,
  Clock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title="My Profile"
        subtitle="Your public maintainer profile and contribution CV"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent hidden sm:flex">
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export CV</span>
            </Button>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        }
      />

      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-card to-secondary/30 border-border lg:col-span-1">
            <CardContent className="pt-6 md:pt-8">
              <div className="flex flex-col items-center text-center space-y-4 md:space-y-5">
                <div className="relative">
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg">
                    JM
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 md:h-8 md:w-8 rounded-full bg-purple-500 border-4 border-card flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-white fill-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">John Maintainer</h2>
                  <p className="text-muted-foreground font-medium">@johnmaint</p>
                  <Badge variant="secondary" className="gap-1.5">
                    <Award className="h-3 w-3" />
                    Core Maintainer
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  Open source maintainer passionate about building developer tools and fostering inclusive communities.
                </p>

                <div className="w-full space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                    <Calendar className="h-4 w-4" />
                    <span>Maintaining since 2020</span>
                  </div>
                </div>

                <div className="w-full pt-4 space-y-3">
                  <Button variant="outline" className="w-full gap-2 bg-background/50 hover:bg-background">
                    <Github className="h-4 w-4" />
                    <span className="hidden sm:inline">View GitHub Profile</span>
                    <span className="sm:hidden">GitHub</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-full">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-full">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-full">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-full">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Contribution Summary</CardTitle>
                <CardDescription>Your maintainer impact at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-blue-500/10">
                          <GitPullRequest className="h-4 w-4 text-blue-500" />
                        </div>
                        PR Reviews
                      </span>
                      <span className="text-lg font-bold text-foreground">247</span>
                    </div>
                    <Progress value={85} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">85% of monthly goal</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-orange-500/10">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        Issues Triaged
                      </span>
                      <span className="text-lg font-bold text-foreground">189</span>
                    </div>
                    <Progress value={75} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">75% of monthly goal</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-green-500/10">
                          <MessageSquare className="h-4 w-4 text-green-500" />
                        </div>
                        Discussions
                      </span>
                      <span className="text-lg font-bold text-foreground">156</span>
                    </div>
                    <Progress value={65} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">65% of monthly goal</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-purple-500/10">
                          <FileText className="h-4 w-4 text-purple-500" />
                        </div>
                        Docs Updated
                      </span>
                      <span className="text-lg font-bold text-foreground">42</span>
                    </div>
                    <Progress value={55} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">55% of monthly goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Contributions</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1,247</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                    <span className="text-green-600 dark:text-green-400 font-medium">+18%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Repositories</CardTitle>
                    <Github className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">12</div>
                  <p className="text-xs text-muted-foreground mt-2">Actively maintained</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">2.4h</div>
                  <p className="text-xs text-muted-foreground mt-2">Average response</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="bg-secondary/50 border border-border h-auto flex-wrap justify-start">
            <TabsTrigger value="cv" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Contribution CV</span>
              <span className="sm:hidden">CV</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Achievements</span>
              <span className="sm:hidden">Awards</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-foreground">Maintainer Contribution CV</CardTitle>
                    <CardDescription>A comprehensive view of your invisible labor</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent w-full sm:w-auto">
                    <Share2 className="h-4 w-4" />
                    Share CV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                      <GitPullRequest className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">Pull Request Reviews</h3>
                      <p className="text-sm text-muted-foreground">Code quality and collaboration</p>
                    </div>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border">
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">247</div>
                      <p className="text-sm text-muted-foreground">Total reviews</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">192</div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">55</div>
                      <p className="text-sm text-muted-foreground">Changes requested</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Reviewed 247 pull requests across 12 repositories, providing constructive feedback and maintaining
                    code quality standards. 78% approval rate demonstrates trust in contributors while maintaining high
                    standards.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10 shrink-0">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">Issue Triage & Management</h3>
                      <p className="text-sm text-muted-foreground">Organization and prioritization</p>
                    </div>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border">
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">189</div>
                      <p className="text-sm text-muted-foreground">Issues triaged</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">156</div>
                      <p className="text-sm text-muted-foreground">Closed</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">234</div>
                      <p className="text-sm text-muted-foreground">Labels added</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Triaged and managed 189 issues, ensuring proper categorization and prioritization. Closed 156 issues
                    through investigation, reproduction, and coordination with contributors.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 shrink-0">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">Community Engagement</h3>
                      <p className="text-sm text-muted-foreground">Building and supporting community</p>
                    </div>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border">
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">156</div>
                      <p className="text-sm text-muted-foreground">Discussions</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">34</div>
                      <p className="text-sm text-muted-foreground">Contributors mentored</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">12</div>
                      <p className="text-sm text-muted-foreground">First-timers helped</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Active community member with 156 discussion participations. Mentored 34 contributors and helped 12
                    first-time contributors make their initial open source contributions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        Documentation & Infrastructure
                      </h3>
                      <p className="text-sm text-muted-foreground">Maintenance and improvements</p>
                    </div>
                  </div>
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border">
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">42</div>
                      <p className="text-sm text-muted-foreground">Docs updated</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">18</div>
                      <p className="text-sm text-muted-foreground">CI/CD fixes</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">7</div>
                      <p className="text-sm text-muted-foreground">Security patches</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Maintained and improved documentation with 42 updates. Fixed 18 CI/CD issues and reviewed 7 security
                    patches to keep projects secure and well-documented.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Achievements & Milestones</CardTitle>
                <CardDescription>Recognition for your maintainer contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {[
                    {
                      icon: Award,
                      title: "100 PR Reviews",
                      description: "Reviewed your 100th pull request",
                      date: "March 2024",
                      color: "blue",
                    },
                    {
                      icon: Users,
                      title: "Community Champion",
                      description: "Helped 10+ first-time contributors",
                      date: "February 2024",
                      color: "green",
                    },
                    {
                      icon: AlertCircle,
                      title: "Issue Resolver",
                      description: "Closed 100+ issues",
                      date: "January 2024",
                      color: "orange",
                    },
                    {
                      icon: FileText,
                      title: "Documentation Hero",
                      description: "Made 25+ documentation improvements",
                      date: "December 2023",
                      color: "purple",
                    },
                  ].map((achievement, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 md:p-5 rounded-lg bg-gradient-to-br from-${achievement.color}-500/10 to-${achievement.color}-500/5 border border-${achievement.color}-500/20`}
                    >
                      <div className={`p-2.5 rounded-lg bg-${achievement.color}-500/10 shrink-0`}>
                        <achievement.icon className={`h-5 w-5 md:h-6 md:w-6 text-${achievement.color}-500`} />
                      </div>
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm md:text-base">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Skills & Expertise</CardTitle>
                <CardDescription>Technologies and areas you maintain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                    Programming Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["TypeScript", "JavaScript", "Python", "Go", "Rust"].map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm px-3 py-1.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    Frameworks & Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "Node.js", "Docker", "Kubernetes", "GitHub Actions"].map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm px-3 py-1.5">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-purple-500" />
                    Maintainer Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Code Review", "Issue Triage", "Community Management", "Documentation", "CI/CD", "Security"].map(
                      (skill) => (
                        <Badge key={skill} variant="outline" className="text-sm px-3 py-1.5">
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Settings</CardTitle>
                <CardDescription>Manage your profile visibility and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Privacy</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Public Profile</p>
                      <p className="text-xs text-muted-foreground">Make your profile visible to everyone</p>
                    </div>
                    <Button variant="default" size="sm" className="gap-2 w-full sm:w-auto">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Sharing</h4>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-secondary/50 border border-border">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Social Media Sharing</p>
                      <p className="text-xs text-muted-foreground">Allow sharing your CV on social platforms</p>
                    </div>
                    <Button variant="default" size="sm" className="gap-2 w-full sm:w-auto">
                      Enabled
                    </Button>
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
