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
import { motion, AnimatePresence } from "framer-motion";
import SnippetCard from "../Snippet/SnippetCard.jsx";
import VersionHistory from "../Snippet/VersionHistory.jsx";
import api from "../../api/api";
import { toast } from "./Notification.jsx";

export const Example = () => {
  console.log("Dashboard (Example) Rendering...");
  const [isDark, setIsDark] = useState(true);
  const [selected, setSelected] = useState("All Snippets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real project implementation: Store our created snippets globally!
  const [globalSnippets, setGlobalSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<any | null>(null);
  const [versionSnippetId, setVersionSnippetId] = useState<string | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchSnippets = async (tab = selected, query = searchQuery, tag = selectedTag, lang = selectedLanguage) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    try {
      let response;
      if (query.trim()) {
        const filters: any = {};
        if (tab === "Favorites") filters.isFavorite = "true";
        if (tab === "Trash") filters.isDeleted = "true";
        if (tab === "Tag" && tag) filters.tag = tag;
        if (tab === "Language" && lang) filters.language = lang;

        const params = new URLSearchParams({ q: query, ...filters });
        response = await api.get(`/api/search?${params.toString()}`);
        if (response.data && response.data.data) {
          setGlobalSnippets(response.data.data.results || []);
        }
      } else {
        let endpoint;
        if (tab === "Trash") {
          endpoint = '/api/trash/';
        } else if (tab === "Tag" && tag) {
          endpoint = `/api/tags/${tag.toLowerCase()}/snippets`;
        } else if (tab === "Language" && lang) {
          endpoint = `/api/languages/${lang.toLowerCase()}/snippets`;
        } else {
          endpoint = '/api/snippets/';
        }

        response = await api.get(endpoint);
        if (response.data && response.data.data) {
          let snippets = response.data.data;
          if (tab === "Favorites") {
            snippets = snippets.filter((s: any) => s.isFavorite);
          }
          setGlobalSnippets(snippets);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if ((err as any).response?.status !== 401) {
        toast("Failed to load snippets", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/api/tags');
      if (response.data && response.data.data) {
        setTags(response.data.data);
      }
    } catch (err) {
      console.error("Fetch tags error:", err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await api.get('/api/languages');
      if (response.data && response.data.data) {
        setLanguages(response.data.data);
      }
    } catch (err) {
      console.error("Fetch languages error:", err);
    }
  };

  useEffect(() => {
    if (["All Snippets", "Favorites", "Trash", "Tag", "Language"].includes(selected)) {
      fetchSnippets(selected, searchQuery, selectedTag, selectedLanguage);
    }
    fetchTags();
    fetchLanguages();
  }, [selected, selectedTag, selectedLanguage]);

  // Removed redundant useEffect. Fetching is now handled by the Auth Guard below.

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await api.put(`/api/snippets/${id}`, { isFavorite });
      if (response.data) {
        setGlobalSnippets(prev =>
          prev.map(s => s._id === id ? { ...s, isFavorite } : s)
        );
        toast(isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
      }
    } catch (err) {
      toast("Failed to update snippet", "error");
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }

    try {
      const isPermanent = selected === "Trash";
      const endpoint = isPermanent ? `/api/trash/${id}` : `/api/snippets/${id}`;

      const response = await api.delete(endpoint);
      if (response.data) {
        setGlobalSnippets(prev => prev.filter(s => s._id !== id));
        toast(isPermanent ? "Snippet permanently deleted" : "Snippet moved to trash", 'success');
        setDeleteId(null);
      }
    } catch (err) {
      toast("Failed to delete snippet", "error");
      setDeleteId(null);
    }
  };

  const handleRestoreSnippet = async (id: string) => {
    try {
      const response = await api.patch(`/api/trash/${id}/restore`);
      if (response.data) {
        setGlobalSnippets(prev => prev.filter(s => s._id !== id));
        toast("Snippet restored successfully", 'success');
      }
    } catch (err) {
      toast("Failed to restore snippet", "error");
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const response = await api.delete('/api/trash/');
      if (response.data) {
        setGlobalSnippets([]);
        toast("Trash emptied", 'success');
      }
    } catch (err) {
      toast("Failed to empty trash", "error");
    }
  };

  const handleRestoreVersion = async (version: any) => {
    if (!versionSnippetId) return;
    try {
      const response = await api.put(`/api/snippets/${versionSnippetId}`, {
        title: version.title,
        description: version.description,
        language: version.language,
        framework: version.framework,
        tags: version.tags,
        code: version.code,
        changeNote: `Restored to version from ${format(new Date(version.createdAt), 'MMM dd, HH:mm')}`
      });

      if (response.data && response.data.success) {
        setGlobalSnippets(prev =>
          prev.map(s => s._id === versionSnippetId ? response.data.data.snippet : s)
        );
        toast("Snippet fully restored to historical state", "success");
        setVersionSnippetId(null);
      }
    } catch (err) {
      toast("Failed to restore version", "error");
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (["All Snippets", "Favorites", "Trash", "Tag", "Language"].includes(selected)) {
        fetchSnippets(selected, searchQuery, selectedTag, selectedLanguage);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

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
      fetchSnippets();
    } else {
      // Auth Guard: check if token exists in localStorage
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login', { replace: true });
      } else {
        fetchSnippets();
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
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          languages={languages}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
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
            <FullScreenCalendar data={globalSnippets.filter(s => s.showInCalendar)} isDark={isDark} setIsDark={setIsDark} />
          </div>
        ) : selected === "Profile" ? (
          <div className="flex-1 overflow-hidden h-screen flex flex-col bg-white dark:bg-black">
            <ProfilePage onBack={() => setSelected("All Snippets")} isDark={isDark} />
          </div>
        ) : ["All Snippets", "Favorites", "Trash", "Tag", "Language"].includes(selected) ? (
          <ExampleContent
            isDark={isDark}
            setIsDark={setIsDark}
            selected={selected}
            selectedTag={selectedTag}
            selectedLanguage={selectedLanguage}
            isSidebarOpen={isSidebarOpen}
            snippets={globalSnippets}
            isLoading={isLoading}
            onFavorite={handleToggleFavorite}
            onDelete={handleDeleteSnippet}
            onRestore={handleRestoreSnippet}
            onEmptyTrash={handleEmptyTrash}
            onEdit={(snippet: any) => {
              setEditingSnippet(snippet);
              setSelected("Edit Snippet");
            }}
            onHistory={(id: string) => {
              setVersionSnippetId(id);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : (
          <div className="flex-1 overflow-hidden h-screen bg-white dark:bg-[#09090b]">
            <NewSnippet
              onCancel={() => {
                setEditingSnippet(null);
                setSelected("All Snippets");
              }}
              existingSnippets={globalSnippets}
              isEditing={!!editingSnippet}
              snippet={editingSnippet}
              onSave={(savedSnippet: any) => {
                if (editingSnippet) {
                  setGlobalSnippets(prev => prev.map(s => s._id === savedSnippet._id ? savedSnippet : s));
                } else {
                  setGlobalSnippets(prev => [savedSnippet, ...prev]);
                }
                setEditingSnippet(null);
                setSelected("All Snippets");
              }}
            />
          </div>
        )}
      </div>

      {/* AI-Native Delete Confirmation Pill */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-fit px-6">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
              className="flex items-center gap-6 px-6 py-3 rounded-full bg-zinc-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[14px] font-semibold text-white whitespace-nowrap tracking-tight">
                  {selected === "Trash" ? "Permanently Delete?" : "Move to Trash?"}
                </span>
              </div>

              <div className="h-4 w-[1px] bg-white/10" />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-1.5 rounded-full text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteSnippet(deleteId)}
                  className="px-5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-[13px] font-bold shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all active:scale-[0.98]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <VersionHistory
        snippetId={versionSnippetId}
        isOpen={!!versionSnippetId}
        onClose={() => setVersionSnippetId(null)}
        onRestore={handleRestoreVersion}
        isDark={isDark}
      />
    </div>
  );
};

const getTagColor = (name: string) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Sidebar = ({ selected, setSelected, isDark, setIsDark, isSidebarOpen, setIsSidebarOpen, tags, selectedTag, setSelectedTag, languages, selectedLanguage, setSelectedLanguage }: any) => {
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

            <CollapsibleGroup title="Tags" Icon={Tag} defaultExpanded>
              <div className="mt-1 flex flex-col space-y-0.5">
                {tags.length > 0 ? (
                  tags.map((tag: any) => (
                    <button
                      key={tag.name}
                      onClick={() => {
                        setSelectedTag(tag.name);
                        setSelected("Tag");
                      }}
                      className={`group relative flex h-9 w-full items-center rounded-lg transition-all duration-200 px-3 ${selected === "Tag" && selectedTag === tag.name
                          ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                          : "text-gray-600 dark:text-[#9ca3af] hover:bg-gray-200/50 dark:hover:bg-neutral-800/40 font-medium hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: getTagColor(tag.name) }}
                        />
                        <span className="text-[14px] truncate flex-1 text-left">{tag.name}</span>
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${selected === "Tag" && selectedTag === tag.name
                            ? "bg-gray-900/10 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                            : "bg-gray-500/10 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                          }`}>
                          {tag.snippetCount}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-2 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No tags defined yet</div>
                )}
              </div>
            </CollapsibleGroup>

            <CollapsibleGroup title="Languages" Icon={CodeXml} defaultExpanded>
              <div className="mt-1 flex flex-col space-y-0.5">
                {languages.length > 0 ? (
                  languages.map((lang: any) => (
                    <button
                      key={lang.name}
                      onClick={() => {
                        setSelectedLanguage(lang.name);
                        setSelected("Language");
                      }}
                      className={`group relative flex h-9 w-full items-center rounded-lg transition-all duration-200 px-3 ${selected === "Language" && selectedLanguage === lang.name
                          ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                          : "text-gray-600 dark:text-[#9ca3af] hover:bg-gray-200/50 dark:hover:bg-neutral-800/40 font-medium hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: getTagColor(lang.name) }}
                        />
                        <span className="text-[14px] truncate flex-1 text-left capitalize">{lang.name}</span>
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${selected === "Language" && selectedLanguage === lang.name
                            ? "bg-gray-900/10 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                            : "bg-gray-500/10 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                          }`}>
                          {lang.snippetCount}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-2 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No languages defined yet</div>
                )}
              </div>
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

const ExampleContent = ({ isDark, setIsDark, selected, selectedTag, selectedLanguage, isSidebarOpen, snippets = [], isLoading, onFavorite, onDelete, onEdit, onHistory, onRestore, onEmptyTrash, searchQuery, setSearchQuery }: any) => {
  const safeSnippets = Array.isArray(snippets) ? snippets : [];

  // Backend now handles filtering, so we just use safeSnippets directly
  const filteredSnippets = safeSnippets;

  return (
    <div className="flex-1 bg-white dark:bg-black flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`h-[4.5rem] flex items-center gap-4 border-b border-gray-100 dark:border-[#27272a] shrink-0 transition-all ${isSidebarOpen ? 'px-8' : 'pl-20 pr-8'}`}>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-[22px] font-medium tracking-tight capitalize text-gray-900 dark:text-white">
            {selected === "Tag" ? (
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTagColor(selectedTag || "") }} />
                <span>{selectedTag}</span>
              </div>
            ) : selected === "Language" ? (
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getTagColor(selectedLanguage || "") }} />
                <span>{selectedLanguage}</span>
              </div>
            ) : selected}
          </h1>
        </div>
        <div className="flex items-center gap-5">
          {selected === "Trash" && snippets.some((s: any) => s.isDeleted) && (
            <button
              onClick={onEmptyTrash}
              className="text-[13px] font-semibold text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all transition-colors mr-2"
            >
              Empty Trash
            </button>
          )}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-[18px] w-[18px] text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-72 rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/20 dark:text-white transition-all placeholder:text-[#52525b]"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8 scrollbar-hide">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-[#09090b] animate-pulse border border-gray-200 dark:border-[#27272a]"></div>
            ))}
          </div>
        ) : filteredSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredSnippets.map((snippet: any) => (
              <SnippetCard
                key={snippet._id}
                snippet={snippet}
                isDark={isDark}
                onFavorite={onFavorite}
                onDelete={onDelete}
                onEdit={onEdit}
                onHistory={onHistory}
                onRestore={onRestore}
                view={selected}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-[#27272a] bg-gray-50/50 dark:bg-[#09090b]/50 p-8 shadow-sm flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-gray-200/50 dark:bg-[#27272a]/50 flex items-center justify-center mb-4">
              <FilePlus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-[#a1a1aa] text-[15px] font-medium">
              No snippets found in <strong className="font-semibold text-gray-700 dark:text-gray-300 capitalize">{selected}</strong>.
            </p>
            <p className="text-gray-400 dark:text-[#52525b] text-[13px] mt-1">Try creating one or using a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Example;