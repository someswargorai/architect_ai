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

interface DrawScene {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
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

  const [scene, setScene] = useState<DrawScene>({
    elements: [],
    appState: {
      showWelcomeScreen: false,
      collaborators: new Map(),
    },
    files: {},
    version: 0,
  });

    const initialData = useMemo(
    () => ({
      libraryItems: loadAllDefaultLibraries(),
    }),
    []
  );


   useEffect(() => {
    if (!excalidrawAPI) return;
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
  }, [excalidrawAPI]);

  /* LOAD FROM BACKEND */
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
        files: res.data.content.files ?? {},
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

  /* LOCAL CHANGE */
  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      if (!canEdit || isRemote.current) return;

      const version = getSceneVersion(elements);
      if (version === lastVersion.current) return;

      const cleanAppState: Partial<AppState> = {
        ...appState,
        collaborators: normalizeCollaborators(appState.collaborators),
      };

       const newScene: DrawScene = {
        elements,
        appState: cleanAppState,
        files,
        version,
      };

      setScene(newScene);
      lastVersion.current = version;

      const payload: Json = {
  type: "draw_update",
  payload: {
    // ✅ Convert to JSON-safe object
    content: JSON.parse(JSON.stringify(newScene)),
    senderId: String(self?.connectionId ?? "unknown"),
  },
};


      broadcast(payload);

      http.post(`/api/draw/${projectId}`, { content: newScene }).catch(() => {});
    },
    [canEdit, broadcast, self?.connectionId, projectId]
  );

  /* REMOTE UPDATE */
  useEventListener(({ event }) => {
     if (
      !event ||
      typeof event !== "object" ||
      !("type" in event) ||
      event.type !== "draw_update" ||
      !("payload" in event)
    )
      return;
    if (!event || event.type !== "draw_update") return;

    const payload = event.payload as unknown as {
      content: DrawScene;
      senderId: string;
    };

    if (!payload?.content) return;
    if (payload.senderId === String(self?.connectionId)) return;

    isRemote.current = true;

    const elements = payload.content.elements ?? [];

    excalidrawAPI.current?.updateScene({
      elements, // 🔥 FORCE REPLACE → fixes Edge issue
      appState: {
        ...payload.content.appState,
        showWelcomeScreen: false,
        collaborators: normalizeCollaborators(
          payload.content.appState?.collaborators
        ),
      } as AppState,
      captureUpdate: CaptureUpdateAction.NEVER,
    });

    lastVersion.current = getSceneVersion(elements);

    setTimeout(() => {
      isRemote.current = false;
    }, 50);
  });

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => (excalidrawAPI.current = api)}
        onChange={handleChange}
        initialData={initialData}
        viewModeEnabled={!canEdit}
        theme="dark"
      />
    </div>
  );
}
