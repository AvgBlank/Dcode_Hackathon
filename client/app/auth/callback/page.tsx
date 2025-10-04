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
      if (state === localStorage.getItem("latestCSRFToken")) {
        localStorage.removeItem("latestCSRFToken");
        const res = await apiFetch("/api/oauth/github", {
          method: "POST",
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
      }
      router.push("/overview");
    };

    sendCodeToBackend();
  }, []);
};
