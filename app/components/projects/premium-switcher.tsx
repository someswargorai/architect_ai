import React from "react";

interface PremiumSwitcherProps {
  activeTab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
}

const TABS = [
  { id: 1, label: "Graph" },
  { id: 2, label: "Note" },
  { id: 3, label: "Draw" },
] as const;

export const PremiumSwitcher: React.FC<PremiumSwitcherProps> = ({
  activeTab,
  setTab,
}) => {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const pillOffset = activeIndex < 0 ? 0 : activeIndex;

  return (
    <div className="fixed top-3.5 left-1/2 z-[10000] -translate-x-1/2">
      <div className="relative flex rounded-full bg-black/40 backdrop-blur-2xl shadow-2xl border border-white/10 p-1.5 ring-1 ring-white/5">
        {/* Sliding pill: one-third width, position by index (p-1.5 = 6px each side) */}
        <div
          className="absolute top-1.5 bottom-1.5 w-[calc((100%-12px)/3)] rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-[left] duration-300 ease-out"
          style={{
            left: `calc(6px + ${pillOffset} * (100% - 12px) / 3)`,
          }}
        />

        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`relative z-10 flex-1 min-w-0 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 select-none
              ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
