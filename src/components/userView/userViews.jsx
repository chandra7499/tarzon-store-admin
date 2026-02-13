"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserTable from "@/components/ui/ManagesUsers/UsersTable";

import { handleUsers } from "@/functions/handleUsers";

const UserPage = () => {
  const dispatch = useDispatch();

  /* =========================
     GLOBAL STATE
  ========================= */
  const users = useSelector((state) => state.users.users);

  /* =========================
     LOCAL UI STATE
  ========================= */
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);

  /* =========================
     FETCH USERS (REDUX-FIRST)
  ========================= */
  useEffect(() => {
    async function loadUsers() {
      try {
        if (users.length > 0) return; // ✅ Redux cache

        setFetching(true);
        await handleUsers(dispatch);
      } catch (err) {
        console.error("User fetch failed:", err);
      } finally {
        setFetching(false);
      }
    }

    loadUsers();
  }, [dispatch, users.length]);

  /* =========================
     SEARCH FILTER (MEMOIZED)
  ========================= */
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q) ||
        u.status?.toLowerCase().startsWith(q)
    );
  }, [users, search]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Search by name, email, role, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <UserTable
            users={filteredUsers}
            role="user"
            fetching={fetching}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
