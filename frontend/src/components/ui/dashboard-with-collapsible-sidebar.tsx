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
  PanelLeftOpen,
  X,
  Eye
} from "lucide-react";

import { FullScreenCalendar } from "./fullscreen-calendar.jsx";
import NewSnippet from "../Snippet/NewSnippet.jsx";
import { ProfilePage } from "../../../Profile/Profile.jsx";
import { motion, AnimatePresence } from "framer-motion";
import SnippetCard from "../Snippet/SnippetCard.jsx";
import VersionHistory from "../Snippet/VersionHistory.jsx";
import api from "../../api/api";
import { toast } from "./Notification.jsx";
import { getTagColor } from "../../utils/tag-lang-colors";
import { formatFullDate } from "../../utils/dateUtils";
import { capitalize } from "../../utils/stringUtils";
import { ProjectWorkspaceView } from "./project-workspace-view.jsx";

export const Example = () => {
  console.log("Dashboard (Example) Rendering...");
  const [isDark, setIsDark] = useState(true);
  const [selected, setSelected] = useState("All Snippets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real project implementation: Store our created snippets globally!
  const [globalSnippets, setGlobalSnippets] = useState<any[]>([]);
  const [allSnippets, setAllSnippets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<any | null>(null);
  const [versionSnippetId, setVersionSnippetId] = useState<string | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [viewingSnippet, setViewingSnippet] = useState<any | null>(null);
  const [draftProjectName, setDraftProjectName] = useState<string>("");
  const [draftFileName, setDraftFileName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (view: string, subValue: string | null = null, shouldClear = true) => {
    const isSameView = selected === view &&
      (view === "Tag" ? selectedTag === subValue :
        view === "Language" ? selectedLanguage === subValue : true);

    if (isSameView && view !== "New Snippet" && view !== "Profile") {
      fetchSnippets(view, "", subValue || selectedTag, view === "Language" ? subValue : selectedLanguage);
      return;
    }
    setSelected(view);
    if (view === "Tag") setSelectedTag(subValue);
    else if (view === "Language") setSelectedLanguage(subValue);
    else if (view === "Project") setSelectedProject(subValue);
    else if (view !== "New Snippet") {
      setSelectedTag(null);
      setSelectedLanguage(null);
      setSelectedProject(null);
    }
    if (shouldClear) {
      setGlobalSnippets([]);
      setSearchQuery("");
      setIsLoading(true);
      setEditingSnippet(null);
    }
    if (view === "All Snippets") navigate("/dashboard");
    else if (view === "Favorites") navigate("/dashboard/favorites");
    else if (view === "Trash") navigate("/dashboard/trash");
    else if (view === "Projects") navigate("/dashboard/projects");
    else if (view === "Calendar") navigate("/dashboard/calendar");
    else if (view === "Profile") navigate("/dashboard/profile");
    else if (view === "New Snippet") navigate("/dashboard/new");
    else if (view === "Tag" && subValue) navigate(`/dashboard/tags/${subValue.toLowerCase()}`);
    else if (view === "Language" && subValue) navigate(`/dashboard/languages/${subValue.toLowerCase()}`);
  };

  const fetchAllSnippets = async () => {
    try {
      const res = await api.get('/api/snippets/');
      setAllSnippets(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch all snippets error:", err);
    }
  };

  // Sync state with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") {
      setSelected("All Snippets");
      setSelectedTag(null);
      setSelectedLanguage(null);
    } else if (path.startsWith("/dashboard/favorites")) {
      setSelected("Favorites");
    } else if (path.startsWith("/dashboard/trash")) {
      setSelected("Trash");
    } else if (path.startsWith("/dashboard/projects")) {
      setSelected("Projects");
    } else if (path.startsWith("/dashboard/calendar")) {
      setSelected("Calendar");
    } else if (path.startsWith("/dashboard/profile")) {
      setSelected("Profile");
    } else if (path.startsWith("/dashboard/new")) {
      setSelected("New Snippet");
      setEditingSnippet(null);
    } else if (path.startsWith("/dashboard/edit/")) {
      const id = path.split("/").pop();
      setSelected("New Snippet");
      // Restore editing state if it's missing or mismatched (e.g. after refresh)
      if (id && (!editingSnippet || editingSnippet._id !== id)) {
        const existing = globalSnippets.find(s => s._id === id);
        if (existing) {
          setEditingSnippet(existing);
        } else {
          // Direct fetch from API for resilience
          api.get(`/api/snippets/${id}`).then(res => {
            if (res.data && res.data.success) {
              setEditingSnippet(res.data.data.snippet);
            }
          }).catch(err => console.error("Snippet restoration failed:", err));
        }
      }
    } else if (path.startsWith("/dashboard/tags/")) {
      const tag = path.split("/").pop();
      setSelected("Tag");
      setSelectedTag(tag || null);
    } else if (path.startsWith("/dashboard/languages/")) {
      const lang = path.split("/").pop();
      setSelected("Language");
      setSelectedLanguage(lang || null);
    }
  }, [location.pathname]);

  const fetchSnippets = async (tab = selected, query = searchQuery, tag = selectedTag, lang = selectedLanguage) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const localFilter = () => {
      let snippets = [...allSnippets];
      if (tab === "Trash") snippets = snippets.filter((s: any) => s.isDeleted);
      else snippets = snippets.filter((s: any) => !s.isDeleted);

      if (tab === "Favorites") snippets = snippets.filter((s: any) => s.isFavorite);
      if (tab === "Tag" && tag) snippets = snippets.filter((s: any) => (s.tags || []).includes(tag));
      if (tab === "Language" && lang) snippets = snippets.filter((s: any) => (s.language || "").toLowerCase() === (lang || "").toLowerCase());
      if (tab === "Projects") snippets = snippets.filter((s: any) => (s.tags || []).some((t: string) => typeof t === "string" && t.startsWith("project:")));

      if (query.trim()) {
        const q = query.trim().toLowerCase();
        snippets = snippets.filter((s: any) =>
          (s.title || "").toLowerCase().includes(q) ||
          (s.description || "").toLowerCase().includes(q) ||
          (s.code || "").toLowerCase().includes(q) ||
          (s.language || "").toLowerCase().includes(q) ||
          (s.tags || []).some((t: string) => (t || "").toLowerCase().includes(q))
        );
      }
      return snippets;
    };

    if (allSnippets.length) {
      setGlobalSnippets(localFilter());
      setIsLoading(false);
      return;
    }

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
        // Direct endpoint category mapping
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

        const res = await api.get(endpoint);
        const fetchedData = res.data?.data;
        if (fetchedData) {
          let snippets = Array.isArray(fetchedData) ? fetchedData : [];
          // Local favorites filter if backend doesn't have dedicated favorites yet
          if (tab === "Favorites") {
            snippets = snippets.filter((s: any) => s.isFavorite && !s.isDeleted);
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
    fetchTags();
    fetchLanguages();
    fetchAllSnippets();
  }, []);

  useEffect(() => {
    if (!allSnippets.length) return;

    const tagMap: Record<string, number> = {};
    allSnippets.forEach((snippet: any) => {
      (snippet.tags || [])
        .filter((tag: string) => typeof tag === "string")
        .forEach((tag: string) => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
    });
    setTags(Object.entries(tagMap).map(([name, snippetCount]) => ({ name, snippetCount })));

    const langMap: Record<string, number> = {};
    allSnippets.forEach((snippet: any) => {
      if (!snippet.language) return;
      langMap[snippet.language] = (langMap[snippet.language] || 0) + 1;
    });
    setLanguages(Object.entries(langMap).map(([name, snippetCount]) => ({ name, snippetCount })));
  }, [allSnippets]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (["All Snippets", "Favorites", "Trash", "Tag", "Language", "Projects"].includes(selected)) {
        fetchSnippets(selected, searchQuery, selectedTag, selectedLanguage);
      }
    }, 150); // Balanced debounce for both navigation and search

    return () => clearTimeout(handler);
  }, [selected, selectedTag, selectedLanguage, searchQuery]);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const response = await api.put(`/api/snippets/${id}`, { isFavorite });
      if (response.data) {
        setGlobalSnippets(prev =>
          selected === "Favorites" && !isFavorite
            ? prev.filter(s => s._id !== id)
            : prev.map(s => s._id === id ? { ...s, isFavorite } : s)
        );
        setAllSnippets(prev => prev.map(s => s._id === id ? { ...s, isFavorite } : s));
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
        setAllSnippets(prev => prev.filter(s => s._id !== id));
        toast(isPermanent ? "Snippet permanently deleted" : "Snippet moved to trash", 'success');
        setDeleteId(null);
      }
    } catch (err: any) {
      console.error("Delete error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to delete snippet";
      toast(errMsg, "error");
      setDeleteId(null);
    }
  };

  const handleRestoreSnippet = async (id: string) => {
    try {
      const response = await api.patch(`/api/trash/${id}/restore`);
      if (response.data) {
        setGlobalSnippets(prev => prev.filter(s => s._id !== id));
        fetchAllSnippets();
        toast("Snippet restored successfully", 'success');
      }
    } catch (err: any) {
      console.error("Restore error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to restore snippet";
      toast(errMsg, "error");
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const response = await api.delete('/api/trash/');
      if (response.data) {
        setGlobalSnippets([]);
        fetchAllSnippets();
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
        changeNote: `Restored to version from ${formatFullDate(version.createdAt)}`
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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlUsername = params.get('username');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      if (urlUsername) localStorage.setItem('username', urlUsername);
      // Clean URL, this will trigger the 'location' sync effect but not an immediate fetch
      navigate('/dashboard', { replace: true });
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Recover editing state from URL on refresh
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/edit/")) {
      const id = path.split("/").pop();
      if (id && (!editingSnippet || editingSnippet._id !== id)) {
        const found = globalSnippets.find(s => s._id === id);
        if (found) {
          console.log("Recovered editing snippet:", found.title);
          setEditingSnippet(found);
        }
      }
    } else if (selected !== "New Snippet") {
      // Clear editing state if navigating away from edit view
      if (editingSnippet) setEditingSnippet(null);
    }
  }, [location.pathname, globalSnippets, selected]);

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
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          snippets={allSnippets}
          onViewSnippet={(snippet: any) => {
            setViewingSnippet(snippet);
            setSelected("ProjectFile");
          }}
          onCreateSnippetForProject={(projectName: string, fileName?: string) => {
            setDraftProjectName(projectName);
            setDraftFileName(fileName || "");
            handleNavigate("New Snippet");
          }}
          handleNavigate={handleNavigate}
        />
        {/* Toggle Button when Sidebar is Hidden */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-5 left-5 z-50 h-11 w-11 inline-flex items-center justify-center rounded-xl border border-gray-200/90 dark:border-[#2b2b31] bg-white/95 dark:bg-[#101015]/95 text-gray-500 hover:text-gray-900 dark:text-[#a1a1aa] dark:hover:text-white shadow-[0_8px_26px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-[1px] active:scale-[0.98]"
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
              navigate(`/dashboard/edit/${snippet._id}`);
            }}
            onHistory={(id: string) => {
              setVersionSnippetId(id);
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statsSource={allSnippets}
          />
        ) : selected === "Projects" ? (
          <ProjectWorkspaceView
            snippets={allSnippets}
            onCreateSnippetForProject={(projectName: string, fileName?: string) => {
              setDraftProjectName(projectName);
              setDraftFileName(fileName || "");
              handleNavigate("New Snippet");
            }}
            onFavorite={handleToggleFavorite}
            onDelete={handleDeleteSnippet}
            onEdit={(snippet: any) => {
              setEditingSnippet(snippet);
              navigate(`/dashboard/edit/${snippet._id}`);
            }}
            onHistory={(id: string) => setVersionSnippetId(id)}
          />
        ) : selected === "ProjectFile" && viewingSnippet ? (
          <SnippetDetailsView
            snippet={viewingSnippet}
            onBack={() => {
              setViewingSnippet(null);
              handleNavigate("All Snippets");
            }}
          />
        ) : (
          <div className="flex-1 overflow-hidden h-screen bg-white dark:bg-[#09090b]">
            <NewSnippet
              onCancel={() => {
                setEditingSnippet(null);
                handleNavigate("All Snippets");
              }}
              existingSnippets={globalSnippets}
              projects={Array.from(new Set(
                allSnippets
                  .flatMap((s: any) => s.tags || [])
                  .filter((tag: string) => typeof tag === "string" && tag.startsWith("project:"))
                  .map((tag: string) => tag.replace("project:", ""))
                  .filter(Boolean)
              ))}
              initialProjectName={draftProjectName}
              initialTitle={draftFileName}
              isEditing={!!editingSnippet}
              snippet={editingSnippet}
              onSave={(savedSnippet: any) => {
                if (editingSnippet) {
                  setGlobalSnippets(prev => prev.map(s => s._id === savedSnippet._id ? savedSnippet : s));
                } else {
                  setGlobalSnippets(prev => [savedSnippet, ...prev]);
                }
                setAllSnippets(prev => {
                  const exists = prev.some(s => s._id === savedSnippet._id);
                  return exists ? prev.map(s => s._id === savedSnippet._id ? savedSnippet : s) : [savedSnippet, ...prev];
                });
                setDraftProjectName("");
                setDraftFileName("");
                setEditingSnippet(null);
                // Return to previous view but DON'T clear the snapshots we just updated
                handleNavigate("All Snippets", null, false);
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

const Sidebar = ({ selected, setSelected, isDark, setIsDark, isSidebarOpen, setIsSidebarOpen, tags, selectedTag, setSelectedTag, languages, selectedLanguage, setSelectedLanguage, selectedProject, setSelectedProject, snippets = [], onViewSnippet, onCreateSnippetForProject, handleNavigate }: any) => {
  const username = localStorage.getItem('username') || "User";
  const userInitial = username.charAt(0).toUpperCase();

  const [projects, setProjects] = useState<string[]>([]);
  const [projectFiles, setProjectFiles] = useState<Record<string, { id: number; name: string }[]>>({});
  const [projectFolders, setProjectFolders] = useState<Record<string, { id: number; name: string }[]>>({});
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newItemContext, setNewItemContext] = useState<{ projectName: string; type: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("dashboard.projects");
    if (!stored) return;
    try {
      setProjects(JSON.parse(stored));
    } catch {
      setProjects([]);
    }

    const storedFiles = localStorage.getItem("dashboard.projectFiles");
    if (storedFiles) {
      try {
        setProjectFiles(JSON.parse(storedFiles));
      } catch {
        setProjectFiles({});
      }
    }

    const storedFolders = localStorage.getItem("dashboard.projectFolders");
    if (storedFolders) {
      try {
        setProjectFolders(JSON.parse(storedFolders));
      } catch {
        setProjectFolders({});
      }
    }
  }, []);

  const handleCreateProject = () => {
    const normalized = newProjectName.trim();
    if (normalized && !projects.includes(normalized)) {
      const next = [...projects, normalized];
      setProjects(next);
      localStorage.setItem("dashboard.projects", JSON.stringify(next));
    }
    setNewProjectName("");
    setIsCreatingProject(false);
  };

  const snippetProjects = Array.from(new Set(
    snippets
      .flatMap((s: any) => s.tags || [])
      .filter((tag: string) => typeof tag === "string" && tag.startsWith("project:"))
      .map((tag: string) => tag.replace("project:", ""))
      .filter(Boolean)
  ));
  const allProjects = Array.from(new Set([...projects, ...snippetProjects]));

  const addProjectItem = (projectName: string, type: "file" | "folder", name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (type === "folder") {
      const next = {
        ...projectFolders,
        [projectName]: [...(projectFolders[projectName] || []), { id: Date.now(), name: trimmed }]
      };
      setProjectFolders(next);
      localStorage.setItem("dashboard.projectFolders", JSON.stringify(next));
      return;
    }

    const next = {
      ...projectFiles,
      [projectName]: [...(projectFiles[projectName] || []), { id: Date.now(), name: trimmed }]
    };
    setProjectFiles(next);
    localStorage.setItem("dashboard.projectFiles", JSON.stringify(next));
  };

  return (
    <nav className={`flex shrink-0 flex-col bg-[#f8f9fa] dark:bg-[#0f1113] h-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-40 ${isSidebarOpen ? 'w-72 border-r border-gray-200 dark:border-[#27272a] opacity-100' : 'w-0 border-r-0 opacity-0 pointer-events-none'}`}>
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
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-[#2b2b31] text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-[#1b1b20] transition-all"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <button
            onClick={() => handleNavigate("New Snippet")}
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#111114] text-zinc-900 dark:text-zinc-100 text-[14px] font-semibold py-2.5 rounded-2xl border border-gray-200 dark:border-[#2a2a30] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_8px_22px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_10px_24px_rgba(0,0,0,0.28)] transition-all hover:border-gray-300 dark:hover:border-[#3a3a42] hover:bg-gray-50 dark:hover:bg-[#15151a] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            New Snippet
          </button>
        </div>

        <div className="px-5 pb-2">
          <h2 className="text-[12px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase px-2 mb-1">Navigation</h2>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-1.5 scrollbar-hide">
          <Option
            Icon={FileText}
            title="All Snippets"
            isSelected={selected === "All Snippets"}
            onClick={() => handleNavigate("All Snippets")}
          />
          <Option
            Icon={Heart}
            title="Favorites"
            isSelected={selected === "Favorites"}
            onClick={() => handleNavigate("Favorites")}
          />
          <Option
            Icon={Calendar}
            title="Calendar"
            isSelected={selected === "Calendar"}
            onClick={() => handleNavigate("Calendar")}
          />
          <Option
            Icon={Trash2}
            title="Trash"
            isSelected={selected === "Trash"}
            onClick={() => handleNavigate("Trash")}
          />
          <Option
            Icon={Folder}
            title="Projects"
            isSelected={selected === "Projects"}
            onClick={() => handleNavigate("Projects")}
          />

          <div className="my-6 border-b border-gray-200 dark:border-neutral-800/40 w-[85%] mx-auto" />

          <div className="space-y-4">
            <CollapsibleGroup title="Projects" Icon={Folder} defaultExpanded>
              <div className="mt-1 flex flex-col space-y-1">
                {allProjects.map((proj: string) => (
                  <ProjectFolder
                    key={proj}
                    title={proj}
                    defaultExpanded
                    onAddFile={() => {
                      setNewItemContext({ projectName: proj, type: "file" });
                      setNewItemName("");
                    }}
                    onAddFolder={() => {
                      setNewItemContext({ projectName: proj, type: "folder" });
                      setNewItemName("");
                    }}
                    onCreateSnippet={() => onCreateSnippetForProject(proj)}
                  >
                    {(projectFolders[proj] || []).map((folder) => (
                      <div key={folder.id} className="flex items-center gap-2 pl-4 h-8 text-[13px] text-gray-500 dark:text-gray-400">
                        <Folder className="h-3.5 w-3.5 text-[#a78bfa]" />
                        <span className="truncate">{folder.name}</span>
                      </div>
                    ))}

                    {(projectFiles[proj] || []).map((file) => (
                      <ProjectFile
                        key={file.id}
                        title={file.name}
                        isSelected={false}
                        onCreateSnippet={() => onCreateSnippetForProject(proj, file.name)}
                        onClick={() => {
                          const linked = snippets.find((snippet: any) =>
                            (snippet.tags || []).includes(`project:${proj}`) && snippet.title === file.name
                          );
                          if (linked) {
                            setSelectedProject(proj);
                            onViewSnippet(linked);
                          } else {
                            onCreateSnippetForProject(proj, file.name);
                          }
                        }}
                      />
                    ))}

                    {snippets
                      .filter((snippet: any) => (snippet.tags || []).includes(`project:${proj}`))
                      .filter((snippet: any) => !(projectFiles[proj] || []).some((file) => file.name === snippet.title))
                      .map((snippet: any) => (
                        <ProjectFile
                          key={snippet._id}
                          title={snippet.title}
                          isSelected={selected === "ProjectFile" && selectedProject === proj}
                          onCreateSnippet={() => onCreateSnippetForProject(proj, snippet.title)}
                          onClick={() => {
                            setSelectedProject(proj);
                            onViewSnippet(snippet);
                          }}
                        />
                      ))}

                    {newItemContext?.projectName === proj && (
                      <div className="flex items-center gap-2 px-2 py-1.5 mx-1 mt-1 border border-[#a78bfa] rounded-md bg-white dark:bg-[#09090b] shadow-sm">
                        {newItemContext.type === "folder"
                          ? <Folder className="h-3.5 w-3.5 text-[#a78bfa] shrink-0" />
                          : <FileText className="h-3.5 w-3.5 text-[#a78bfa] shrink-0" />}
                        <input
                          autoFocus
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addProjectItem(proj, newItemContext.type, newItemName);
                              setNewItemContext(null);
                              setNewItemName("");
                            } else if (e.key === 'Escape') {
                              setNewItemContext(null);
                              setNewItemName("");
                            }
                          }}
                          onBlur={() => {
                            if (newItemName.trim()) {
                              addProjectItem(proj, newItemContext.type, newItemName);
                            }
                            setNewItemContext(null);
                            setNewItemName("");
                          }}
                          className="bg-transparent text-[13px] outline-none w-full text-gray-900 dark:text-white"
                          placeholder={`New ${newItemContext.type}...`}
                        />
                      </div>
                    )}

                    {snippets.filter((snippet: any) => (snippet.tags || []).includes(`project:${proj}`)).length === 0 && (projectFiles[proj] || []).length === 0 && (projectFolders[proj] || []).length === 0 && (
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
                {allProjects.length === 0 && !isCreatingProject && (
                  <div className="py-1 px-3 text-[13px] text-gray-400 dark:text-gray-500 italic">No projects yet</div>
                )}
              </div>
            </CollapsibleGroup>

            <CollapsibleGroup title="Tags" Icon={Tag} defaultExpanded>
              <div className="mt-1 flex flex-col space-y-0.5">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleNavigate("Tag", tag.name)}
                      className={`group relative flex h-9 w-full items-center rounded-lg transition-all duration-300 px-3 border ${selected === "Tag" && selectedTag === tag.name
                        ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-bold shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
                        : "text-gray-500 dark:text-[#71717a] hover:bg-gray-200/60 dark:hover:bg-neutral-800/60 hover:text-gray-900 dark:hover:text-gray-200 font-medium border-transparent hover:border-gray-200/70 dark:hover:border-neutral-700/70"
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: getTagColor(tag.name) }}
                        />
                        <span className="text-[14px] truncate flex-1 text-left">{tag.name.startsWith("project:") ? tag.name.replace("project:", "") : tag.name}</span>
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
                  languages.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => handleNavigate("Language", lang.name)}
                      className={`group relative flex h-9 w-full items-center rounded-lg transition-all duration-300 px-3 border ${selected === "Language" && selectedLanguage === lang.name
                        ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-bold shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
                        : "text-gray-500 dark:text-[#71717a] hover:bg-gray-200/60 dark:hover:bg-neutral-800/60 hover:text-gray-900 dark:hover:text-gray-200 font-medium border-transparent hover:border-gray-200/70 dark:hover:border-neutral-700/70"
                        }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                          style={{ backgroundColor: getTagColor(lang.name) }}
                        />
                        <span className="text-[14px] truncate flex-1 text-left">{capitalize(lang.name)}</span>
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
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors text-gray-600 dark:text-gray-400"
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <div
              onClick={() => handleNavigate("Profile")}
              className="flex flex-1 items-center justify-between p-2 border border-gray-200 dark:border-neutral-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold text-[14px] shadow-sm">
                  {userInitial}
                </div>
                <div className="flex flex-col justify-center gap-0.5">
                  <span className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                    {username}
                  </span>
                  <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400 leading-none">
                    My Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Option = ({ Icon, title, isSelected, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex h-11 w-full items-center rounded-xl transition-all duration-200 px-3.5 border ${isSelected
        ? "bg-gray-200/75 dark:bg-[#1e1e20] border-gray-300/60 dark:border-[#323238] text-gray-900 dark:text-white font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
        : "border-transparent text-gray-600 dark:text-[#9ca3af] hover:bg-gray-200/60 dark:hover:bg-neutral-800/60 hover:border-gray-200/80 dark:hover:border-neutral-700/70 font-medium hover:text-gray-900 dark:hover:text-gray-200"
        }`}
    >
      <div className="flex items-center gap-3.5">
        <Icon className={`h-5 w-5 ${isSelected ? "text-gray-900 dark:text-white stroke-[2.5]" : "text-gray-500 dark:text-[#8b919d] stroke-2"}`} />
        <span className="text-[14px] font-medium tracking-tight mt-[1px]">{title}</span>
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
          <span className="text-[14px] font-medium tracking-tight mt-[1px]">{title}</span>
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

const ProjectFolder = ({ title, children, defaultExpanded = false, onAddFile, onAddFolder, onCreateSnippet }: any) => {
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
          <button onClick={(e) => { e.stopPropagation(); onAddFile?.(); }} className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" title="New File">
            <FilePlus className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onAddFolder?.(); }} className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" title="New Folder">
            <FolderPlus className="h-3.5 w-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onCreateSnippet?.(); }} className="p-1 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" title="Create Snippet">
            <Plus className="h-3.5 w-3.5" />
          </button>
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

const ProjectFile = ({ title, Icon = FileText, isSelected, onClick, onCreateSnippet }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col group relative">
      <button
        onClick={onClick}
        className={`relative flex h-8 w-full items-center justify-between rounded-md px-2 transition-colors ${isSelected
          ? "bg-gray-200/70 dark:bg-[#1e1e20] text-gray-900 dark:text-white font-semibold shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/40 dark:hover:bg-neutral-800/40 font-medium hover:text-gray-900 dark:hover:text-gray-200"
          }`}
      >
        <div className="flex items-center gap-2 pl-4">
          <Icon className={`h-4 w-4 ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-400"}`} />
          <span className="text-[14px] pt-[1px]">{title}</span>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
        className="absolute right-2 top-1.5 hidden group-hover:flex p-1 rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/60 dark:hover:bg-neutral-700/70 transition-colors"
        title="File actions"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
      {menuOpen && (
        <div className="absolute right-2 top-8 z-20 w-36 rounded-lg border border-gray-200 dark:border-[#2b2b30] bg-white dark:bg-[#0f0f13] shadow-lg overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onCreateSnippet?.();
            }}
            className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#18181f] flex items-center gap-2"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Snippet
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
              onClick?.();
            }}
            className="w-full px-3 py-2 text-left text-[12px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#18181f] flex items-center gap-2"
          >
            <Eye className="h-3.5 w-3.5" />
            See
          </button>
        </div>
      )}
    </div>
  );
};

const ExampleContent = ({ isDark, setIsDark, selected, selectedTag, selectedLanguage, isSidebarOpen, snippets = [], isLoading, onFavorite, onDelete, onEdit, onHistory, onRestore, onEmptyTrash, searchQuery, setSearchQuery, statsSource = [] }: any) => {
  const safeSnippets = Array.isArray(snippets) ? snippets : [];

  // Backend now handles filtering, so we just use safeSnippets directly
  const filteredSnippets = safeSnippets;
  const totalSnippets = filteredSnippets.length;
  const favoriteCount = filteredSnippets.filter((s: any) => s.isFavorite && !s.isDeleted).length;
  const tagCount = new Set(
    filteredSnippets.flatMap((s: any) => (s.tags || []).filter((tag: string) => !tag.startsWith("project:")))
  ).size;

  return (
    <div className="flex-1 bg-white dark:bg-black flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={`h-[4.5rem] flex items-center gap-4 border-b border-gray-100 dark:border-[#27272a] shrink-0 transition-all ${isSidebarOpen ? 'px-8' : 'pl-20 pr-8'}`}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
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
          <div className="hidden md:flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-blue-200/40 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10 backdrop-blur-sm shadow-sm">
              {totalSnippets} snippets
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-rose-200/40 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-500/10 backdrop-blur-sm shadow-sm">
              {favoriteCount} favorites
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-emerald-200/40 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-500/10 backdrop-blur-sm shadow-sm">
              {tagCount} tags
            </span>
          </div>
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
      <div className="flex-1 overflow-auto p-8 scrollbar-hide relative min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-gray-200/50 dark:bg-[#27272a]/50 flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-gray-300/30 dark:border-gray-600/30 border-t-[#a78bfa] rounded-full animate-spin" />
            </div>
            <p className="text-gray-500 dark:text-[#a1a1aa] text-[15px] font-medium animate-pulse">
              Loading snippets...
            </p>
          </div>
        ) : filteredSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 fill-mode-both">
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

const SnippetDetailsView = ({ snippet, onBack }: any) => {
  const project = (snippet.tags || []).find((tag: string) => tag.startsWith("project:"))?.replace("project:", "");
  const normalTags = (snippet.tags || []).filter((tag: string) => !tag.startsWith("project:"));

  return (
    <div className="flex-1 overflow-auto p-6 md:p-8 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#111113] shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#27272a]">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-[#8b919d]">Snippet Details</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-1">{snippet.title}</h2>
          </div>
          <button onClick={onBack} className="h-9 px-3 rounded-lg border border-gray-200 dark:border-[#27272a] text-sm hover:bg-gray-50 dark:hover:bg-[#1a1a1f] inline-flex items-center gap-2">
            <X className="h-4 w-4" /> Close
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-gray-200 dark:border-[#27272a] p-3"><span className="text-gray-500">Language</span><p className="font-medium mt-1">{snippet.language}</p></div>
            <div className="rounded-xl border border-gray-200 dark:border-[#27272a] p-3"><span className="text-gray-500">Framework</span><p className="font-medium mt-1">{snippet.framework || "none"}</p></div>
            <div className="rounded-xl border border-gray-200 dark:border-[#27272a] p-3"><span className="text-gray-500">Project</span><p className="font-medium mt-1">{project || "None"}</p></div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{snippet.description || "No description provided."}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {normalTags.length > 0 ? normalTags.map((tag: string) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#17171a]">#{tag}</span>
              )) : <span className="text-sm text-gray-500">No tags</span>}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Code</p>
            <pre className="rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b] p-4 overflow-auto text-xs leading-6 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{snippet.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;