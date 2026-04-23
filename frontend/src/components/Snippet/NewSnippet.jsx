import React, { useState, useRef } from 'react';
import { Save, X, Code, Tag, AlignLeft, ChevronDown, Layers, Package, Globe, Lock, Star, Folder, Calendar, Paperclip, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, addDays } from 'date-fns';
import Editor from '@monaco-editor/react';
// Removed legacy error components
import api from '../../api/api';
import { toast } from '../ui/Notification.jsx';

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "dart", label: "Dart" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "react", label: "React / JSX" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "json", label: "JSON" },
  { value: "mongodb", label: "MongoDB" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "markdown", label: "Markdown" },
];

const FRAMEWORKS = [
  { value: "none", label: "None / Vanilla" },
  { value: "react", label: "React / RN" },
  { value: "nextjs", label: "Next.js" },
  { value: "express", label: "Express" },
  { value: "django", label: "Django" },
  { value: "spring", label: "Spring Boot" },
  { value: "vue", label: "Vue / Nuxt" }
];

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public (Shared with team)" },
  { value: "private", label: "Private (Only me)" },
  { value: "unlisted", label: "Unlisted (Anyone with link)" }
];

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      days.push(
        <div
          key={day.toString()}
          onClick={() => {
            onChange(format(cloneDay, 'yyyy-MM-dd'));
            setIsOpen(false);
          }}
          className={`flex-1 flex items-center justify-center text-[13px] h-[32px] rounded-full cursor-pointer transition-colors ${!isSameMonth(day, monthStart)
            ? "text-gray-300 dark:text-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800"
            : selectedDate && isSameDay(day, new Date(selectedDate))
              ? "bg-violet-600 text-white font-medium shadow-sm hover:bg-violet-700"
              : isToday(day)
                ? "bg-violet-50 dark:bg-indigo-900/40 text-violet-600 font-medium hover:bg-violet-100 dark:hover:bg-indigo-900/60"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
            }`}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }
  }

  const rows = [];
  let cells = [];
  days.forEach((dayElement, index) => {
    if (index % 7 !== 0) {
      cells.push(dayElement);
    } else {
      if (index !== 0) rows.push(<div className="flex w-full justify-between gap-1 mb-1" key={index}>{cells}</div>);
      cells = [dayElement];
    }
  });
  rows.push(<div className="flex w-full justify-between gap-1" key="last">{cells}</div>);

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] rounded-lg border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] px-3 text-[14px] outline-none hover:border-indigo-500 dark:text-white transition-all flex items-center justify-between cursor-pointer"
      >
        <span className={selectedDate ? "text-gray-900 dark:text-gray-100 font-medium" : "text-gray-400"}>
          {selectedDate ? format(new Date(selectedDate), "MMM dd, yyyy") : "Select a date..."}
        </span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-20 top-[48px] left-0 w-[280px] bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 select-none">

            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentMonth(subMonths(currentMonth, 1)); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100">
                {format(currentMonth, dateFormat)}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrentMonth(addMonths(currentMonth, 1)); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex w-full justify-between gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="flex-1 flex justify-center text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            <div className="flex flex-col mb-1">
              {rows}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#27272a] flex justify-between">
              <button type="button" onClick={() => { onChange(''); setIsOpen(false); }} className="text-[12px] font-medium text-gray-400 hover:text-gray-100 dark:hover:text-gray-200 transition-colors">Clear</button>
              <button type="button" onClick={() => { onChange(format(new Date(), 'yyyy-MM-dd')); setIsOpen(false); }} className="text-[12px] font-medium text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">Today</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function NewSnippet({ onSave, onCancel, existingSnippets = [], projects = [], initialProjectName = '', initialTitle = '', isEditing = false, snippet = null }) {
  //This part stores all the "live" data for our form

  // These three variables keep track of whether our dropdown menus are open or closed
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);
  const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const fileInputRef = useRef(null);

  // This stores any error message we want to show the user (like "Title is required")
  const [errorText, setErrorText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // This is one big object that holds all the information the user types into the form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'javascript',
    framework: 'none',
    visibility: 'private',
    dependencies: '',
    projectName: '',
    code: '// Start coding here...',
    tags: '',
    isFavorite: false,
    changeNote: '',
    showInCalendar: false,
    calendarDate: '',
    attachments: []
  });

  // Pre-fill form if editing, or reset if not
  React.useEffect(() => {
    if (isEditing && snippet) {
      setFormData({
        title: snippet.title || '',
        description: snippet.description || '',
        language: snippet.language || 'javascript',
        framework: snippet.framework || 'none',
        visibility: snippet.visibility || 'private',
        dependencies: snippet.dependencies || '',
        projectName: Array.isArray(snippet.tags)
          ? (snippet.tags.find((tag) => typeof tag === "string" && tag.startsWith("project:")) || '').replace('project:', '')
          : '',
        code: snippet.code || '',
        tags: Array.isArray(snippet.tags) ? snippet.tags.join(', ') : (snippet.tags || ''),
        isFavorite: !!snippet.isFavorite,
        changeNote: '',
        showInCalendar: !!snippet.showInCalendar,
        calendarDate: snippet.calendarDate || '',
        attachments: snippet.attachments || []
      });
    } else if (!isEditing) {
      // Reset form to default empty state
      setFormData({
        title: '',
        description: '',
        language: 'javascript',
        framework: 'none',
        visibility: 'private',
        dependencies: '',
        projectName: '',
        code: '// Start coding here...',
        tags: '',
        isFavorite: false,
        changeNote: '',
        showInCalendar: false,
        calendarDate: '',
        attachments: []
      });
    }
  }, [isEditing, snippet]);

  React.useEffect(() => {
    if (isEditing) return;
    setFormData(prev => ({
      ...prev,
      projectName: initialProjectName || prev.projectName,
      title: initialTitle || prev.title,
    }));
  }, [initialProjectName, initialTitle, isEditing]);

  // This function updates our formData whenever a user types in a normal text box
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // This is a special function just for the Monaco Editor part
  // It updates the "code" section of our form data
  const handleEditorChange = (value) => {
    setFormData(prev => ({ ...prev, code: value || '' }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const currentAttachments = formData.attachments || [];

  const removeAttachment = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove)
    }));
  };

  // This function runs when the user clicks the "Save Snippet" button
  const handleSubmit = async (e) => {
    e?.preventDefault?.(); // This stops the page from refreshing if called as a form submit

    if (isSaving) return;
    setErrorText("");

    try {
      // Step 1: Check if the user forgot to give the snippet a name
      const title = formData.title?.trim();
      if (!title) {
        toast("Snippet title is required!", "error");
        return;
      }

      // Step 2: Check for existing snippets (defensive coding)
      const snippets = Array.isArray(existingSnippets) ? existingSnippets : [];

      // Duplicate Title Check
      const isDuplicateTitle = snippets.some(
        (s) => s.title?.toLowerCase() === title.toLowerCase() && s._id !== snippet?._id
      );

      if (isDuplicateTitle) {
        toast(`A snippet with the title "${title}" already exists.`, "error");
        return;
      }

      // Duplicate Code Check
      const code = formData.code?.trim();
      // Only warn if they've actually typed something beyond the default comment
      if (code && code !== '// Start coding here...') {
        const isDuplicateCode = snippets.some(
          (s) => s.code?.trim() === code && s._id !== snippet?._id
        );

        if (isDuplicateCode) {
          toast("This exact code is already saved in another snippet.", "error");
          return;
        }
      }

      // Step 4: If everything is okay, we save the snippet
      setIsSaving(true);

      const payload = {
        ...formData,
        title: title,
        code: formData.code || '',
        tags: (() => {
          const userTags = typeof formData.tags === 'string'
            ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : [];
          const cleanedTags = userTags.filter(tag => !tag.toLowerCase().startsWith("project:"));
          return formData.projectName?.trim()
            ? [...cleanedTags, `project:${formData.projectName.trim()}`]
            : cleanedTags;
        })(),
      };

      let response;
      if (isEditing && snippet) {
        // Change note is MANDATORY for edits
        if (!formData.changeNote?.trim()) {
          toast("Please provide a brief note about what you changed.", "error");
          setIsSaving(false);
          return;
        }
        response = await api.put(`/api/snippets/${snippet._id}`, payload);
      } else {
        response = await api.post('/api/snippets/', payload);
      }

      if (response.data && response.data.success) {
        toast(isEditing ? 'Snippet updated successfully!' : 'Snippet saved successfully!', 'success');
        if (onSave) {
          // Pass the snippet from response.data.data.snippet
          onSave(response.data.data.snippet);
        }
      } else {
        throw new Error("Failed to save. Backend responded with success: false");
      }
    } catch (err) {
      console.error("Save error:", err);
      const errMsg = err.response?.data?.message || err.message || "Failed to save snippet.";
      toast(errMsg, 'error');
      setErrorText(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-8 h-[4.5rem] border-b border-gray-100 dark:border-[#27272a] shrink-0">
        <div />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 text-[14px] font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-transparent border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 rounded-xl transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 h-10 px-6 rounded-xl bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 active:bg-gray-800 dark:active:bg-gray-200 text-[14px] font-bold text-white dark:text-black shadow-[0_4px_12px_-4px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.97] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-gray-500/30 border-t-gray-500 rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform" />
            )}
            <span>{isSaving ? 'Saving...' : (isEditing ? 'Save as New Version' : 'Save Snippet')}</span>
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-auto p-8">
        <form onSubmit={handleSubmit} noValidate className="max-w-4xl mx-auto space-y-6 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Snippet Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., JWT Authentication Middleware"
                className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-transparent px-4 text-[15px] text-gray-900 dark:text-white outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:focus:bg-transparent dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] dark:autofill:[-webkit-text-fill-color:white] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600 shadow-sm"
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2 relative">
              <label htmlFor="language" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Code className={`absolute left-3.5 top-[13px] h-[18px] w-[18px] transition-colors ${isLanguageDropdownOpen ? 'text-[#a78bfa]' : 'text-[#71717a]'} pointer-events-none z-10`} />
                <button
                  type="button"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{LANGUAGES.find(l => l.value === formData.language)?.label || 'Select Language'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLanguageDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLanguageDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, language: lang.value }));
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.language === lang.value ? 'bg-[#a78bfa]/10 text-[#a78bfa] font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Framework Selection */}
            <div className="space-y-2 relative">
              <label htmlFor="framework" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Framework <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Layers className={`absolute left-3.5 top-[13px] h-[18px] w-[18px] transition-colors ${isFrameworkDropdownOpen ? 'text-[#a78bfa]' : 'text-[#71717a]'} pointer-events-none z-10`} />
                <button
                  type="button"
                  onClick={() => setIsFrameworkDropdownOpen(!isFrameworkDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{FRAMEWORKS.find(f => f.value === formData.framework)?.label || 'None / Vanilla'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isFrameworkDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFrameworkDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFrameworkDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {FRAMEWORKS.map(fw => (
                        <button
                          key={fw.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, framework: fw.value }));
                            setIsFrameworkDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.framework === fw.value ? 'bg-[#a78bfa]/10 text-[#a78bfa] font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                        >
                          {fw.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label htmlFor="tags" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Tags <span className="text-gray-400 dark:text-gray-500 font-normal">(Comma separated)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Tag className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. react, hooks, ui..."
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-transparent pl-10 pr-4 text-[15px] text-gray-900 dark:text-white outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:focus:bg-transparent dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] dark:autofill:[-webkit-text-fill-color:white] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-2 relative">
              <label htmlFor="visibility" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Visibility
              </label>
              <div className="relative shadow-sm rounded-xl">
                {formData.visibility === 'public' ?
                  <Globe className={`absolute left-3.5 top-[13px] h-[18px] w-[18px] transition-colors ${isVisibilityDropdownOpen ? 'text-[#a78bfa]' : 'text-[#71717a]'} pointer-events-none z-10`} /> :
                  <Lock className={`absolute left-3.5 top-[13px] h-[18px] w-[18px] transition-colors ${isVisibilityDropdownOpen ? 'text-[#a78bfa]' : 'text-[#71717a]'} pointer-events-none z-10`} />
                }
                <button
                  type="button"
                  onClick={() => setIsVisibilityDropdownOpen(!isVisibilityDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{VISIBILITY_OPTIONS.find(v => v.value === formData.visibility)?.label || 'Public (Shared with team)'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isVisibilityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isVisibilityDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsVisibilityDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {VISIBILITY_OPTIONS.map(vis => (
                        <button
                          key={vis.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, visibility: vis.value }));
                            setIsVisibilityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.visibility === vis.value ? 'bg-[#a78bfa]/10 text-[#a78bfa] font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                        >
                          {vis.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>



            {/* Dependencies */}
            <div className="space-y-2">
              <label htmlFor="dependencies" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Dependencies <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Package className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="text"
                  id="dependencies"
                  name="dependencies"
                  value={formData.dependencies}
                  onChange={handleChange}
                  placeholder="e.g. npm install lucide-react"
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-transparent pl-10 pr-4 text-[15px] text-gray-900 dark:text-white outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:focus:bg-transparent dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] dark:autofill:[-webkit-text-fill-color:white] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Project Selection */}
            <div className="space-y-2 relative">
              <label htmlFor="projectName" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Project <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Folder className={`absolute left-3.5 top-[13px] h-[18px] w-[18px] transition-colors ${isProjectDropdownOpen ? 'text-[#a78bfa]' : 'text-[#71717a]'} pointer-events-none z-10`} />
                <button
                  type="button"
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] pl-10 pr-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{formData.projectName || 'No Project'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProjectDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProjectDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-[#27272a] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, projectName: '' }));
                          setIsProjectDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                      >
                        No Project
                      </button>
                      {projects.map((projectName) => (
                        <button
                          key={projectName}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, projectName }));
                            setIsProjectDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.projectName === projectName ? 'bg-[#a78bfa]/10 text-[#a78bfa] font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
                        >
                          {projectName}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mark as Favorite */}
            <div className="flex flex-col justify-end pb-1.5 min-h-[44px]">
              <label className={`flex items-center gap-3 cursor-pointer text-[14px] font-medium transition-all duration-300 select-none group px-3 py-2 rounded-xl border ${formData.isFavorite ? 'bg-[#a78bfa]/10 border-[#a78bfa]/30 text-[#a78bfa]' : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-neutral-800'}`}>
                <div className="relative flex items-center justify-center w-[22px] h-[22px]">
                  <input
                    type="checkbox"
                    name="isFavorite"
                    checked={formData.isFavorite}
                    onChange={handleChange}
                    className="peer appearance-none w-[22px] h-[22px] rounded-[6px] border-2 border-gray-400 dark:border-neutral-500 bg-white dark:bg-black checked:bg-[#a78bfa] checked:border-[#a78bfa] checked:shadow-[0_0_15px_rgba(167,139,250,0.3)] transition-all cursor-pointer shadow-sm"
                  />
                  <svg className="absolute w-[12px] h-[12px] pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="pt-0.5 text-inherit">Mark as Favorite</span>
              </label>
            </div>



            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Description <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <AlignLeft className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what this snippet does..."
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-transparent pl-10 pr-4 text-[15px] text-gray-900 dark:text-white outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa]/50 dark:focus:bg-transparent dark:autofill:shadow-[0_0_0_1000px_#09090b_inset] dark:autofill:[-webkit-text-fill-color:white] transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Change Note (Version Control) */}
            {isEditing && (
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="changeNote" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  Change Note <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="changeNote"
                  name="changeNote"
                  required={isEditing}
                  value={formData.changeNote}
                  onChange={handleChange}
                  placeholder="What changed in this version?"
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#09090b] px-4 text-[15px] outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-indigo-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600 shadow-sm"
                />
              </div>
            )}

            {/* Calendar & Attachments Container */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl border border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b]">

              {/* Calendar Section */}
              <div className="space-y-4">
                {/* Mark as Favorite */}
                <label className={`flex items-center gap-3 cursor-pointer text-[14px] font-medium transition-all duration-200 select-none group px-3 py-2 rounded-xl border ${formData.showInCalendar ? 'bg-[#a78bfa]/10 border-[#a78bfa]/30 text-[#a78bfa] font-semibold' : 'text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800'}`}>
                  <div className="relative flex items-center justify-center w-[18px] h-[18px]">
                    <input
                      type="checkbox"
                      name="showInCalendar"
                      checked={formData.showInCalendar}
                      onChange={handleChange}
                      className="peer appearance-none w-[18px] h-[18px] rounded-[4px] border-2 border-gray-400 dark:border-neutral-600 bg-white dark:bg-black checked:bg-[#a78bfa] checked:border-[#a78bfa] checked:shadow-[0_0_10px_rgba(167,139,250,0.3)] transition-all cursor-pointer"
                    />
                    <svg className="absolute w-[10px] h-[10px] pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <Calendar className={`h-[18px] w-[18px] transition-colors ${formData.showInCalendar ? 'text-[#a78bfa]' : 'text-gray-400 dark:text-gray-500'}`} />
                  Show in Calendar
                </label>

                {formData.showInCalendar && (
                  <div className="pl-6 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="calendarDate" className="text-[13px] text-gray-600 dark:text-gray-400">Date</label>
                      <CustomDatePicker
                        selectedDate={formData.calendarDate}
                        onChange={(dateValue) => setFormData(prev => ({ ...prev, calendarDate: dateValue }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Paperclip className="h-[18px] w-[18px] text-gray-400 dark:text-gray-500" />
                    Attachments
                  </span>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[13px] font-medium text-[#a78bfa] hover:text-[#c4b5fd] hover:bg-[#a78bfa]/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Upload Files
                  </button>
                </div>

                <div className={`text-[13px] text-gray-500 dark:text-gray-400 p-4 border border-dashed border-gray-300 dark:border-neutral-700 rounded-xl ${currentAttachments.length === 0 ? 'text-center' : 'space-y-2'}`}>
                  {currentAttachments.length === 0 ? (
                    "No attachments currently uploaded."
                  ) : (
                    <ul className="space-y-2">
                      {currentAttachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-white dark:bg-[#09090b] p-2 pr-3 rounded-lg border border-gray-100 dark:border-neutral-800">
                          <span className="truncate max-w-[200px] text-gray-700 dark:text-gray-300 font-medium">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove file"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  Snippet Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-[#27272a] overflow-hidden bg-[#fafafa] dark:bg-[#0d0e12] transition-all shadow-sm">

                {/* Editor Header like MacOS */}
                <div className="flex items-center px-4 py-2.5 border-b border-gray-200 dark:border-[#27272a] bg-gray-50 dark:bg-[#09090b]">
                  <div className="flex gap-2">
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f56]"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-[11px] h-[11px] rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="mx-auto text-[11px] font-medium text-gray-400 dark:text-gray-500 tracking-wider font-mono">
                    {formData.language === 'javascript' ? 'snippet.js' : `snippet.${formData.language}`}
                  </div>
                </div>

                {/* Monaco Editor Component */}
                {/* this code is for writing code (including it's css) */}
                <div className="h-[400px] w-full">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={formData.language === 'react' ? 'javascript' : formData.language}
                    theme="vs-dark"
                    value={formData.code}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineHeight: 22,
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false,
                        verticalHasArrows: false,
                        horizontalHasArrows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                      },
                      cursorSmoothCaretAnimation: "on",
                      smoothScrolling: true,
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}