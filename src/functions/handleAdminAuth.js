"use client";

import { clearAdmin, setAdmin } from "@/Global_States/adminSlice";
import axios from "axios";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

// 🔐 Admin Login
export const handleAdminAuth = async (e, dispatch, router) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { email, password } = Object.fromEntries(formData.entries());

  try {
    // ✅ STEP 1: Firebase CLIENT login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // ✅ STEP 2: Get Firebase ID Token
    const idToken = await user.getIdToken();

    // ✅ STEP 3: Send token to API
    const res = await axios.post(
      "/api/auth/login",
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const result = res.data;

    if (!result.success) {
      return result.message;
    }

    dispatch(
      setAdmin({
        admin: result.admin.role,
        isAuthenticated: true,
      })
    );

    router.push("/");
  } catch (err) {
    console.error("Login error:", err);
    return (
      err?.response?.data?.message ||
      "Invalid email or password"
    );
  }
};


//Handle Logout State
export const handleLogout = async (dispatch, router) => {
  try {
    const logout = await axios.get("/api/auth/logout");
    const status = logout.data;
    if (!status.success) {
      alert(status.message);
      return;
    }
    await signOut(auth);
    dispatch(clearAdmin());
    router.replace("/login");
    console.log(status.message);
  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
};

//handle forgetpassword

export const handleForgetPassword = async (email) => {
  try {
    const forgetPassword = await axios.post("/api/auth/forgetpassword", {
      email,
    });
    const status = forgetPassword.data;
    if (!status.success) {
      return status.message;
    }
    return status.message;
  } catch (error) {
    console.log(error.response.data.message);
    return error.response.data.message;
  }
};
