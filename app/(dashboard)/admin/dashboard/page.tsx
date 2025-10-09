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
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterId, setFilterId] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<null | "deposit" | "withdraw">(
    null
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers(); // Example API call
    setUsers(demoUsers);
  };

  const filteredUsers = users.filter((user) =>
    user.id.toLowerCase().includes(filterId.toLowerCase())
  );

  const handleSendPoints = (type: "deposit" | "withdraw") => {
    if (!selectedUser) return;
    const action = type === "deposit" ? "Deposited" : "Withdrawn";

    toast.success(
      `${action} ${points} points ${type === "deposit" ? "to" : "from"} ${
        selectedUser.name
      }`
    );

    setOpenDialog(null);
    setPoints(0);
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
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telephone</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telephone}</TableCell>
              <TableCell>{user.points}</TableCell>
              <TableCell className="flex gap-2">
                {/* Deposit Dialog */}
                <Dialog
                  open={
                    openDialog === "deposit" && selectedUser?.id === user.id
                  }
                  onOpenChange={(isOpen) =>
                    setOpenDialog(isOpen ? "deposit" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>
                        Deposit Points to {selectedUser?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <Input
                        type="number"
                        placeholder="Enter points to deposit"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleSendPoints("deposit")}>
                        Send
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Withdraw Dialog */}
                <Dialog
                  open={
                    openDialog === "withdraw" && selectedUser?.id === user.id
                  }
                  onOpenChange={(isOpen) =>
                    setOpenDialog(isOpen ? "withdraw" : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>
                        Withdraw Points from {selectedUser?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                      <Input
                        type="number"
                        placeholder="Enter points to withdraw"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleSendPoints("withdraw")}>
                        Withdraw
                      </Button>
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
