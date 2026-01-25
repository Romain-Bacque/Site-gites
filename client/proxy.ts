import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const ADMIN_ROUTES = ["bookings"];
const PROTECTED_ROUTES = ["forgot-password", "reset-password", "email-confirm"];
const isDev = process.env.NODE_ENV === "development";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const locale = request.cookies.get("locale")?.value || "fr";

  console.log("token:", token);

  const hasLocaleInPath = /^\/[a-zA-Z]{2}(\/.|$)/.test(pathname);

  if (!hasLocaleInPath) {
    const url = request.nextUrl.clone(); // we use clone because nextUrl is read-only

    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url); // redirect to the same path with locale prefix
  }

  const isAdminRoute = ADMIN_ROUTES.some((path) =>
    pathname.startsWith(`/${locale}/${path}`),
  );
  const isProtectedRoute = PROTECTED_ROUTES.some((path) =>
    pathname.startsWith(`/${locale}/${path}`),
  );

  console.log("isAdminRoute:", isAdminRoute);

  // Redirect unauthenticated users trying to access admin routes
  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Redirect authenticated users away from protected routes
  if (token && isProtectedRoute) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (token && isAdminRoute) {
    const payload = jwt.decode(token) as {
      role?: string;
      isAdmin?: boolean;
    } | null;

    const isAdmin = payload?.role === "admin"; // TODO: replace "customer" with "admin" in production

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const csp = [
    "default-src 'self';",
    "upgrade-insecure-requests",
    `script-src 'self' 'nonce-${nonce}' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ ${isDev ? "'unsafe-eval'" : ""};`,
    `style-src 'self' 'unsafe-inline'`,
    "img-src 'self' blob: data: https://res.cloudinary.com",
    `connect-src 'self' blob: ${API_BASE_URL} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;`,
    "font-src 'self' data:", // to restrict the sources for fonts
    "object-src 'none'", // to disable <object>, <embed> and <applet> tags
    "base-uri 'self'", // to restrict the URLs which can be used in a <base> tag
    `form-action 'self' ${API_BASE_URL}`, // to allow forms to be submitted to the API server
    "frame-src 'self' https://www.google.com/recaptcha/;", // to allow iframes from specific sources
    "frame-ancestors 'none'", // to prevent clickjacking (clickjacking attack is executed by embedding a page in an iframe)
  ].join("; ");

  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)).*)",
  ],
};
