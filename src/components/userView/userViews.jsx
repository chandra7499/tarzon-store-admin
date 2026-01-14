"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import UserTable from "@/components/ui/ManagesUsers/UsersTable";
import { handleUsers } from "@/functions/handleUsers";

const UserPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    // Mock data — you can replace this with your API call
    const dummyUsers = async () => {
      try {
        setFetching(true);
        const data = await handleUsers();
        setUsers(data);
         
      }catch (error) {
        console.log(error);
      }finally{
        setFetching(false);

      }
      
    };
    dummyUsers();
  }, []);

  const filteredUsers = users?.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()) ||
      u.status?.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          <UserTable users={filteredUsers} role="user" fetching={fetching} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPage;
