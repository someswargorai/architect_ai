import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-indigo-500 transition-colors">
          A
        </div>
        <span className="text-xl font-bold tracking-tight text-white/90">
          ArchitectAI
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Features
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Templates
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">
          Sign In
        </button>
        <Link
          href="/dashboard"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
          }`}
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
};

export default Header;
