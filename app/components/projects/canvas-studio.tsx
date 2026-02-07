"use client";

import "@xyflow/react/dist/style.css";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MiniMap,
} from "@xyflow/react";
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Node,
  Edge,
} from "@xyflow/react";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setEdges, setNodes } from "@/store/slices/flowSlice";
import AddNodePanel from "@/app/components/dashboard/add-panel";
import { EditNodeModal } from "@/app/components/dashboard/edit-node-modal";
import { useParams } from "next/navigation";
import http from "@/lib/apiClient";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  useBroadcastEvent,
  useEventListener,
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "@liveblocks/react";
import ShowOnlines from "./show-onlines";
import LiveCursors from "./live-cursor";
import Chat from "./chat";

import BlockNoteEditor from "./note";
import ExcalidrawBoard from "./excalidraw";
import { PremiumSwitcher } from "./premium-switcher";

const CanvasStudio = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state: RootState) => state.flow.nodes);
  const edges = useSelector((state: RootState) => state.flow.edges);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [tab, setTab]= useState(1);

  const editingTimeout = useRef<NodeJS.Timeout | null>(null);

  const { id: projectId } = useParams();
  const { status } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const broadcast = useBroadcastEvent();

  const self = useSelf();
  const canEdit = self?.canWrite ?? false;
  const isRemoteUpdate = useRef(false);

  const updateMyPresence = useUpdateMyPresence();
 
  const others = useOthers();

  const someoneElseEditing = others.some(
    (o) => o.presence?.isEditing
  );

  useEffect(() => {
  if (someoneElseEditing && !canEdit) {
    toast.info("Someone is editing the canvas right now");
  }
}, [someoneElseEditing, canEdit]);

const markEditing = useCallback(() => {
  updateMyPresence({ isEditing: true });

  if (editingTimeout.current) {
    clearTimeout(editingTimeout.current);
  }

  editingTimeout.current = setTimeout(() => {
    updateMyPresence({ isEditing: false });
  }, 1500);
}, [updateMyPresence]);


  const onMouseMove = useCallback(
  (event: React.MouseEvent) => {
    updateMyPresence({
      cursor: {
        x: event.clientX,
        y: event.clientY,
      },
   
    });
  },
  [updateMyPresence]
);

const onMouseLeave = useCallback(() => {
  updateMyPresence({ cursor: null});
}, [updateMyPresence]);


  useEffect(() => {   
    updateMyPresence({
      name: self?.info?.name ?? "User",
      email: self?.info?.email as string,
    });
  }, [updateMyPresence,self?.info?.email, self?.info?.name]);

  useEffect(() => {
    if (status !== "authenticated" || !projectId) return;

    const loadDiagram = async () => {
      setIsLoading(true);
      try {
        const res = await http.get(`/api/graphs/${projectId}`);

        if (!res.data?.success) return;

        if (res.data.message === "Project not found") {
          dispatch(setNodes([]));
          dispatch(setEdges([]));
          return;
        }

        dispatch(setNodes(res.data.nodes));
        dispatch(setEdges(res.data.edges));
      } catch (error) {
        console.error("Failed to load diagram:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDiagram();
  }, [dispatch, projectId, status]);

    
  useEventListener(({ event }) => {

    if (event && typeof event === "object" && "type" in event) {
        if (event.type === "FLOW_UPDATE") {
        const payload = event.payload as { nodes: Node[]; edges: Edge[] } | undefined;

        if (payload) {
            isRemoteUpdate.current = true;
            dispatch(setNodes(payload.nodes));
            dispatch(setEdges(payload.edges));
        }
        }
    }
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!canEdit) return;

      const newNodes = applyNodeChanges(changes, nodes);
      dispatch(setNodes(newNodes));

      if (!isRemoteUpdate.current) {
        broadcast({
          type: "FLOW_UPDATE",
          payload: { nodes: JSON.parse(JSON.stringify(newNodes)), edges: JSON.parse(JSON.stringify(edges)), },
        });
      }

      markEditing();
      isRemoteUpdate.current = false;
    },
    [nodes, edges, dispatch, broadcast, canEdit, markEditing]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!canEdit) return;

      const newEdges = applyEdgeChanges(changes, edges);
      dispatch(setEdges(newEdges));

      if (!isRemoteUpdate.current) {
        broadcast({
          type: "FLOW_UPDATE",
          payload: { nodes:JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(newEdges)) },
        });
      }

      markEditing()
      isRemoteUpdate.current = false;
    },
    [nodes, edges, dispatch, broadcast, markEditing, canEdit]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!canEdit) return;

      const newEdges = addEdge(params, edges);
      dispatch(setEdges(newEdges));

      broadcast({
        type: "FLOW_UPDATE",
        payload: { nodes:JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(newEdges)), },
      });
     
      markEditing()
    },
    [nodes, edges, dispatch, broadcast, canEdit,markEditing]
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!canEdit) return;

      setSelectedNode(node);
      setEditedLabel(String(node.data?.label || ""));
      setEditedDescription((node.data?.description || "") as string);
      setIsEditModalOpen(true);
    },
    [canEdit]
  );

  useEffect(() => {
    if (!canEdit || isLoading || !projectId) return;

    const saveDiagram = async () => {
      try {
        const response = await http.post(`/api/graphs/${projectId}`, {
          nodes,
          edges,
        });

        if (!response?.data?.success) {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error("Failed to save diagram:", error);
      }
    };

    const timeout = setTimeout(saveDiagram, 2000);
    return () => clearTimeout(timeout);
  }, [nodes, edges, projectId, isLoading, canEdit]);

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setSelectedNode(null);
    setEditedLabel("");
    setEditedDescription("");
  };

  return (
    <div style={{ height: "calc(100vh - 84px)", width: "100%" }}>

    <PremiumSwitcher activeTab={tab} setTab={setTab}/>

      
      {tab===1 ? <ReactFlow
        nodes={nodes}
        edges={edges}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onNodeDoubleClick={canEdit ? onNodeDoubleClick : undefined}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable={canEdit}
        nodesConnectable={canEdit}
        elementsSelectable={canEdit}
        deleteKeyCode={canEdit ? ["Backspace", "Delete"] : []}
        fitView
        panOnScroll
        selectionOnDrag
        className="text-black text-[10px]"
      >
        <Background />
        <Controls />
        <MiniMap />
        <AddNodePanel canEdit={canEdit} />
        <ShowOnlines/>
        <LiveCursors/>
        <Chat/>
      </ReactFlow>
      : tab === 2 ? 
        <BlockNoteEditor canEdit={canEdit}/>
      : <ExcalidrawBoard canEdit={canEdit}/>
      }

      <EditNodeModal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        initialLabel={editedLabel}
        initialDescription={editedDescription}
        onSave={(newLabel, newDescription) => {
          if (!selectedNode || !canEdit) return;

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

          broadcast({
            type: "FLOW_UPDATE",
            payload: { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) },
          });

          handleCancelEdit();
        }}
      />
    </div>
  );
};

export default CanvasStudio;
