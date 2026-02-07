"use client";

import { useEffect, useState } from "react";
import type { PartialBlock } from "@blocknote/core";
import http from "@/lib/apiClient";
import { useParams } from "next/navigation";
import BlockNoteEditorInner from "./BlockNoteEditorInner";


export default function BlockNoteEditor({ canEdit }: { canEdit: boolean }) {
  const { id: projectId } = useParams();
  const [initialContent, setInitialContent] = useState<PartialBlock[] | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const res = await http.get(`/api/note/content-upload/${projectId}`);
        let content = res.data.content;

        if (typeof content === "string") content = JSON.parse(content);
        if (!Array.isArray(content)) content = [];

        setInitialContent(content);
      } catch (err) {
        console.error("Failed to load note", err);
        setInitialContent([]);
      }
    };

    loadNote();
  }, [projectId]);

  if (initialContent === null) {
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
