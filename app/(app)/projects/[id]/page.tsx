"use client";

import "@xyflow/react/dist/style.css";
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges, addEdge, MiniMap } from "@xyflow/react";
import { useCallback, useState } from "react";
import type { NodeChange, EdgeChange, Connection, Node } from "@xyflow/react";
import AddNodePanel from "@/app/components/dashboard/add-panel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setEdges, setNodes } from "@/store/slices/flowSlice";
import { EditNodeModal } from "@/app/components/dashboard/edit-node-modal";


const CanvasStudio = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      dispatch(setNodes(newNodes));
    },
    [nodes, dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, edges);
      dispatch(setEdges(newEdges));
    },
    [edges, dispatch]
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setEditedLabel(String(node.data?.label || ""));
      const desc = node.data?.description || "";
      setEditedDescription(desc as string)
      console.log("Double clicked node:", node);
      setIsEditModalOpen(true);
    },
    []
  );


  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      dispatch(setEdges(newEdges));
    },
    [edges, dispatch]
  );

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedNode(null);
    setEditedLabel("");
    setEditedDescription("");
  };

  return (
    <div style={{ height: "calc(100vh - 84px)", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        panOnScroll
        selectionOnDrag
        deleteKeyCode={["Backspace", "Delete"]}
        className="text-black text-[10px]"
      >
        <Background className="text-[12px]!" />
        <Controls style={{ color: "black" }} />
        <MiniMap />
        <AddNodePanel />
      </ReactFlow>

     <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        initialLabel={editedLabel}
        initialDescription={editedDescription}
        onSave={(newLabel, newDescription) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((n) =>
        n.id === selectedNode.id
            ? {
                ...n,
                data: {
                ...n.data,
                label: newLabel,
                description: newDescription || undefined,
                },
            }
            : n
        );
        dispatch(setNodes(updatedNodes));
        setIsEditModalOpen(false);
        setSelectedNode(null);
        setEditedLabel("");
        setEditedDescription("");
    }}
    />
  </div>
  );
};

export default CanvasStudio;
