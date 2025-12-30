// api/auth/login/route.js

import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { admin } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    //Step-1 firebase signIn
    const AdminCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = AdminCredentials.user;

    //step-2 get firebase ID
    const idToken = await user.getIdToken();

    //Verify admin in firestore
    const adminDocRef = await admin.firestore().collection("admins").where("email", "==", email).get();
  

    if (adminDocRef.empty) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 400 }
      );
    }

    //get admin data

    const adminDocSnap = adminDocRef.docs[0];

    const adminData = adminDocSnap.data();

    if (adminData.status !== "active") {
      return NextResponse.json(
        { success: false, message: "Admin is inactive" },
        { status: 400 }
      );
    }

    //verify the token by firebase admintoken for secure
   await admin.auth().verifyIdToken(idToken);

    //cookie for authentication presistence

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin logged in successfully",
        admin: {
          fullName: adminData.fullName,
          email: adminData.email,
          role: adminData.role,
          premissions: adminData.permissions,
        },
      },
      { status: 200 }
    );

    //set cookie

    response.cookies.set("tarzon_admin_token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
