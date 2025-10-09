"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/config/users";
import { demoUsers, User } from "@/lib/utils/data";
// Example
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterId, setFilterId] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [points, setPoints] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);
  console.log(users);
  const fetchUsers = async () => {
    const data = await getAllUsers(); // Fetch all users from API
    setUsers(demoUsers);
  };

  const filteredUsers = users.filter((user) => user.id.includes(filterId));

  const handleSendPoints = async () => {
    if (!selectedUser) return;
    try {
      //   await sendPointsToUser(selectedUser.id, points);
      toast.success(`Sent ${points} points to ${selectedUser.name}`);
      setIsDialogOpen(false);
      setPoints(0);
      fetchUsers(); // Refresh table
    } catch {
      toast.error("Failed to send points");
    }
  };

  return (
    <div className="p-6 container">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        <Input
          placeholder="Filter by Customer ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
        <Button onClick={() => setFilterId("")}>Reset</Button>
      </div>

      {/* Users Table */}
      <Table className="border">
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead className="text-xs">ID</TableHead>
            <TableHead className="text-xs">Name</TableHead>
            <TableHead className="text-xs">Email</TableHead>
            <TableHead className="text-xs">Telephone</TableHead>
            <TableHead className="text-xs">Points</TableHead>
            <TableHead className="text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoUsers.map((user) => (
            <TableRow key={user.id} className="text-xs">
              <TableCell className="text-xs">{user.id}</TableCell>
              <TableCell className="text-xs">{user.name}</TableCell>
              <TableCell className="text-xs">{user.email}</TableCell>
              <TableCell className="text-xs">{user.telephone}</TableCell>
              <TableCell className="text-xs">{user.points}</TableCell>
              <TableCell className="text-xs">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedUser(user)}
                    >
                      Send Points
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>
                        Send Points to {selectedUser?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <Input
                        type="number"
                        placeholder="Points"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSendPoints}>Send</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
