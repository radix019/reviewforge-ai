const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions extends RequestInit {
  authenticated?: boolean;
}

export async function apiClient(path: string, options: ApiOptions = {}) {
  const { headers: customHeaders, ...fetchOptions } = options;

  const headers = new Headers(customHeaders);

  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed!");
  }
  return data;
}
