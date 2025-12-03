// API Configuration
// This allows the frontend to call the API Gateway endpoint instead of local API routes

// Get API Gateway URL from environment variable
// Set this in your build environment or as a public env var
// For local development, you can set it in .env.local as NEXT_PUBLIC_API_GATEWAY_URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

// Helper function to get the full API endpoint URL
export function getApiUrl(endpoint: string): string {
  // If API_BASE_URL is set, use it (for production with API Gateway)
  if (API_BASE_URL) {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  // Fallback to relative URL (for local development with Next.js API routes)
  return endpoint;
}

