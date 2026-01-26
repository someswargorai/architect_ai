// store/slices/projectsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  _id?: string; // will come from MongoDB
  name: string;
  createdAt: string;
  progress: string;
  priority: string;
}

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    addProjectOptimistic(state, action: PayloadAction<Project>) {
      // add project immediately for optimistic UI
      state.projects.unshift(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p._id !== action.payload);
    },
    updateProjectId(
      state,
      action: PayloadAction<{ tempId: string; realId: string }>,
    ) {
      // Replace temporary id with real MongoDB _id
      const project = state.projects.find(
        (p) => p._id === action.payload.tempId,
      );
      if (project) project._id = action.payload.realId;
    },
  },
});

export const {
  setProjects,
  addProjectOptimistic,
  removeProject,
  updateProjectId,
} = projectsSlice.actions;

export default projectsSlice.reducer;
