"use client";

import {
  Excalidraw,
  getSceneVersion,
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
  useOthers,
  useSelf,
  useUpdateMyPresence,
} from "@liveblocks/react/suspense";
import type { Json } from "@liveblocks/client";
import { useParams } from "next/navigation";
import http from "@/lib/apiClient";

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

interface DrawScene {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
  version?: number;
}

export default function ExcalidrawBoard({ canEdit }: { canEdit: boolean }) {
  const { id: projectId } = useParams<{ id: string }>();
  const broadcast = useBroadcastEvent();
  const self = useSelf();
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const initialData = useMemo(
    () => ({
      libraryItems: loadAllDefaultLibraries(),
    }),
    []
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      updateMyPresence({
        cursor: { x: e.clientX, y: e.clientY },
      });
    },
    [updateMyPresence]
  );

  const onMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const isRemoteUpdate = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastBroadcastVersion = useRef<number>(-1);

  const [scene, setScene] = useState<DrawScene>({
    elements: [],
    appState: {
      viewBackgroundColor: "#ffffff",
      showWelcomeScreen: false,
      zenModeEnabled: false,
      collaborators: new Map(),
    },
    files: {},
    version: 0,
  });

  useEffect(() => {
    if (!excalidrawAPI) return;
    let cancelled = false;
    loadAllDefaultLibraries().then((items) => {
      if (cancelled || !items.length) return;
      excalidrawAPI.updateLibrary({
        libraryItems: items,
        merge: true,
        openLibraryMenu: false,
        defaultStatus: "published",
      }).catch((e) => console.warn("Failed to merge default libraries:", e));
    });
    return () => { cancelled = true; };
  }, [excalidrawAPI]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await http.get<{ success: boolean; content: DrawScene }>(
          `/api/draw/${projectId}`
        );

        if (!mounted) return;

        let loaded: DrawScene | null = null;

        if (res.data.success && res.data.content) {
          loaded = res.data.content;
        } else {

          const saved = localStorage.getItem("excalidraw-board");
          if (saved) {
            try {
              loaded = JSON.parse(saved) as DrawScene;
            } catch {
              console.warn("Invalid localStorage drawing data");
            }
          }
        }

        if (!loaded || !loaded.elements?.length) return;

        const loadedCollaborators = loaded.appState?.collaborators;
        const collaborators =
          loadedCollaborators instanceof Map
            ? loadedCollaborators
            : Array.isArray(loadedCollaborators)
              ? new Map(loadedCollaborators as Iterable<[string, unknown]>)
              : new Map();

        const normalizedAppState: Partial<AppState> = {
          ...loaded.appState,
          showWelcomeScreen: false,
          collaborators,
        };

        const finalScene: DrawScene = {
          ...loaded,
          appState: normalizedAppState,
          version: getSceneVersion(loaded.elements),
        };

        setScene(finalScene);
        lastBroadcastVersion.current = finalScene.version ?? 0;

        if (excalidrawAPI) {
          excalidrawAPI.updateScene({
            elements: finalScene.elements,
            appState: finalScene.appState as AppState,
          });
        }
      } catch (err) {
        console.error("Failed to load drawing:", err);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [projectId, excalidrawAPI]);

  useEffect(() => {
    if (!excalidrawAPI) return;

    excalidrawAPI.updateScene({
      elements: scene.elements,
      appState: scene.appState as AppState,
    });
  }, [excalidrawAPI, scene.elements, scene.appState, scene.files]);

  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      if (!canEdit || isRemoteUpdate.current) return;

      const newVersion = getSceneVersion(elements);
      if (newVersion === lastBroadcastVersion.current) return;

      const newScene: DrawScene = { elements, appState, files, version: newVersion };

      setScene(newScene);

      const payload: Json = JSON.parse(
        JSON.stringify({
          type: "draw_update",
          payload: {
            content: newScene,
            senderId: String(self?.connectionId ?? "unknown"),
          },
        })
      );
      broadcast(payload);

      lastBroadcastVersion.current = newVersion;

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        http.post(`/api/draw/${projectId}`, { content: newScene }).catch(console.error);
        localStorage.setItem("excalidraw-board", JSON.stringify(newScene));
      }, 1800);
    },
    [canEdit, broadcast, self?.connectionId, projectId]
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
    const { content, senderId } = payload;

    if (String(senderId) === String(self?.connectionId)) return;

    isRemoteUpdate.current = true;

    const rawCollaborators = content.appState?.collaborators;
    const collaborators =
      rawCollaborators instanceof Map
        ? rawCollaborators
        : Array.isArray(rawCollaborators)
          ? new Map(rawCollaborators as Iterable<[string, unknown]>)
          : new Map();

    const normalizedAppState: Partial<AppState> = {
      ...content.appState,
      showWelcomeScreen: false,
      collaborators,
    };

    const newVersion = content.version ?? getSceneVersion(content.elements);

    const newScene: DrawScene = {
      elements: content.elements,
      appState: normalizedAppState,
      files: content.files ?? {},
      version: newVersion,
    };

    setScene(newScene);

    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: newScene.elements,
        appState: newScene.appState as AppState,
      });
    }

    lastBroadcastVersion.current = newVersion;

    setTimeout(() => {
      isRemoteUpdate.current = false;
    }, 0);
  });

  return (
    <div
      className="relative h-[calc(100vh-84px)] w-full rounded-xl overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleChange}
        initialData={initialData}
        autoFocus={true}
        viewModeEnabled={!canEdit}
        theme="dark"
        name="Collaborative Whiteboard"
      />
      {others.map(({ connectionId, presence }) => {
        if (!presence?.cursor) return null;
        return (
          <div
            key={connectionId}
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: presence.cursor!.x,
              top: presence.cursor!.y,
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white shadow" />
            <div className="mt-1 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap shadow">
              {(presence as { name?: string; email?: string }).name ??
                (presence as { name?: string; email?: string }).email ??
                "User"}
            </div>
          </div>
        );
      })}
    </div>
  );
}