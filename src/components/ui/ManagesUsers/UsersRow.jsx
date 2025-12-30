"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UserRow = ({ index, user,role}) => {
  return (
    <tr className="border-b hover:bg-gray-600 cursor-pointer">
      <td className="p-3">{index}</td>
      <td className="p-3 flex items-center gap-3">
        <Image
          src={user.avatar}
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full w-12 h-12 object-cover shrink-0"
        />
        <span>{user.name}</span>
      </td>
      <td className="p-3">{user.email}</td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status || "Active"}
        </Badge>
      </td>
      <td className="p-3">
        <div className="flex gap-3 ">
        <Button size="sm" variant="outline" className="cursor-pointer">
          View
        </Button>
       {role === "admin" || role === "user" && <Button size="sm" variant="secondary" className="cursor-pointer">Delete</Button>}
       </div>
      </td>

    </tr>
  );
};

export default UserRow;
