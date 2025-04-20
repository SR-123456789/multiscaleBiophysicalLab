import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get("authorization")

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1]
    const [user, pwd] = atob(authValue).split(":")

    if (user === "uesugi" && pwd === "uesugi") {
      return NextResponse.next()
    }
  }

  return new NextResponse("認証が必要です", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: "/:path*",
}
