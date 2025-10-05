"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import apiFetch from "@/utils/apiFetch";

export default async () => {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) return;

    const sendCodeToBackend = async () => {
      try {
        if (state === localStorage.getItem("latestCSRFToken")) {
          localStorage.removeItem("latestCSRFToken");
          
          const res = await apiFetch("/api/auth/oauth/github", {
            method: "POST",
            body: JSON.stringify({ code }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("OAuth failed:", errorText);
            throw new Error(errorText);
          }

          const data = await res.json();
          
          // Small delay to ensure cookie is set
          setTimeout(() => {
            router.push("/overview");
          }, 100);
        } else {
          console.error("CSRF token mismatch");
          router.push("/");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.push("/?error=oauth_failed");
      }
    };

    sendCodeToBackend();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        role="status"
        aria-label="Loading"
        className="w-16 h-16 rounded-full animate-spin border-4 border-t-orange-500 border-b-blue-500 border-l-blue-300 border-r-orange-300"
      ></div>
    </div>
  );
};
