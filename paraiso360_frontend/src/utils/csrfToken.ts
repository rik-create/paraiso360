// paraiso360_frontend/src/utils/csrfToken.ts

// This utility fetches the CSRF token from the backend
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookieValue = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="));
  return cookieValue ? decodeURIComponent(cookieValue.split("=")[1]) : null;
}
