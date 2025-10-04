// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import apiFetch from "@/utils/apiFetch";

// export default async () => {
//   const router = useRouter();
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const code = params.get("code");
//     const state = params.get("state");

//     if (!code) return;

//     const sendCodeToBackend = async () => {
//       if (state === localStorage.getItem("latestCSRFToken")) {
//         localStorage.removeItem("latestCSRFToken");
//         const res = await apiFetch("/api/oauth/github", {
//           method: "POST",
//           body: JSON.stringify({ code }),
//         });

//         if (!res.ok) {
//           const errorText = await res.text();
//           throw new Error(errorText);
//         }

//         router.push("/overview");
//       } else {
//         router.push("/")
//       }
//     };

//     sendCodeToBackend();
//   }, []);
// };


"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import apiFetch from "@/utils/apiFetch";

export default function OAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      router.push("/");
      return;
    }

    const sendCodeToBackend = async () => {
      if (state === localStorage.getItem("latestCSRFToken")) {
        localStorage.removeItem("latestCSRFToken");
        try {
          const res = await apiFetch("/api/oauth/github", {
            method: "POST",
            body: JSON.stringify({ code }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
          }

          router.push("/overview");
        } catch (error) {
          alert("OAuth error: " + (error instanceof Error ? error.message : "Unknown Error"));
          router.push("/");
        }
      } else {
        router.push("/");
      }
      router.push("/");
    };

    sendCodeToBackend();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        role="status"
        aria-label="Loading"
        className="w-16 h-16 rounded-full animate-spin border-4 border-t-orange-500 border-b-blue-500 border-l-blue-300 border-r-orange-300"
      ></div>
    </div>
  );
}
