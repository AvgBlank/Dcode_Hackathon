export default async () => {
  const GH_CLIENT_ID = process.env.NEXT_PUBLIC_GH_CLIENT_ID;
  const GH_REDIRECT_URI = process.env.NEXT_PUBLIC_GH_REDIRECT_URI;

  // create a CSRF token using Web Crypto API
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const state = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  localStorage.setItem("latestCSRFToken", state);

  // redirect the user to github
  const link = `https://github.com/login/oauth/authorize?client_id=${GH_CLIENT_ID}&response_type=code&scope=repo&redirect_uri=${GH_REDIRECT_URI}/integrations/github/oauth2/callback&state=${state}`;
  window.location.assign(link);
};
