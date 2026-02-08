"use client";

import {
  Excalidraw,
  getSceneVersion,
  CaptureUpdateAction,
  loadLibraryFromBlob,
  mergeLibraryItems,
} from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { AppState } from "@excalidraw/excalidraw/types";
import type { BinaryFiles } from "@excalidraw/excalidraw/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { LibraryItems } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useBroadcastEvent,
  useEventListener,
  useSelf,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import http from "@/lib/apiClient";
import type { Json } from "@liveblocks/client";
import type { Collaborator } from "@excalidraw/excalidraw/types";
import type { SocketId } from "@excalidraw/excalidraw/types";
import { toast } from "sonner";
import LiveCursors from "./live-cursor";

const MAX_ELEMENTS = 300;

interface DrawScene {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
 
  version?: number;
}

function normalizeCollaborators(
  value: unknown
): Map<SocketId, Collaborator> {
  const map = new Map<SocketId, Collaborator>();

  if (value instanceof Map) {
    return value as Map<SocketId, Collaborator>;
  }

  if (value && typeof value === "object" && value !== null) {
    for (const [key, collaborator] of Object.entries(value)) {
      if (collaborator && typeof collaborator === "object" && collaborator !== null) {
        map.set(key as SocketId, collaborator as Collaborator);
      }
    }
  }

  return map;
}

const LIBRARIES_BASE =
  "https://raw.githubusercontent.com/excalidraw/excalidraw-libraries/main/libraries";

const DEFAULT_LIBRARY_PATHS = [
  "youritjang/software-architecture.excalidrawlib", 
  "aretecode/system-design-template.excalidrawlib",
  "slobodan/aws-serverless.excalidrawlib",
  "husainkhambaty/aws-simple-icons.excalidrawlib", 
  "markopolo123/dev_ops.excalidrawlib",
  "drwnio/drwnio.excalidrawlib",
  "maeddes/technology-logos.excalidrawlib",
  "pclainchard/it-logos.excalidrawlib",
  "cloud/cloud.excalidrawlib",
  "youritjang/azure-cloud-services.excalidrawlib",
  "farisology/data-science.excalidrawlib",
  "michelcaradec/cloud-design-patterns.excalidrawlib",
  "BjoernKW/UML-ER-library.excalidrawlib", 
  "madhusuthanan-b/html-css-js-icons.excalidrawlib",
  "madhusuthanan-b/front-end-tech-and-tools.excalidrawlib", 
  "mikhailredis/redis-grafana.excalidrawlib", 
];

async function loadLibraryFromPath(path: string): Promise<LibraryItems> {
  try {
    const res = await fetch(`${LIBRARIES_BASE}/${path}`);
    if (!res.ok) return [];
    const blob = await res.blob();
    const items = await loadLibraryFromBlob(blob, "published");
    return items ?? [];
  } catch {
    return [];
  }
}

async function loadAllDefaultLibraries(): Promise<LibraryItems> {
  const results = await Promise.allSettled(
    DEFAULT_LIBRARY_PATHS.map((path) => loadLibraryFromPath(path))
  );
  let merged: LibraryItems = [];
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length) {
      merged = mergeLibraryItems(merged, result.value);
    }
  }
  return merged;
}

