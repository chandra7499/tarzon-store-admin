// api/auth/logout

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("tarzon_admin_token");
    return NextResponse.json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Logout Failed",
    });
  }
}
