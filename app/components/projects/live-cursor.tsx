"use client";

import { useOthers } from "@liveblocks/react";

export type Presence = {
  cursor?: { x: number; y: number } | null;
  name?: string;
  email?: string;
};

declare global {
  interface Liveblocks {
    Presence: Presence;
  }
}

export default function LiveCursors() {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        if (!presence?.cursor) return null;

        return (
          <div
            key={connectionId}
            className="fixed pointer-events-none z-100 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: presence.cursor.x,
              top: presence.cursor.y,
            }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <div className="mt-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap shadow">
              {presence.email ?? "User"}
            </div>
          </div>
        );
      })}
    </>
  );
}
