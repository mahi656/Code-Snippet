import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Search,
  Calendar,
  FileCode2,
  FileJson,
  Plus,
  FilePlus,
  FolderPlus,
  Menu,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

import { FullScreenCalendar } from "./fullscreen-calendar.jsx";
import NewSnippet from "../Snippet/NewSnippet.jsx";
import { ProfilePage } from "../../../Profile/Profile.jsx";

export const Example = () => {
  const [isDark, setIsDark] = useState(true);
  const [selected, setSelected] = useState("All Snippets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real project implementation: Store our created snippets globally!
  const [globalSnippets, setGlobalSnippets] = useState<any[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const username = params.get('username');

    if (token) {
      localStorage.setItem('token', token);
      if (username) {
        localStorage.setItem('username', username);
      }
      // Remove token from URL
      navigate('/dashboard', { replace: true });
    } else {
      // Auth Guard: check if token exists in localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login', { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <div className={`flex min-h-screen w-full font-sans antialiased ${isDark ? "dark" : ""}`}>
      <div className="flex w-full bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 h-screen overflow-hidden">
        <Sidebar
          selected={selected}
          setSelected={setSelected}
          isDark={isDark}
          setIsDark={setIsDark}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Toggle Button when Sidebar is Hidden */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-[22px] left-6 z-50 p-2.5 rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] text-gray-500 hover:text-gray-900 dark:text-[#a1a1aa] dark:hover:text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}
        {selected === "Calendar" ? (
          <div className="flex-1 bg-[#fffcf9] dark:bg-[#050505] overflow-hidden flex flex-col h-screen">
            <FullScreenCalendar data={[]} isDark={isDark} setIsDark={setIsDark} />
          </div>
        ) : selected === "Profile" ? (
          <div className="flex-1 overflow-hidden h-screen flex flex-col bg-white dark:bg-black">
            <ProfilePage onBack={() => setSelected("All Snippets")} isDark={isDark} />
          </div>
        ) : ["All Snippets", "Favorites", "Trash"].includes(selected) ? (
          <ExampleContent isDark={isDark} setIsDark={setIsDark} selected={selected} isSidebarOpen={isSidebarOpen} />
        ) : (
          <div className="flex-1 overflow-hidden h-screen bg-white dark:bg-[#09090b]">
            <NewSnippet
              onCancel={() => setSelected("All Snippets")}
              existingSnippets={globalSnippets}
              onSave={(snippetData: any) => {
                setGlobalSnippets([...globalSnippets, snippetData]);
                setSelected("All Snippets");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ selected, setSelected, isDark, setIsDark, isSidebarOpen, setIsSidebarOpen }: any) => {
  const username = localStorage.getItem('username') || "User";
  const userInitial = username.charAt(0).toUpperCase();

  const [projects, setProjects] = useState<any[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [creatingItemInProjectId, setCreatingItemInProjectId] = useState<number | null>(null);
  const [creatingItemType, setCreatingItemType] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, { id: Date.now(), name: newProjectName.trim(), items: [] }]);
    }
    setNewProjectName("");
    setIsCreatingProject(false);
  };

  const handleCreateItem = () => {
    if (newItemName.trim() && creatingItemInProjectId) {
      setProjects(projects.map(p => {
        if (p.id === creatingItemInProjectId) {
          return {
            ...p,
            items: [...(p.items || []), { id: Date.now(), name: newItemName.trim(), type: creatingItemType }]
          };
        }
        return p;
      }));
    }
    setNewItemName("");
    setCreatingItemInProjectId(null);
    setCreatingItemType(null);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleDeleteItem = (projectId: number, itemId: number) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          items: p.items.filter((i: any) => i.id !== itemId)
        };
      }
      return p;
    }));
  };

  return (
    <nav className={`flex shrink-0 flex-col bg-[#f8f9fa] dark:bg-[#09090b] h-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-40 ${isSidebarOpen ? 'w-72 border-r border-gray-200 dark:border-[#27272a] opacity-100' : 'w-0 border-r-0 opacity-0 pointer-events-none'}`}>
      <div className="w-72 h-full flex flex-col overflow-hidden">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center shrink-0">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-gray-900 dark:text-white">
                <rect x="4" y="4" width="14" height="14" rx="4" fill="currentColor" fillOpacity="1" />
                <rect x="22" y="22" width="14" height="14" rx="4" fill="currentColor" fillOpacity="1" />
                <rect x="4" y="22" width="14" height="14" rx="4" fill="currentColor" fillOpacity="0.25" />
                <rect x="22" y="4" width="14" height="14" rx="4" fill="currentColor" fillOpacity="0.25" />
              </svg>
            </div>
            <span className="text-[17px] font-medium text-gray-900 dark:text-white mt-0.5 tracking-tight">CodeSnippet</span>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#27272a] transition-colors"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <button
            onClick={() => setSelected("New Snippet")}
            className="w-full flex items-center justify-center gap-2 bg-[#e5e5e5] hover:bg-white text-black text-[14px] font-medium py-2.5 rounded-xl shadow-sm transition-colors active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-2" />
            New Snippet
          </button>
        </div>

        <div className="px-5 pb-2">
          <h2 className="text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase px-2 mb-1">Navigation</h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-1.5 scrollbar-hide">
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

          <div className="my-6 border-b border-gray-200 dark:border-neutral-800/40 w-[85%] mx-auto" />

          <div className="space-y-4">
            <CollapsibleGroup title="Projects" Icon={Folder} defaultExpanded>
              <div className="mt-1 flex flex-col space-y-1">

                {/* Render Existing Projects */}
                {projects.map((proj: any) => (
                  <ProjectFolder
                    key={proj.id}
                    title={proj.name}
                    defaultExpanded
                    onNewFile={() => { setCreatingItemInProjectId(proj.id); setCreatingItemType("file"); setNewItemName(""); }}
                    onNewFolder={() => { setCreatingItemInProjectId(proj.id); setCreatingItemType("folder"); setNewItemName(""); }}
                    onDelete={() => handleDeleteProject(proj.id)}
                  >
                    {/* Render Items */}
                    {proj.items?.map((item: any) => (
                      item.type === "folder" ? (
                        <ProjectFolder
                          key={item.id}
                          title={item.name}
                          onDelete={() => handleDeleteItem(proj.id, item.id)}
                        >
                          <div className="py-1 px-3 text-[12px] text-gray-400 dark:text-gray-500 italic">Empty</div>
                        </ProjectFolder>
                      ) : (
                        <ProjectFile
                          key={item.id}
                          title={item.name}
                          selected={selected}
                          setSelected={setSelected}
                          onDelete={() => handleDeleteItem(proj.id, item.id)}
                        />
                      )
                    ))}

                    {/* Inline Input for New Item directly inside project */}
                    {creatingItemInProjectId === proj.id && (
                      <div className="flex items-center gap-2 px-1 py-1 ml-1 mt-0.5 border border-[#a78bfa] rounded bg-white dark:bg-[#09090b]">
                        {creatingItemType === "folder" ? <Folder className="h-3 w-3 text-[#a78bfa] shrink-0" /> : <FileText className="h-3 w-3 text-[#a78bfa] shrink-0" />}
                        <input
                          autoFocus
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateItem();
                            else if (e.key === 'Escape') {
                              setNewItemName("");
                              setCreatingItemInProjectId(null);
                              setCreatingItemType(null);
                            }
                          }}
                          onBlur={handleCreateItem}
                          className="bg-transparent text-[13px] outline-none w-full text-gray-900 dark:text-white"
                          placeholder={`New ${creatingItemType}...`}
                        />
                      </div>
                    )}

                    {(!proj.items || proj.items.length === 0) && creatingItemInProjectId !== proj.id && (
                      <div className="py-1 px-3 text-[12px] text-gray-400 dark:text-gray-500 italic">Empty Project</div>
                    )}
                  </ProjectFolder>
                ))}

                {/* Inline Input for New Project */}
                {isCreatingProject ? (
                  <div className="flex items-center gap-2 px-2 py-1.5 mx-1 mt-1 border border-[#a78bfa] rounded-md bg-white dark:bg-[#09090b] shadow-sm">
                    <Folder className="h-3.5 w-3.5 text-[#a78bfa] shrink-0" />
                    <input
                      autoFocus
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateProject();
                        else if (e.key === 'Escape') {
                          setNewProjectName("");
                          setIsCreatingProject(false);
                        }
                      }}
                      onBlur={handleCreateProject}
                      className="bg-transparent text-[13px] outline-none w-full text-gray-900 dark:text-white"
                      placeholder="Project name..."
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreatingProject(true)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-neutral-800/40 rounded-md transition-colors"
                    title="Create a new project"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Project
                  </button>
                )}

                {/* Empty State */}
                {projects.length === 0 && !isCreatingProject && (
                  <div className="py-1 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No projects yet</div>
                )}
              </div>
            </CollapsibleGroup>

            <CollapsibleGroup title="Tags" Icon={Tag}>
              <div className="py-2 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No tags defined yet</div>
            </CollapsibleGroup>

            <CollapsibleGroup title="Languages" Icon={CodeXml}>
              <div className="py-2 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No languages defined yet</div>
            </CollapsibleGroup>
          </div>
          <div className="pb-4" />
        </div>

        <div className="p-4 mt-auto border-t border-gray-200 dark:border-neutral-800/60">
          <div className="flex items-center gap-4 px-2 w-full">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-gray-200/50 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-gray-400"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div
              onClick={() => setSelected("Profile")}
              className="flex items-center justify-between w-full p-1.5 bg-gray-100/50 hover:bg-gray-200/80 dark:bg-[#1a1c1e] dark:hover:bg-[#272a2d] border border-transparent rounded-full cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d3b44] text-[#7de5ed] font-bold text-[15px] shadow-sm">
                  {userInitial}
                </div>
                <div className="flex flex-col items-start -mt-0.5">
                  <span className="text-[14px] font-semibold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {username}
                  </span>
                  <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-tight">
                    My Profile
                  </span>
                </div>
              </div>
              <MoreVertical className="h-[18px] w-[18px] text-gray-400 mr-2 shrink-0" />
            </div>
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
      className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-200 px-3.5 ${isSelected
        ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
        : "text-gray-600 dark:text-[#9ca3af] hover:bg-gray-200/50 dark:hover:bg-neutral-800/40 font-medium hover:text-gray-900 dark:hover:text-gray-200"
        }`}
    >
      <div className="flex items-center gap-3.5">
        <Icon className={`h-5 w-5 ${isSelected ? "text-gray-900 dark:text-white stroke-[2.5]" : "text-gray-500 dark:text-[#8b919d] stroke-2"}`} />
        <span className="text-[15px] pt-[1px]">{title}</span>
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
        className="relative flex h-10 w-full items-center justify-between rounded-xl transition-all duration-200 text-gray-600 dark:text-[#9ca3af] hover:bg-gray-200/50 dark:hover:bg-neutral-800/40 px-3.5 font-medium cursor-pointer hover:text-gray-900 dark:hover:text-gray-200"
      >
        <div className="flex items-center gap-3.5">
          <Icon className="h-5 w-5 text-gray-500 dark:text-[#8b919d]" />
          <span className="text-[15px] pt-[1px]">{title}</span>
        </div>
        <div>
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
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

const ProjectFolder = ({ title, children, defaultExpanded = false, onNewFile, onNewFolder, onDelete }: any) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="flex flex-col group">
      <div className="relative flex h-8 w-full items-center justify-between rounded-md px-2 transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-200/40 dark:hover:bg-neutral-800/40">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center gap-2 outline-none"
        >
          <ChevronRight className={`h-[14px] w-[14px] text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
          {expanded ? <FolderOpen className="h-4 w-4 text-[#a78bfa]" /> : <Folder className="h-4 w-4 text-[#a78bfa]" />}
          <span className="text-[14px] pt-[1px] font-medium">{title}</span>
        </button>
        <div className="hidden group-hover:flex items-center gap-1">
          {onNewFile && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(true); onNewFile(); }} className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" title="New File">
              <FilePlus className="h-3.5 w-3.5" />
            </button>
          )}
          {onNewFolder && (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(true); onNewFolder(); }} className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" title="New Folder">
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 hover:bg-red-200 dark:hover:bg-red-900/40 rounded text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {expanded && (
        <div className="flex flex-col pl-4 border-l border-gray-200 dark:border-neutral-800/60 ml-4 mt-0.5 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
};

const ProjectFile = ({ title, Icon = FileText, selected, setSelected, onDelete }: any) => {
  const isSelected = selected === title;
  return (
    <div className="flex flex-col group relative">
      <button
        onClick={() => setSelected(title)}
        className={`relative flex h-8 w-full items-center justify-between rounded-md px-2 transition-colors ${isSelected
          ? "bg-gray-200/60 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-semibold"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/40 dark:hover:bg-neutral-800/40 font-medium hover:text-gray-900 dark:hover:text-gray-200"
          }`}
      >
        <div className="flex items-center gap-2 pl-4">
          <Icon className={`h-4 w-4 ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-400"}`} />
          <span className="text-[14px] pt-[1px]">{title}</span>
        </div>
      </button>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute right-2 top-1.5 hidden group-hover:flex p-1 hover:bg-red-200 dark:hover:bg-red-900/40 rounded text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

const ExampleContent = ({ isDark, setIsDark, selected, isSidebarOpen }: any) => {
  return (
    <div className="flex-1 bg-white dark:bg-black flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`h-[4.5rem] flex items-center gap-4 border-b border-gray-100 dark:border-[#27272a] shrink-0 transition-all ${isSidebarOpen ? 'px-8' : 'pl-20 pr-8'}`}>
        <h1 className="text-[22px] font-medium tracking-tight capitalize text-gray-900 dark:text-white flex-1">{selected}</h1>
        <div className="flex items-center gap-5">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-[18px] w-[18px] text-gray-400" />
            <input type="text" placeholder="Search..." className="h-10 w-72 rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/20 dark:text-white transition-all placeholder:text-[#52525b]" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="rounded-2xl border border-gray-200 dark:border-[#27272a] bg-gray-50/50 dark:bg-[#09090b]/50 p-8 shadow-sm flex items-center justify-center h-full min-h-[400px]">
          <p className="text-gray-500 dark:text-[#a1a1aa] text-[15px]">
            Content for <strong className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{selected}</strong> goes here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Example;