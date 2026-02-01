import { useSelf, useOthers } from "@liveblocks/react";

export default function ShowOnlines() {
  const self = useSelf();
  const others = useOthers();

  return (
    <div className="fixed right-6 top-24 w-60 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm font-medium text-neutral-300">Online</span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          {others.length + 1}
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto px-2 pb-3">
        {self && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="truncate">You</span>
            <span className="ml-auto text-xs text-neutral-400">Owner</span>
          </div>
        )}

        {others.map(({ connectionId, info }) => (
          <div
            key={connectionId}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-200 transition hover:bg-white/5"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="truncate">{info?.email as string ?? "Anonymous"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
