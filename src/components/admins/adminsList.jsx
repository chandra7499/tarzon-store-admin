"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserTable from "@/components/ui/ManagesUsers/UsersTable";
import { handleAdmins } from "@/functions/handleAdmins";
import { Button } from "../ui/button";
import Link from "next/link"

const Adminspage = () => {
  const [search, setSearch] = useState("");
  const [users, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // Mock data — you can replace this with your API call
    const dummyUsers = async () => {
      try {
        setFetching(true);
        const data = await handleAdmins();
        setAdmins(data);
      } catch (error) {
        console.log(error);
      } finally {
        setFetching(false);
      }
    };
    dummyUsers();
  }, []);

 

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()) ||
      u.status?.toLowerCase().startsWith(search.toLowerCase())
  );
  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
         <h1 className="text-2xl font-bold">Manage Admins</h1>
         <Button variant="outline">
          <Link href="/admins/create-admin" >Create Admin</Link>
        </Button>
        </div>


        <Card className="shadow-md">
          <CardContent className="p-4 space-y-4">
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3"
            />

            <UserTable users={filteredUsers} fetching={fetching}/>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Adminspage;
