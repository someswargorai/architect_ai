"use client";

import { Panel, useReactFlow } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import AddNodeSheetContent from "./add-node-sheet-content";
import AICreateNodeSheetContent from "./ai-nodes-generatos";
import { useDispatch } from "react-redux";
import { addNode } from "@/store/slices/flowSlice";


const AddNodePanel = ({canEdit}:{
  canEdit: boolean
}) => {
  const { setNodes, getViewport } = useReactFlow();
  const [nodeName, setNodeName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [nodeDesc, setNodeDesc] = useState("");
  type CreateMode = "manual" | "ai";
  const dispatch = useDispatch();

  const [mode, setMode] = useState<CreateMode>("manual");
  const addNodeFn = () => {
    if (!nodeName.trim()) return;

    const { x, y, zoom } = getViewport();

    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        position: {
          x: -x / zoom + 50,
          y: -y / zoom + 50,
        },
        data: { label: nodeName, description: nodeDesc.trim() || undefined },
      },
    ]);

    dispatch(
      addNode({
        id: crypto.randomUUID(),
        position: {
          x: -x / zoom + 50,
          y: -y / zoom + 50,
        },
        data: { label: nodeName, description: nodeDesc.trim() || undefined },
      }),
    );
    setNodeName("");
    setNodeDesc("");
    setIsSheetOpen(false);
  };

  return (
    <Panel position="top-left" className="flex flex-col gap-2">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>

        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setMode("manual");
              setIsSheetOpen(true);
            }}
            className="h-8 w-8 bg-white shadow-sm hover:bg-slate-50 cursor-pointer"
          >
            <PlusIcon className="h-4 w-4 text-slate-800" />
          </Button>
        </SheetTrigger>

        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setMode("ai");
              setIsSheetOpen(true);
            }}
            className="h-8 w-8 bg-white shadow-sm hover:bg-indigo-50 cursor-pointer"
          >
            ✨
          </Button>
        </SheetTrigger>

        {mode === "manual" ? (
          <AddNodeSheetContent
            nodeName={nodeName}
            setNodeName={setNodeName}
            nodeDesc={nodeDesc}
            setNodeDesc={setNodeDesc}
            onSave={canEdit ? addNodeFn : undefined}
            onCancel={() => setIsSheetOpen(false)}
          />
        ) : (
          <AICreateNodeSheetContent onCancel={() => setIsSheetOpen(false)} />
        )}
      </Sheet>
    </Panel>
  );
};

export default AddNodePanel;
