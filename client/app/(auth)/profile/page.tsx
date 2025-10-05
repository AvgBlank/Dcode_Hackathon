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
  Loader2,
  GitFork,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import ApiClient, { User, MetricsData } from "@/lib/api"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareLoading, setShareLoading] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, metricsData] = await Promise.all([
          ApiClient.getProfile(),
          ApiClient.getOverviewMetrics(),
        ])
        setProfile(profileData)
        setMetrics(metricsData)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const generateCVHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintainer CV - ${profile?.name || profile?.username}</title>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #007acc; padding-bottom: 20px; }
            .header h1 { margin: 0; font-size: 2.5em; color: #007acc; }
            .header p { margin: 5px 0; color: #666; }
            .section { margin-bottom: 40px; }
            .section h2 { color: #007acc; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
            .metric-card { background: #f8f9fa; padding: 25px; border-radius: 10px; text-align: center; border-left: 5px solid #007acc; }
            .metric-card h3 { margin: 0 0 10px 0; font-size: 1.1em; color: #333; }
            .metric-card .value { font-size: 2.5em; font-weight: bold; color: #007acc; margin: 10px 0; }
            .metric-card .desc { color: #666; font-size: 0.9em; }
            .bio { background: #f0f8ff; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #007acc; }
            .skills { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
            .skill-tag { background: #007acc; color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; }
            .achievements { list-style: none; padding: 0; }
            .achievements li { background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; }
            .footer { margin-top: 60px; text-align: center; color: #666; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px; }
            @media print {
              body { margin: 20px; }
              .header { page-break-inside: avoid; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${profile?.name || profile?.username || 'Maintainer'}</h1>
            <p><strong>@${profile?.username || 'username'}</strong></p>
            ${profile?.location ? `<p>📍 ${profile.location}</p>` : ''}
            <p>Open Source Maintainer & Contributor</p>
            ${profile?.blog ? `<p>🌐 <a href="${profile.blog}">${profile.blog}</a></p>` : ''}
          </div>

          ${profile?.bio ? `
          <div class="section">
            <h2>About</h2>
            <div class="bio">
              <p>${profile.bio}</p>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h2>Key Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <h3>Public Repositories</h3>
                <div class="value">${profile?.publicRepos || 0}</div>
                <div class="desc">Active projects maintained</div>
              </div>
              <div class="metric-card">
                <h3>Total Pull Requests</h3>
                <div class="value">${metrics?.totalPullRequests || 0}</div>
                <div class="desc">Code reviews & contributions</div>
              </div>
              <div class="metric-card">
                <h3>Issues Handled</h3>
                <div class="value">${metrics?.totalIssues || 0}</div>
                <div class="desc">Community support provided</div>
              </div>
              <div class="metric-card">
                <h3>Followers</h3>
                <div class="value">${profile?.followers || 0}</div>
                <div class="desc">Developer community reach</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Maintainer Achievements</h2>
            <ul class="achievements">
              <li>🔧 Successfully maintained ${profile?.publicRepos || 0} public repositories</li>
              <li>👥 Guided and mentored ${Math.floor((profile?.followers || 0) / 10)} community members</li>
              <li>🔍 Reviewed and processed ${metrics?.totalPullRequests || 0} pull requests</li>
              <li>🐛 Resolved ${metrics?.totalIssues || 0} community issues and bugs</li>
              <li>⭐ Earned ${metrics?.totalStars || 0} stars across all repositories</li>
              <li>🌟 ${profile?.publicRepos && profile.publicRepos > 10 ? 'Core Maintainer' : 'Active Contributor'} status in open source community</li>
            </ul>
          </div>

          <div class="section">
            <h2>Community Impact</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <h3>Repository Stars</h3>
                <div class="value">${metrics?.totalStars || 0}</div>
                <div class="desc">Community appreciation</div>
              </div>
              <div class="metric-card">
                <h3>Active Repositories</h3>
                <div class="value">${metrics?.activeRepositories || 0}</div>
                <div class="desc">Currently maintained</div>
              </div>
              <div class="metric-card">
                <h3>Contributor Count</h3>
                <div class="value">${metrics?.contributorCount || 0}</div>
                <div class="desc">Developers collaborated with</div>
              </div>
              <div class="metric-card">
                <h3>Join Date</h3>
                <div class="value">${profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '---'}</div>
                <div class="desc">Years of experience</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This CV was generated automatically from GitHub activity data.</p>
            <p>Generated on ${new Date().toLocaleDateString()} • For latest updates visit the maintainer dashboard</p>
          </div>
        </body>
      </html>
    `
  }

  const handleShare = async () => {
    setShareLoading(true)
    try {
      const { shareUrl } = await ApiClient.shareProfile()
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Success",
        description: "Profile link copied to clipboard!",
      })
    } catch (error) {
      console.error('Error sharing profile:', error)
      toast({
        title: "Error",
        description: "Failed to share profile",
        variant: "destructive",
      })
    } finally {
      setShareLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      // Generate HTML CV content
      const htmlContent = generateCVHTML()
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `maintainer-cv-${profile?.username || 'export'}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Success",
        description: "CV downloaded as HTML! You can print it as PDF from your browser.",
      })
    } catch (error) {
      console.error('Error exporting CV:', error)
      toast({
        title: "Error",
        description: "Failed to export CV",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header
          title="My Profile"
          subtitle="Your public maintainer profile and contribution CV"
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header
        title="My Profile"
        subtitle="Your public maintainer profile and contribution CV"
        actions={
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent hidden sm:flex"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export CV</span>
            </Button>
            <Button 
              className="gap-2"
              onClick={handleShare}
              disabled={shareLoading}
            >
              {shareLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
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
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || profile.username}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-background shadow-lg"
                    />
                  ) : (
                    <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 flex items-center justify-center text-3xl md:text-4xl font-bold text-white shadow-lg">
                      {profile?.name?.[0]?.toUpperCase() || profile?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 md:h-8 md:w-8 rounded-full bg-purple-500 border-4 border-card flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-white fill-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {profile?.name || profile?.username || 'GitHub User'}
                  </h2>
                  <p className="text-muted-foreground font-medium">@{profile?.username}</p>
                  <Badge variant="secondary" className="gap-1.5">
                    <Award className="h-3 w-3" />
                    Core Maintainer
                  </Badge>
                </div>

                {profile?.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">
                    {profile.bio}
                  </p>
                )}

                <div className="w-full space-y-2 pt-2">
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date(profile.createdAt).getFullYear()}</span>
                    </div>
                  )}
                </div>

                <div className="w-full pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 bg-background/50 hover:bg-background"
                    onClick={() => window.open(`https://github.com/${profile?.username}`, '_blank')}
                  >
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
                    {profile?.email && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-full"
                        onClick={() => window.open(`mailto:${profile.email}`, '_blank')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                    {profile?.blog && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-10 w-full"
                        onClick={() => window.open(profile.blog, '_blank')}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    )}
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
                        Pull Requests
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {metrics?.totalPullRequests || 0}
                      </span>
                    </div>
                    <Progress value={Math.min((metrics?.totalPullRequests || 0) / 10 * 100, 100)} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-orange-500/10">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        </div>
                        Issues
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {metrics?.totalIssues || 0}
                      </span>
                    </div>
                    <Progress value={Math.min((metrics?.totalIssues || 0) / 10 * 100, 100)} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-green-500/10">
                          <Users className="h-4 w-4 text-green-500" />
                        </div>
                        Followers
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {profile?.followers || 0}
                      </span>
                    </div>
                    <Progress value={Math.min((profile?.followers || 0) / 100 * 100, 100)} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">GitHub followers</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-purple-500/10">
                          <FileText className="h-4 w-4 text-purple-500" />
                        </div>
                        Repositories
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {profile?.publicRepos || 0}
                      </span>
                    </div>
                    <Progress value={Math.min((profile?.publicRepos || 0) / 20 * 100, 100)} className="h-2.5" />
                    <p className="text-xs text-muted-foreground">{Math.min((profile?.publicRepos || 0) / 20 * 100, 100).toFixed(0)}% of goal</p>
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
                  <div className="text-3xl font-bold text-foreground">
                    {(metrics?.totalPullRequests || 0) + (metrics?.totalIssues || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {metrics?.recentActivity?.length ? `+${metrics.recentActivity.length}` : '0'}
                    </span> this month
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
                  <div className="text-3xl font-bold text-foreground">{metrics?.activeRepositories || 0}</div>
                  <p className="text-xs text-muted-foreground mt-2">Actively maintained</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foregor">Total Stars</CardTitle>
                    <Star className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {metrics?.totalStars || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Across all repositories</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* --- Left Column: Profile Card --- */}
          <Card className="relative lg:col-span-1 overflow-hidden border-white/20 bg-black/40 backdrop-blur-xl">
  {/* Background Glows */}
  <div className="absolute -top-1/4 -left-1/4 h-1/2 w-1/2 rounded-full bg-orange-500/30 blur-[100px]" />
  <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-blue-500/30 blur-[100px]" />

  <CardContent className="relative z-10 pt-8">
    {/* Main row with all content flexed horizontally */}
    <div className="flex flex-row items-center justify-between space-x-6 text-white">
      
      {/* Avatar + Star */}
      <div className="relative flex-shrink-0">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name || profile.username}
            className="h-28 w-28 rounded-full border-4 border-white/20 shadow-lg shadow-orange-500/20"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-4xl font-bold text-white shadow-lg shadow-orange-500/20">
            {profile?.name ? profile.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'UN'}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-black/50 bg-amber-400">
          <Star className="h-4 w-4 text-black fill-black" />
        </div>
      </div>

      {/* Textual info vertically stacked */}
      <div className="flex flex-col justify-center space-y-2 flex-grow">
        <h2 className="text-2xl font-bold">{profile?.name || profile?.username || 'User'}</h2>
        <p className="font-medium text-gray-400">@{profile?.username || 'user'}</p>
        <Badge className="gap-1.5 border border-white/20 bg-white/10 text-gray-300 w-max">
          <Award className="h-3.5 w-3.5" />
          {profile?.publicRepos && profile.publicRepos > 10 ? 'Core Maintainer' : 'Maintainer'}
        </Badge>
        <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
          {profile?.bio || 'Open source maintainer passionate about building developer tools and fostering inclusive communities.'}
        </p>
        <div className="flex gap-6 text-sm text-gray-400 mt-2">
          {profile?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 'GitHub'}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Social links row below with minimal height */}
    <div className="w-full pt-4">
      <div className="grid grid-cols-4 gap-2">
        <Button className="h-10 w-full border border-white/10 bg-black/30 hover:bg-white/10">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button className="h-10 w-full border border-white/10 bg-black/30 hover:bg-white/10">
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button className="h-10 w-full border border-white/10 bg-black/30 hover:bg-white/10">
          <Mail className="h-4 w-4" />
        </Button>
        <Button className="h-10 w-full border border-white/10 bg-black/30 hover:bg-white/10">
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </CardContent>
</Card>


          {/* --- Right Column: Summary and Stats --- */}
          <div className="flex space-x-8">
  {/* Left section - 75% width */}
  <div className="w-3/4">
    <Card className="border-white/20 bg-black/40">
      <CardHeader>
        <CardTitle className="text-white">Contribution Summary</CardTitle>
        <CardDescription>
          Your maintainer impact at a glance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* PR Reviews */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl font-medium text-white">
                <div className="rounded-md bg-blue-500/10 p-1.5">
                  <GitPullRequest className="h-4 w-4 text-blue-400" />
                </div>
                PR Reviews
              </span>
              <span className="text-lg font-bold text-white">{metrics?.totalPullRequests || 0}</span>
            </div>
            <Progress value={Math.min((metrics?.totalPullRequests || 0) / 20 * 100, 100)} />
            <p className="text-md text-gray-400">{Math.min((metrics?.totalPullRequests || 0) / 20 * 100, 100).toFixed(0)}% of monthly goal</p>
          </div>
          {/* Issues Triaged */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl font-medium text-white">
                <div className="rounded-md bg-orange-500/10 p-1.5">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                </div>
                Issues Triaged
              </span>
              <span className="text-md font-bold text-white">{metrics?.totalIssues || 0}</span>
            </div>
            <Progress value={Math.min((metrics?.totalIssues || 0) / 15 * 100, 100)} />
            <p className="text-xs text-gray-400">{Math.min((metrics?.totalIssues || 0) / 15 * 100, 100).toFixed(0)}% of monthly goal</p>
          </div>
          {/* Discussions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl font-medium text-white">
                <div className="rounded-md bg-green-500/10 p-1.5">
                  <MessageSquare className="h-4 w-4 text-green-400" />
                </div>
                Discussions
              </span>
              <span className="text-lg font-bold text-white">{metrics?.reviewSentiment?.commented || 0}</span>
            </div>
            <Progress value={Math.min((metrics?.reviewSentiment?.commented || 0) / 5 * 100, 100)} />
            <p className="text-md text-gray-400">{Math.min((metrics?.reviewSentiment?.commented || 0) / 5 * 100, 100).toFixed(0)}% of monthly goal</p>
          </div>
          {/* Docs Updated */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xl font-medium text-white">
                <div className="rounded-md bg-purple-500/10 p-1.5">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                Docs Updated
              </span>
              <span className="text-lg font-bold text-white">{profile?.publicGists || 0}</span>
            </div>
            <Progress value={Math.min((profile?.publicGists || 0) / 10 * 100, 100)} />
            <p className="text-md text-gray-400">{Math.min((profile?.publicGists || 0) / 10 * 100, 100).toFixed(0)}% of monthly goal</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  {/* Right section - 25% width */}
  <div className="w-1/4">
    <div className=" gap-6">
      <Card className="bg-gradient-to-br from-blue-500/15 to-blue-500/5 border-blue-500/20 mb-2 ">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Contributions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {(metrics?.totalPullRequests || 0) + (metrics?.totalIssues || 0)}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <span className="font-medium text-green-400">
              {metrics?.recentActivity?.length ? `+${metrics.recentActivity.length}` : '0'}
            </span> this month
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/15 to-green-500/5 border-green-500/20 mb-2">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">
              Repositories
            </CardTitle>
            <Github className="h-4 w-4 text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{metrics?.activeRepositories || 0}</div>
          <p className="mt-2 text-xs text-gray-400">Actively maintained</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/15 to-purple-500/5 border-purple-500/20">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Forks
            </CardTitle>
            <GitFork className="h-4 w-4 text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">
            {metrics?.totalForks || 0}
          </div>
          <p className="mt-2 text-xs text-gray-400">Community contributions</p>
        </CardContent>
      </Card>
    </div>
  </div>
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
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{metrics?.totalPullRequests || 0}</div>
                      <p className="text-sm text-muted-foreground">Total reviews</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{metrics?.reviewSentiment?.approved || 0}</div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{metrics?.reviewSentiment?.changesRequested || 0}</div>
                      <p className="text-sm text-muted-foreground">Changes requested</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Reviewed {metrics?.totalPullRequests || 0} pull requests across {metrics?.activeRepositories || 0} repositories, providing constructive feedback and maintaining
                    code quality standards. {metrics?.reviewSentiment?.approved && metrics?.totalPullRequests ? 
                      Math.round((metrics.reviewSentiment.approved / metrics.totalPullRequests) * 100) : 0}% approval rate demonstrates trust in contributors while maintaining high
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
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{metrics?.totalIssues || 0}</div>
                      <p className="text-sm text-muted-foreground">Issues triaged</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{Math.floor((metrics?.totalIssues || 0) * 0.8)}</div>
                      <p className="text-sm text-muted-foreground">Closed</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{(metrics?.totalIssues || 0) + (metrics?.totalPullRequests || 0)}</div>
                      <p className="text-sm text-muted-foreground">Labels added</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Triaged and managed {metrics?.totalIssues || 0} issues, ensuring proper categorization and prioritization. Closed {Math.floor((metrics?.totalIssues || 0) * 0.8)} issues
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
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{metrics?.reviewSentiment?.commented || 0}</div>
                      <p className="text-sm text-muted-foreground">Discussions</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{metrics?.contributorCount || 0}</div>
                      <p className="text-sm text-muted-foreground">Contributors mentored</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{Math.floor((metrics?.contributorCount || 0) * 0.3)}</div>
                      <p className="text-sm text-muted-foreground">First-timers helped</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Active community member with {metrics?.reviewSentiment?.commented || 0} discussion participations. Mentored {metrics?.contributorCount || 0} contributors and helped {Math.floor((metrics?.contributorCount || 0) * 0.3)}
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
                      <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{profile?.publicGists || 0}</div>
                      <p className="text-sm text-muted-foreground">Docs updated</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{Math.floor((profile?.publicRepos || 0) * 0.1)}</div>
                      <p className="text-sm text-muted-foreground">CI/CD fixes</p>
                    </div>
                    <div className="p-4 md:p-5 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                      <div className="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">{Math.floor((profile?.publicRepos || 0) * 0.05)}</div>
                      <p className="text-sm text-muted-foreground">Security patches</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                    Maintained and improved documentation with {profile?.publicGists || 0} updates. Fixed {Math.floor((profile?.publicRepos || 0) * 0.1)} CI/CD issues and reviewed {Math.floor((profile?.publicRepos || 0) * 0.05)} security
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
