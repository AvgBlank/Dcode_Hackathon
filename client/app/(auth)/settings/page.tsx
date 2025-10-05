"use client"

import { Header } from "@/components/header"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Github, Loader2, Save } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import ApiClient, { UserSettings, User as UserType } from "@/lib/api"

export default function SettingsPage() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<UserType | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [showTokenField, setShowTokenField] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    company: '',
    blog: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, settingsData] = await Promise.all([
          ApiClient.getProfile(),
          ApiClient.getSettings(),
        ])
        setProfile(profileData)
        setSettings(settingsData)
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          company: profileData.company || '',
          blog: profileData.blog || '',
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await ApiClient.updateProfile(formData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      await ApiClient.updateSettings(newSettings)
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      toast({
        title: "Success",
        description: "Settings updated successfully",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGithubToken = async () => {
    if (!githubToken.trim()) return
    
    try {
      await ApiClient.updateGithubToken(githubToken)
      setGithubToken('')
      setShowTokenField(false)
      toast({
        title: "Success",
        description: "GitHub token updated successfully",
      })
    } catch (error) {
      console.error('Error updating GitHub token:', error)
      toast({
        title: "Error",
        description: "Failed to update GitHub token",
        variant: "destructive",
      })
    }
  }

  const handleDisconnectGithub = async () => {
    try {
      await ApiClient.disconnectGithub()
      toast({
        title: "Success",
        description: "GitHub disconnected successfully",
      })
    } catch (error) {
      console.error('Error disconnecting GitHub:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect GitHub",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Settings" subtitle="Manage your account and preferences" />
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex-1 p-4 md:p-8">
        <Breadcrumbs items={[{ label: "Settings" }]} />

        <div className="max-w-4xl space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Settings</CardTitle>
              </div>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={profile?.username || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog">Website/Blog</Label>
                <Input 
                  id="blog" 
                  type="url"
                  value={formData.blog}
                  onChange={(e) => setFormData(prev => ({ ...prev, blog: e.target.value }))}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* GitHub Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-primary" />
                <CardTitle>GitHub Integration</CardTitle>
              </div>
              <CardDescription>Connect and manage your GitHub account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Connected Account</p>
                  <p className="text-sm text-muted-foreground">
                    @{profile?.username || 'Not connected'} on GitHub
                  </p>
                </div>
                <Button variant="outline" onClick={handleDisconnectGithub}>
                  Disconnect
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="token">Personal Access Token</Label>
                {showTokenField ? (
                  <div className="flex gap-2">
                    <Input 
                      id="token" 
                      type="password" 
                      placeholder="ghp_••••••••••••••••" 
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                    />
                    <Button onClick={handleUpdateGithubToken} disabled={!githubToken.trim()}>
                      Update
                    </Button>
                    <Button variant="outline" onClick={() => setShowTokenField(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      value="••••••••••••••••••••" 
                      disabled 
                      className="bg-muted"
                    />
                    <Button variant="outline" onClick={() => setShowTokenField(true)}>
                      Update Token
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Required for accessing private repositories and full functionality</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Preferences</CardTitle>
              </div>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email updates about your repositories</p>
                </div>
                <Switch 
                  checked={settings?.emailNotifications ?? true}
                  onCheckedChange={(checked) => handleSaveSettings({ emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary</p>
                  <p className="text-sm text-muted-foreground">Get a weekly digest of your maintainer activity</p>
                </div>
                <Switch 
                  checked={settings?.weeklyDigest ?? false}
                  onCheckedChange={(checked) => handleSaveSettings({ weeklyDigest: checked })}
                />
              </div>

            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Data Management</CardTitle>
              </div>
              <CardDescription>Export your data and manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Analytics Data</p>
                  <p className="text-sm text-muted-foreground">Download your activity and analytics data</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    try {
                      const report = await ApiClient.exportActivityReport()
                      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `maintainer-data-export-${new Date().toISOString().split('T')[0]}.json`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                      toast({
                        title: "Export successful",
                        description: "Your data has been downloaded"
                      })
                    } catch (error) {
                      toast({
                        title: "Export failed", 
                        description: "Could not export data",
                        variant: "destructive"
                      })
                    }
                  }}
                >
                  Export Data
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Refresh Data</p>
                  <p className="text-sm text-muted-foreground">Force refresh your GitHub data</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
