
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Project {
  _id: string; 
  name: string;
  description:string;
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
      state.projects.unshift(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p._id !== action.payload);
    },
    updateProjectId(
      state,
      action: PayloadAction<{ tempId: string; realId: string }>,
    ) {
      const project = state.projects.find(
        (p) => p._id === action.payload.tempId,
      );
      if (project) project._id = action.payload.realId;
    },
    editProject(state, action){
      const id= action.payload._id;
      const project= state.projects.find((item)=>item._id===id);
      
      if(project){
        Object.assign(project, action.payload)
      }

    },
   
  },
});

export const {
         setProjects,
         addProjectOptimistic,
         removeProject,
         updateProjectId,
         editProject,
       
       } = projectsSlice.actions;

export default projectsSlice.reducer;
