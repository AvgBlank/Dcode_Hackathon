import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export async function fetchGithub(accessToken: string, path: string) {
  try {
    const res = await githubApi.get(path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    throw new Error("Failed to fetch GitHub user");
  }
}
