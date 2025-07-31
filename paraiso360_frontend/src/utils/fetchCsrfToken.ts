// paraiso360_frontend/src/utils/fetchCsrfToken.ts
export async function fetchCsrfToken() {
  await fetch("http://localhost:8000/api/v1/csrf/", {
    credentials: "include"
  });
}
