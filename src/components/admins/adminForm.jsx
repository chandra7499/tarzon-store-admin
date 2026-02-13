"use client";

import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseClient } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

/* ---------------- PERMISSIONS ---------------- */

const ALL_PERMISSIONS = [
  "view_products",
  "edit_products",
  "manage_products",
  "view_orders",
  "manage_orders",
  "manage_users",
  "manage_admins",
  "manage_categories",
];

const ROLE_PERMISSIONS = {
  admin: [
    "view_products",
    "edit_products",
    "view_orders",
    "manage_orders",
  ],
  manager: [
    "view_products",
    "edit_products",
    "manage_products",
    "view_orders",
    "manage_orders",
    "manage_categories",
  ],
  editor: [
    "view_products",
    "edit_products",
  ],
  superadmin: "ALL",
};

const ROLES = ["admin", "manager", "editor", "superadmin"];

/* ---------------- COMPONENT ---------------- */

const CreateAdminPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    profile: "",
    permissions: ROLE_PERMISSIONS.admin,
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /* ---------- HANDLE ROLE CHANGE ---------- */

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      permissions:
        ROLE_PERMISSIONS[role] === "ALL"
          ? ALL_PERMISSIONS
          : ROLE_PERMISSIONS[role],
    }));
  };

  /* ---------- HANDLE PERMISSION TOGGLE ---------- */

  const handleCheckbox = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  /* ---------- IMAGE ---------- */

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profile: reader.result }));
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {
  if (!form.fullName || !form.email || !form.password)
    return alert("All required fields missing");

  try {
    setLoading(true);

    const firebase = getFirebaseClient();
    if (!firebase) return;

    const { auth, db } = firebase;

    const res = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    const adminId = res.user.uid;
    const { password, ...safeForm } = form;

    await setDoc(doc(db, "admins", adminId), {
      ...safeForm,
      status: "active",
      createdAt: serverTimestamp(),
      lastLogin: null,
    });

    alert("Admin created successfully!");
    // reset form...
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  /* ---------- UI ---------- */

  return (
    <div className="flex justify-center items-center py-6 px-3">
      <div className="w-full max-w-xl bg-black rounded-xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-400">
          Create Admin Account
        </h1>

        {/* BASIC INFO */}
        <input
          type="text"
          placeholder="Full name"
          className="w-full p-2 rounded"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* ROLE */}
        <select
          className="w-full p-2 rounded"
          value={form.role}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role.toUpperCase()}
            </option>
          ))}
        </select>

        {/* PROFILE */}
        <p className="text-slate-300">Profile Image</p>
        <input type="file" accept="image/*" onChange={handleProfileUpload} />
        {previewImage && (
          <img
            src={previewImage}
            className="w-24 h-24 rounded-full border"
          />
        )}

        {/* PERMISSIONS */}
        <div>
          <p className="text-slate-400 mb-1">Permissions</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PERMISSIONS.map((perm) => (
              <label key={perm} className="flex gap-2 text-white">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(perm)}
                  onChange={() => handleCheckbox(perm)}
                  disabled={form.role === "superadmin"}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 bg-sky-700 rounded text-white font-bold"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>
    </div>
  );
};

export default CreateAdminPage;
