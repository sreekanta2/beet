"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteConfirmDialog({
  open,
  onCancel,
  onConfirm,
  loading,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md rounded-2xl text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Confirm Delete
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete this service? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="soft"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
