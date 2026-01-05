// api/auth/logout

import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the cookie
  response.cookies.delete("admin_token");

  return response;
}
