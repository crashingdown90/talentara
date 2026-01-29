import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Validate required environment variables at module load time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set"
  );
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/callback",
  "/api/payments/webhook",
];

// Routes only for talent role
const TALENT_ROUTES = ["/dashboard", "/profile", "/wallet", "/verification"];

// Routes only for client role
const CLIENT_ROUTES = ["/company"];

// Routes only for admin role
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return updateSession(request);
  }

  // Allow Next.js internals (static files already excluded by matcher config)
  if (pathname.startsWith("/_next")) {
    return updateSession(request);
  }

  // Only allow specific public auth API routes (not all /api/auth/*)
  // The /api/auth/me and /api/auth/logout routes still require authentication
  if (
    pathname === "/api/auth/register" ||
    pathname === "/api/auth/login" ||
    pathname === "/api/auth/callback"
  ) {
    return updateSession(request);
  }

  // Create Supabase client for auth check
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not authenticated — redirect to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch profile role for route protection
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = profile.role;

  // Admin route protection
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route)) && userRole !== "admin") {
    const redirectPath = userRole === "client" ? "/company/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Talent trying to access client routes
  if (CLIENT_ROUTES.some((route) => pathname.startsWith(route)) && userRole === "talent") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Client trying to access talent-only routes
  if (TALENT_ROUTES.some((route) => pathname.startsWith(route)) && userRole === "client") {
    return NextResponse.redirect(new URL("/company/dashboard", request.url));
  }

  return response;
}

/**
 * Refresh the session cookie to keep user logged in
 */
async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // This refreshes the session if needed
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
