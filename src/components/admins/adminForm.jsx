"use client";
import { useState } from "react";
import {Button} from "../ui/button";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const ALL_PERMISSIONS = [
  "view_products",
  "edit_products",
  "manage_users",
  "manage_admins",
  "view_orders",
  "manage_orders",
  "manage_categories",
];

const ROLES = ["admin", "manager", "editor", "superadmin"];

const CreateAdminPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    profile: "", // base64 image
    permissions: [],
  });

  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleCheckbox = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  // Convert image to base64
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profile: reader.result }); // base64 string
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.password)
      return alert("All required fields missing");

    try {
      setLoading(true);

      // Create Auth login for admin
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const adminId = res.user.uid;

      // Store data in Firestore
      await setDoc(doc(db, "admins", adminId), {
        ...form,
        status: "active",
        createdAt: serverTimestamp(),
        lastLogin: null,
      });

      alert("Admin created successfully!");

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "admin",
        profile: "",
        permissions: [],
      });
      setPreviewImage(null);
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-6 px-3">
      <div className="w-full max-w-xl bg-black shadow-xl rounded-xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-400">
          Create Admin Account
        </h1>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded p-2"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded p-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Role dropdown */}
          <select
            className="w-full border rounded p-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Profile File Input */}
        <p className="text-slate-300">Select Profile Image</p>
          <div className="space-y-2 flex flex-col items-center">
            <Button asChild variant="outline" ><label htmlFor="admin-profile">Upload Profile</label></Button>
            <input
              type="file"
              id="admin-profile"
              hidden
              accept="image/*"
              className="text-white"
              onChange={handleProfileUpload}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-white"
              />
            )}
          </div>
        </div>

        {/* Permissions */}
        <div>
          <p className="font-medium text-slate-400 mb-1">Permissions</p>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PERMISSIONS.map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.permissions.includes(perm)}
                  onChange={() => handleCheckbox(perm)}
                />
                <span className="text-sm text-white">{perm}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 rounded bg-sky-700 text-white font-bold text-lg hover:bg-sky-800 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </div>
    </div>
  );
};

export default CreateAdminPage;
