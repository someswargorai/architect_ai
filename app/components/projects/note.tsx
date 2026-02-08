"use client";

import { useEffect, useState } from "react";
import type { PartialBlock } from "@blocknote/core";
import http from "@/lib/apiClient";
import { useParams } from "next/navigation";
import BlockNoteEditorInner from "./BlockNoteEditorInner";

export default function BlockNoteEditor({ canEdit }: { canEdit: boolean }) {
  const { id: projectId } = useParams<{ id: string }>();
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      setIsLoading(true);
      try {
        const res = await http.get(`/api/note/content-upload/${projectId}`);

        let content = res.data?.content;

        if (content === null || content === undefined) {
          content = [];
        } else if (typeof content === "string") {
          try {
            content = JSON.parse(content);
          } catch {
            content = [];
          }
        }

        setInitialContent(Array.isArray(content) && content.length > 0 ? content : undefined);
      } catch (err) {
        console.error("Failed to load note:", err);
        setInitialContent(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    loadNote();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-500">
        Loading note…
      </div>
    );
  }

  return (
    <BlockNoteEditorInner
      key={projectId as string}
      initialContent={initialContent}
      canEdit={canEdit}
      projectId={projectId as string}
    />
  );
}