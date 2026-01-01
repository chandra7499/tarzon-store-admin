// api/auth/forgetPassword
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdmin} from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const {email} = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    //verification email
    let verificationOfEmail;
    try {
      verificationOfEmail = await getAdmin().auth().getUserByEmail(email);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not found",
          email
        },
        { status: 404 }
      );
    }

    const adminDetails = getAdmin().firestore().collection("admins").where("email", "==", email).limit(1);
    const verifyAdmin = await adminDetails.get();
    if(verifyAdmin.empty){
      return NextResponse.json(
        {
          success: false,
          message: "your are not authorized admin",
        },
        { status: 404 }
      );
    }

    const status = await getAdmin().auth().generatePasswordResetLink(email);
    return NextResponse.json({ success: true, message:"Check your email" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message:error.error }, { status: 500 });
  }
}
