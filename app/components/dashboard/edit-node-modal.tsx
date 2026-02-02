"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLabel: string;
  initialDescription?: string;
  onSave: (newLabel: string, newDescription?: string) => void; 
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  onClose,
  initialLabel,
  initialDescription = "",
  onSave,
}) => {
  const [label, setLabel] = React.useState(initialLabel);
  const [description, setDescription] = React.useState(initialDescription);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setLabel(initialLabel);
    setDescription(initialDescription);
  }, [initialLabel, initialDescription]);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const handleSave = () => {
    if (label.trim()) {
      onSave(label.trim(), description.trim() || undefined);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-lg bg-white border border-gray-200 shadow-2xl",
          "rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300",
          "text-gray-900",
        )}
      >
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] rounded-2xl" />

        <DialogHeader className="relative pb-5 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold tracking-tight text-gray-900">
            Edit Node
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1.5 text-sm">
            Update the node name and add/edit a description for better clarity.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 px-1 space-y-6">
          {/* Node Name */}
          <div className="space-y-3">
            <Label
              htmlFor="node-label"
              className="text-sm font-medium text-gray-700"
            >
              Node Name
            </Label>
            <Input
              id="node-label"
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Payment Gateway, Auth Service..."
              className={cn(
                "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
                "transition-all duration-200 text-base py-5 px-4 rounded-xl",
                "shadow-sm hover:shadow-md focus:shadow-md",
              )}
              autoComplete="off"
            />
          </div>

          {/* Node Description */}
          <div className="space-y-3">
            <Label
              htmlFor="node-desc"
              className="text-sm font-medium text-gray-700"
            >
              Description (optional)
            </Label>
            <Textarea
              id="node-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add details about what this node does..."
              rows={4}
              className={cn(
                "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none",
                "focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400",
                "transition-all duration-200 text-base py-4 px-4 rounded-xl",
                "shadow-sm hover:shadow-md focus:shadow-md",
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-4 border-t border-gray-100 pt-5">
          <Button
            variant="outline"
            onClick={onClose}
            className={cn(
              "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              "transition-colors duration-200 rounded-md cursor-pointer",
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!label.trim()}
            className={cn(
              "bg-indigo-600 hover:bg-indigo-700 text-white",
              "shadow-md hover:shadow-lg shadow-indigo-200/50",
              "transition-all duration-300 rounded-md",
              "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
            )}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
