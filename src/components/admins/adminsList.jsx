"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserTable from "@/components/ui/ManagesUsers/UsersTable";

import { handleAdmins } from "@/functions/handleAdmins";

const AdminsPage = () => {
  const dispatch = useDispatch();

  /* =========================
     GLOBAL STATE
  ========================= */
  const admins = useSelector((state) => state.admins.admins);

  /* =========================
     LOCAL UI STATE
  ========================= */
  const [search, setSearch] = useState("");
  const [fetching, setFetching] = useState(false);

  /* =========================
     FETCH ADMINS (REDUX-FIRST)
  ========================= */
  useEffect(() => {
    async function loadAdmins() {
      try {
        if (admins.length > 0) return; // ✅ Redux cache

        setFetching(true);
        await handleAdmins(dispatch);
      } catch (err) {
        console.error("Admin fetch failed:", err);
      } finally {
        setFetching(false);
      }
    }

    loadAdmins();
  }, [dispatch, admins.length]);

  /* =========================
     SEARCH FILTER (MEMOIZED)
  ========================= */
  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase();

    return admins.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.role?.toLowerCase().includes(q) ||
        a.status?.toLowerCase().startsWith(q)
    );
  }, [admins, search]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Admins</h1>

        <Button variant="outline" asChild>
          <Link href="/admins/create-admin">Create Admin</Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Search by name, email, role, or status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <UserTable users={filteredAdmins} fetching={fetching} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminsPage;
