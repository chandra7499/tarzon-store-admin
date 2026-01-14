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
    // 1️⃣ Firebase login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const idToken = await userCredential.user.getIdToken();

    // 2️⃣ Backend login
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

    // 3️⃣ Success
    dispatch(
      setAdmin({
        admin: result.admin,
        isAuthenticated: true,
      })
    );

    router.push("/");
    return null;

  } catch (err) {
    // ✅ THIS IS WHERE 403 LANDS
    if (err.response?.status === 403) {
      return err.response.data.message; // "Not an admin"
    }

    if (err.response?.status === 401) {
      return "Invalid credentials";
    }

    return "Login failed. Please try again.";
  }
};



//Handle Logout State
export const handleLogout = async (dispatch, router) => {
  try {
    const logout = await axios.get(`/api/auth/logout`);
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
    const forgetPassword = await axios.post(`/api/auth/forgetpassword`, {
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
