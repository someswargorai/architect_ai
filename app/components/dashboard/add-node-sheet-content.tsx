import React from "react";

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddNodeSheetContentProps = {
  nodeName: string;
  setNodeName: (value: string) => void;
  nodeDesc: string;
  setNodeDesc: (value: string) => void;
  onSave: (() => void) | undefined;
  onCancel: () => void;
};

const AddNodeSheetContent: React.FC<AddNodeSheetContentProps> = ({
  nodeName,
  setNodeName,
  nodeDesc,
  setNodeDesc,
  onSave,
  onCancel,
}) => {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if(onSave) onSave();
    }
  };
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create New Node</SheetTitle>
        <SheetDescription>
          Define the identity and scope of your new node. Use AI for creative
          inspiration.
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-6 py-6 px-4">
        {/* AI Assistant card */}
        <div className="space-y-4 rounded-lg border border-indigo-100 bg-indigo-50/30 p-4 transition-all focus-within:ring-2 focus-within:ring-indigo-100">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white shadow-sm">
              ✨
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-indigo-900">
                AI Assistant
              </h4>
              <p className="text-xs text-indigo-600/70">
                Let AI suggest a name and description based on your context.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-200 cursor-pointer"
          >
            Refine with AI
          </Button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              Node Title
            </label>
            <Input
              placeholder="e.g. Launch Roadmap"
              value={nodeName}
              onKeyDown={handleKeyDown}
              onChange={(e) => setNodeName(e.target.value)}
              className="text-black"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">
              Context / Description
            </label>
            <Textarea
              placeholder="What is the purpose of this node?"
              rows={4}
              onKeyDown={handleKeyDown}
              value={nodeDesc}
              onChange={(e) => setNodeDesc(e.target.value)}
              className="text-black"
            />
          </div>
        </div>
      </div>

      <SheetFooter>
        <div className="flex gap-3 justify-end w-full text-black mb-10">
          <Button
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={!nodeName.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all shadow-md active:scale-90 cursor-pointer"
          >
            Save Node
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  );
};

export default AddNodeSheetContent;
