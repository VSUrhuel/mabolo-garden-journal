import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    // protected routes - redirect to sign-in if not authenticated
    if (
      (pathname.startsWith("/protected") || pathname === "/journal") &&
      user.error
    ) {
      const signInUrl = new URL("/sign-in", request.url);
      // Optional: Add redirect path for after sign-in
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // if authenticated and on home page, redirect to protected
    if (pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    // if (request.nextUrl.pathname === "journal" && user.error) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // } else {
    //   return NextResponse.redirect(new URL("/journal", request.url));
    // }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
