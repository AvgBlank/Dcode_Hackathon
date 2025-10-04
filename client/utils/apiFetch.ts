export default async function apiFetch(input: RequestInfo, init: RequestInit) {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL! + input;
  return await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
}
