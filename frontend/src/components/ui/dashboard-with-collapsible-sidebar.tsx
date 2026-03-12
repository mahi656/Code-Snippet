import React, { useState, useEffect } from "react";
import {
  FileText,
  Heart,
  Trash2,
  Tag,
  CodeXml,
  Folder,
  FolderOpen,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Calendar,
  FileCode2,
  FileJson,
} from "lucide-react";

import { FullScreenCalendar } from "./fullscreen-calendar.jsx";

export const Example = () => {
  const [isDark, setIsDark] = useState(false);
  const [selected, setSelected] = useState("All Snippets");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className={`flex min-h-screen w-full ${isDark ? "dark" : ""}`}>
      <div className="flex w-full bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 h-screen overflow-hidden">
        <Sidebar selected={selected} setSelected={setSelected} isDark={isDark} setIsDark={setIsDark} />
        {selected === "Calendar" ? (
          <div className="flex-1 bg-white dark:bg-neutral-950 overflow-hidden flex flex-col h-screen">
            <FullScreenCalendar data={[]} isDark={isDark} setIsDark={setIsDark} />
          </div>
        ) : (
          <ExampleContent isDark={isDark} setIsDark={setIsDark} selected={selected} />
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ selected, setSelected, isDark, setIsDark }: any) => {
  return (
    <nav className="flex w-64 flex-col bg-[#f5f6f8] dark:bg-[#111318] border-r border-gray-200 dark:border-neutral-800 h-full overflow-hidden">
      <div className="p-4 py-5">
        <h2 className="text-[13px] font-semibold text-gray-500 mb-2 px-3">Navigation</h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1 scrollbar-hide">
        <Option
          Icon={FileText}
          title="All Snippets"
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          Icon={Heart}
          title="Favorites"
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          Icon={Calendar}
          title="Calendar"
          selected={selected}
          setSelected={setSelected}
        />
        <Option
          Icon={Trash2}
          title="Trash"
          selected={selected}
          setSelected={setSelected}
        />

        <div className="my-6" />

        <div className="space-y-4">
          <CollapsibleGroup title="Projects" Icon={Folder} defaultExpanded>
            <div className="py-2 px-3 text-xs text-gray-400 dark:text-gray-500 italic">No projects yet</div>
          </CollapsibleGroup>

          <CollapsibleGroup title="Tags" Icon={Tag}>
            {/* Empty by default - will be populated when you create defined code snippets */}
            <div className="py-2 px-3 text-xs text-gray-400 dark:text-gray-500 italic">No tags defined yet</div>
          </CollapsibleGroup>

          <CollapsibleGroup title="Languages" Icon={CodeXml}>
            {/* Empty by default - will be populated when you create defined code snippets */}
            <div className="py-2 px-3 text-xs text-gray-400 dark:text-gray-500 italic">No languages defined yet</div>
          </CollapsibleGroup>
        </div>
        <div className="pb-4" />
      </div>

      <div className="p-4 mt-auto">
        <div className="flex items-center gap-4 px-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-white font-medium text-sm">
              A
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
              User
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected }: any) => {
  const isSelected = selected === title;

  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-lg transition-all duration-200 px-3 ${isSelected
        ? "bg-gray-200/60 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold shadow-sm"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-neutral-800/50 font-medium"
        }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-[18px] w-[18px] ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`} />
        <span className="text-[15px]">{title}</span>
      </div>
    </button>
  );
};

const CollapsibleGroup = ({ title, Icon, children, defaultExpanded = false }: any) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setExpanded(!expanded)}
        className="relative flex h-9 w-full items-center justify-between rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200/40 dark:hover:bg-neutral-800/50 px-3 font-medium cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4" />
          <span className="text-[14px]">{title}</span>
        </div>
        <div>
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
        </div>
      </button>
      {expanded && (
        <div className="mt-1 flex flex-col px-3">
          {children}
        </div>
      )}
    </div>
  );
};

const ProjectFolder = ({ title, children, defaultExpanded = false }: any) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setExpanded(!expanded)}
        className="relative flex min-h-[30px] w-full items-center justify-between rounded-lg px-2 py-1 transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-neutral-800/50"
      >
        <div className="flex items-center gap-2">
          <ChevronRight className={`h-3 w-3 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? <FolderOpen className="h-4 w-4 text-blue-500" /> : <Folder className="h-4 w-4 text-blue-400 dark:text-blue-500" />}
          <span className="text-[14px]">{title}</span>
        </div>
      </button>
      {expanded && (
        <div className="flex flex-col pl-4 border-l border-gray-200 dark:border-neutral-800 ml-4 mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
};

const ProjectFile = ({ title, Icon = FileText, selected, setSelected }: any) => {
  const isSelected = selected === title;
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex min-h-[30px] w-full items-center justify-between rounded-lg px-2 py-1 transition-colors ${isSelected
        ? "bg-gray-200/60 dark:bg-neutral-800 text-gray-900 dark:text-white font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/40 dark:hover:bg-neutral-800/50"
        }`}
    >
      <div className="flex items-center gap-2 pl-4">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-[14px]">{title}</span>
      </div>
    </button>
  );
};

const ExampleContent = ({ isDark, setIsDark, selected }: any) => {
  return (
    <div className="flex-1 bg-white dark:bg-[#0a0a0a] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-8 border-b border-gray-100 dark:border-neutral-800 shrink-0">
        <div>
          <h1 className="text-xl font-semibold capitalize text-gray-900 dark:text-gray-100">{selected}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="h-9 w-64 rounded-md border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 pl-9 pr-4 text-sm outline-none focus:border-blue-500 dark:text-white transition-colors" />
          </div>
          <button className="relative p-2 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 p-8 shadow-sm flex items-center justify-center h-full min-h-[400px]">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Content for <strong className="capitalize">{selected}</strong> goes here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Example;