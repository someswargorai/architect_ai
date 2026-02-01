"use client";

import CanvasStudio from "@/app/components/projects/canvas-studio";
import { useParams } from "next/navigation";
import Room from "../../Room/page";

export default function Page() {
  
  const {id}= useParams();
  return (
    <Room projectId={id as string}>
      <CanvasStudio />
    </Room>
  );
}
