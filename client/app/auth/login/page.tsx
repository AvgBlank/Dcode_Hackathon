"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function LoginPage() {
  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/callback`
    )}&scope=repo,user,read:org`
    
    window.location.href = githubAuthUrl
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Github className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Maintainer Hub</CardTitle>
          <CardDescription>
            Sign in with GitHub to access your maintainer dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGitHubLogin}
            className="w-full gap-2"
            size="lg"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}