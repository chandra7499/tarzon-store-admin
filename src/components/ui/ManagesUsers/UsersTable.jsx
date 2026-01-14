"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import UserRow from "./UsersRow";

const UserTable = ({ users,role,fetching}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-15  text-white">s.No</TableHead>
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {<TableBody>
          {users?.length > 0 ? (
            users?.map((user, index) => (
              <UserRow key={user.id} index={index + 1} user={user} role={role}/>
            ))
            
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                {!fetching ? "No users found" : "Fetching..."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>}
      </Table>
    </div>
  );
};

export default UserTable;
