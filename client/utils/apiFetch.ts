export default async function apiFetch(input: RequestInfo, init: RequestInit) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8000";
  // Remove /api from the end if it exists for this utility
  const url = baseUrl.replace("/api", "") + input;
  return await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
}