export default function ExcalidrawBoard({ canEdit }: { canEdit: boolean }) {
  
  const { id: projectId } = useParams<{ id: string }>();
  const broadcast = useBroadcastEvent();
  const self = useSelf();
  const excalidrawAPI = useRef<ExcalidrawImperativeAPI | null>(null);
  const isRemote = useRef(false);
  const lastVersion = useRef(0);
  const saveTimeout = useRef<NodeJS.Timeout>(null);
  const [scene, setScene] = useState<DrawScene>({
    elements: [],
    appState: {
      showWelcomeScreen: false,
      collaborators: new Map(),
    },
  
    version: 0,
  });

  const initialData = useMemo(
    () => ({
      libraryItems: loadAllDefaultLibraries(),
    }),
    []
  );

  useEffect(() => {
    if (!excalidrawAPI.current) return;
    let cancelled = false;
    loadAllDefaultLibraries().then((items) => {
      if (cancelled || !items.length) return;
      excalidrawAPI.current?.updateLibrary({
        libraryItems: items,
        merge: true,
        openLibraryMenu: false,
        defaultStatus: "published",
      }).catch((e) => console.warn("Failed to merge default libraries:", e));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    async function load() {
      const res = await http.get<{ success: boolean; content: DrawScene }>(
        `/api/draw/${projectId}`
      );

      if (!res.data?.content) return;

      const elements = res.data.content.elements ?? [];
      const appState = res.data.content.appState ?? {};

      const fixedAppState: Partial<AppState> = {
        ...appState,
        showWelcomeScreen: false,
        collaborators: normalizeCollaborators(appState.collaborators),
      };

      const version = getSceneVersion(elements);

      setScene({
        elements,
        appState: fixedAppState,
       
        version,
      });

      lastVersion.current = version;

      excalidrawAPI.current?.updateScene({
        elements,
        appState: fixedAppState as AppState,
      });
    }

    load();
  }, [projectId]);

  
const handleChange = useCallback(
  (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
   
    if (!canEdit) {
        
        if (excalidrawAPI.current) {
          excalidrawAPI.current.updateScene({
            elements: scene.elements,
            appState: scene.appState as AppState,
          });
        }
        toast.warning("You don't have permission to edit the canvas");
        return; 
      }

    if (isRemote.current) return;

    const nonDeletedCount = elements.filter((el) => !el.isDeleted).length;
    const prevNonDeletedCount = scene.elements.filter((el) => !el.isDeleted).length;

    if (nonDeletedCount > MAX_ELEMENTS && nonDeletedCount > prevNonDeletedCount) {
    
      excalidrawAPI.current?.updateScene({
        elements: scene.elements, 
      });

      toast.info("Canvas limit reached (300 elements). Please delete some elements before adding more.");

      return;
    }

    const version = getSceneVersion(elements);
    if (version === lastVersion.current) return;

    
    const cleanAppState: Partial<AppState> = {
      ...appState,
      collaborators: normalizeCollaborators(appState.collaborators),
    };

    const nonDeletedElements = elements.filter((el) => !el.isDeleted);

    const newScene: DrawScene = {
      elements,
      appState: cleanAppState,
      
      version,
    };

    setScene(newScene);
    lastVersion.current = version;

    const allDeleted = elements.length === 0 || elements.every((el) => el.isDeleted === true);

    if (allDeleted) {
      const emptyScene: DrawScene = {
        elements: [],
        appState: {
          showWelcomeScreen: false,
          collaborators: new Map(),
        },
    
        version: 0,
      };

      setScene(emptyScene);
      lastVersion.current = 0;

      excalidrawAPI.current?.updateScene({
        elements: [],
        appState: {
          ...cleanAppState,
          showWelcomeScreen: false,
        } as AppState,
      });

      broadcast({
        type: "draw_update",
        payload: {
          content: JSON.parse(JSON.stringify(emptyScene)),
          senderId: String(self?.connectionId ?? "unknown"),
        },
      });

      return;
    }

 
    const payload: Json = {
      type: "draw_update",
      payload: {
        content: JSON.parse(JSON.stringify({
          ...newScene,
          elements: nonDeletedElements,
        })),
        senderId: String(self?.connectionId ?? "unknown"),
      },
    };

    console.log("payload", payload);
    broadcast(payload);

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      http.post(`/api/draw/${projectId}`, { content: newScene }).catch((err) => {
        console.error("Backend save failed:", err);
        toast.error("Failed to save canvas");
      });
    }, 1500);
  },
  [canEdit, broadcast, self?.connectionId, projectId, scene.elements,scene.appState]
);

  useEventListener(({ event }) => {
    if (
      !event ||
      typeof event !== "object" ||
      !("type" in event) ||
      event.type !== "draw_update" ||
      !("payload" in event)
    )
      return;
      
   const payload = event.payload as unknown as {
    content: DrawScene;
    senderId: string;
  };

  if (!payload?.content) return;
  if (payload.senderId === String(self?.connectionId)) return;


  isRemote.current = true;

  const elements = payload.content.elements ?? [];

  const safeCollaborators = normalizeCollaborators(payload.content.appState?.collaborators);

  const allDeleted = elements.length === 0 || elements.every(el => el.isDeleted === true);
  

  if (allDeleted) {
    excalidrawAPI.current?.updateScene({
      elements: [],
      appState: {
        ...payload.content.appState,
        showWelcomeScreen: false,
        collaborators: safeCollaborators, 
      } as AppState,
      captureUpdate: CaptureUpdateAction.NEVER,
    });

    setScene({
      elements: [],
      appState: {
        showWelcomeScreen: false,
        collaborators: safeCollaborators,
      },
      version: 0,
    });

    lastVersion.current = 0;
  } else {
    excalidrawAPI.current?.updateScene({
      elements,
      appState: {
        ...payload.content.appState,
        showWelcomeScreen: false,
        collaborators: safeCollaborators,
      } as AppState,
      captureUpdate: CaptureUpdateAction.NEVER,
    });

    lastVersion.current = elements.length > 0 ? getSceneVersion(elements) : 0;
  }

  setScene((prev) => ({
    ...prev,
    elements,
    appState: {
      ...prev.appState,
      ...payload.content.appState,
      collaborators: safeCollaborators, // ← always Map
    },
    version: lastVersion.current,
  }));

  setTimeout(() => {
    isRemote.current = false;
  }, 50);
  });

  const handlePointerUpdate = useCallback(
  (payload: { pointer: { x: number; y: number }; button: "up" | "down" | null }) => {
    if (!excalidrawAPI.current) return;

    const appState = excalidrawAPI.current.getAppState();

    if (appState.editingTextElement?.type === "text") {
      
      const elements = excalidrawAPI.current.getSceneElements();
     

      const payload = {
        type: "draw_update",
        payload: {
          content: JSON.parse(JSON.stringify({
            elements: elements.filter((el) => !el.isDeleted),
            appState: {
              viewBackgroundColor: appState.viewBackgroundColor,
            },
            version: getSceneVersion(elements),
          })),
          senderId: String(self?.connectionId ?? "unknown"),
        },
      };

      broadcast(payload);
    }
  },
  [broadcast, self?.connectionId]
);

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => (excalidrawAPI.current = api)}
        onChange={canEdit ? handleChange: undefined}
        onPointerUpdate={handlePointerUpdate}
        initialData={initialData}
        viewModeEnabled={!canEdit}
        theme="dark"
        UIOptions={{
          canvasActions: {
            loadScene: false,
            saveToActiveFile: false,
            saveAsImage: false
          },
          tools:{
            image:false
          }
        }}
      />
      <LiveCursors/>
    </div>
  );
}