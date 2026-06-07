import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  if (!isAdmin) return NextResponse.next();

  const authHeader = request.headers.get("authorization");
  const expectedUser = "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "adil123";

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const decoded = atob(base64);
  const [user, pass] = decoded.split(":");

  if (user !== expectedUser || pass !== expectedPass) {
    return new NextResponse("Access denied", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
