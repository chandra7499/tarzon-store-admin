"use client";

import { clearAdmin, setAdmin } from "@/Global_States/adminSlice";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
//initalize firestore app

export const handleAdminAuth = async (e, dispatch, router) => {
  e.preventDefault();
  const formdata = new FormData(e.target);
  const form = Object.fromEntries(formdata.entries());
  try {
    const res = await axios.post("/api/auth/login", form);
    const result = res.data;
    if (!result.success) {
      return result.message;
    }
    console.log(result.message);
    dispatch(setAdmin({ admin: result.admin.role, isAuthenticated: true }));

    router.push("/");
  } catch (err) {
    console.log(err.response.data.message);
    return err.response.data.message;
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
