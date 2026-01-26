import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Node, Edge } from "@xyflow/react";

type FlowState = {
  nodes: Node[];
  edges: Edge[];
};

const initialState: FlowState = {
  nodes: [],
  edges: [],
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
    },
    clearFlow: (state) => {
      state.nodes = [];
      state.edges = [];
    },
  },
});

export const { setNodes, setEdges, addNode, addEdge, clearFlow } = flowSlice.actions;
export default flowSlice.reducer;
