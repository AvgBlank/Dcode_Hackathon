"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear the GitHub token cookie by making it expire
    document.cookie = "gh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;"
    
    // Clear any other auth-related localStorage or sessionStorage
    localStorage.clear()
    sessionStorage.clear()
    
    // Redirect to login after a short delay
    setTimeout(() => {
      router.push('/auth/login')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Logging out...</h1>
        <p className="text-muted-foreground">You are being logged out. Please wait.</p>
      </div>
    </div>
  )
}