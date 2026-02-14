"use client";

import CanvasStudio from "@/app/components/projects/canvas-studio";
import { useParams } from "next/navigation";
import RoomProviderClient from "../../Room/RoomProviderClient";

export default function Page() {
  
  const {id}= useParams();
  return (
    <RoomProviderClient projectId={id as string}>
      <CanvasStudio />
    </RoomProviderClient>
  );
}
