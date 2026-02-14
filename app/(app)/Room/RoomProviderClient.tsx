"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export default function RoomProviderClient({
  children,
  projectId,
}: {
  children: ReactNode;
  projectId: string;
}) {

  const userPresence = { cursor: null, isEditing: false };
 
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={`${projectId}`} initialPresence={userPresence}>
        <ClientSideSuspense fallback={<div></div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
