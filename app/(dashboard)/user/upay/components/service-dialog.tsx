"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const serviceOptions = [
  { label: "bKash", value: "bkash" },
  { label: "Nagad", value: "nagad" },
  { label: "Rocket", value: "rocket" },
  { label: "Upay", value: "upay" },
  { label: "SureCash", value: "surecash" },
];

export default function ServiceDialog({
  open,
  close,
  form,
  setForm,
  errors,
  handleSubmit,
  loading,
  editingService,
}: {
  open: boolean;
  close: () => void;
  form: { name: string; number: string };
  setForm: (f: any) => void;
  errors: { name?: string; number?: string };
  handleSubmit: () => void;
  loading: boolean;
  editingService: any;
}) {
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {editingService ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* --- Service Name Select --- */}
          <div>
            <Label className="text-sm font-medium">Service Name</Label>
            <Select
              value={form.name}
              onValueChange={(value) => setForm({ ...form, name: value })}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* --- Account Number Input --- */}
          <div>
            <Label className="text-sm font-medium">Account Number</Label>
            <Input
              placeholder="e.g. 017XXXXXXXX"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              className="mt-1"
            />
            {errors.number && (
              <p className="text-sm text-red-500 mt-1">{errors.number}</p>
            )}
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {editingService ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
