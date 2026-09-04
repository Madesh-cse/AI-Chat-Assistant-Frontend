import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://3.26.161.89:8000";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
) {
  const { path } = await context.params;

  const backendUrl = new URL(
    `/${path.join("/")}`,
    BACKEND_URL,
  );

  backendUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);

  // Do not forward the browser's host header.
  headers.delete("host");

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,

    // IMPORTANT:
    // Follow FastAPI redirects inside the Next.js server.
    // Do NOT send the redirect back to the browser.
    redirect: "follow",
  });

  const responseHeaders = new Headers(response.headers);

  // The backend URL must never be exposed to the browser.
  responseHeaders.delete("location");

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;