"use client";

import { useEffect, useRef } from "react";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";
import {
  useBroadcastEvent,
  useEventListener,
  useSelf,
} from "@liveblocks/react";
import http from "@/lib/apiClient";
import { toast } from "sonner";

export default function BlockNoteEditorInner({
  initialContent,
  canEdit,
  projectId,
}: {
  initialContent?: PartialBlock[]; 
  canEdit: boolean;
  projectId: string;
}) {
  const self = useSelf();
  const broadcast = useBroadcastEvent();

  const isRemoteUpdate = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const editor = useCreateBlockNote({
    initialContent: initialContent && initialContent.length > 0 ? initialContent : undefined,
  });

  useEventListener(({ event }) => {
      if (event && typeof event === "object" && "type" in event) {
    if (!event || event.type !== "Type_note") return;

    const { note, senderId } = event.payload as unknown as {
      note: PartialBlock[];
      senderId: number;
    };

    if (senderId === self?.connectionId) return;

  
    if (JSON.stringify(editor.document) === JSON.stringify(note)) return;

    isRemoteUpdate.current = true;

    try {
     
      if (note.length === 0) {
        editor.removeBlocks(editor.document);
      } else {
        editor.replaceBlocks(editor.document, note);
      }
    } catch (err) {
      console.error("Failed to apply remote note update:", err);
    }

    isRemoteUpdate.current = false;
  }
  });

  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      if (!canEdit || isRemoteUpdate.current) return;

      const content = editor.document;

      broadcast({
        type: "Type_note",
        payload: {
          note: JSON.parse(JSON.stringify(content)),
          senderId: self?.connectionId,
        },
      });

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        try {
          await http.post(`/api/note/content-upload/${projectId}`, {
            content,
          });
         
        } catch (err) {
          console.error("Failed to save note:", err);
          toast.error("Failed to save note");
        }
      }, 800);
    });

    return () => unsubscribe?.();
  }, [editor, canEdit, projectId, broadcast, self?.connectionId]);

  return (
    <div className="relative h-[calc(100vh-84px)] bg-gradient-to-br from-neutral-900 to-neutral-950 overflow-y-auto">
      <div className="mx-auto w-full h-full">
        <div className="h-full bg-gradient-to-br bg-[#1f1f1f] shadow-xl overflow-y-auto">
          <BlockNoteView
            editor={editor}
            editable={canEdit}
            theme="dark"
            style={{ height: "100vh" }}
          />
        </div>
      </div>
    </div>
  );
}