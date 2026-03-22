import React, { useState } from 'react';
import { Save, X, Code, Tag, AlignLeft, ChevronDown, Layers, Package, Link, Globe, Lock } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ErrorMessage from '../Error/DuplicateError.jsx';

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
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "dart", label: "Dart" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "react", label: "React / JSX" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "json", label: "JSON" },
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
  { value: "private", label: "Private (Only me)" }
];

export default function NewSnippet({ onSave, onCancel, existingSnippets = [] }) {
  //This part stores all the "live" data for our form

  // These three variables keep track of whether our dropdown menus are open or closed
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isFrameworkDropdownOpen, setIsFrameworkDropdownOpen] = useState(false);
  const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);

  // This stores any error message we want to show the user (like "Title is required")
  const [errorText, setErrorText] = useState("");

  // This is one big object that holds all the information the user types into the form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'javascript',
    framework: 'none',
    visibility: 'public',
    dependencies: '',
    referenceLink: '',
    code: '// Start coding here...',
    tags: '',
  });

  // This function updates our formData whenever a user types in a normal text box
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // This is a special function just for the Monaco Editor part
  // It updates the "code" section of our form data
  const handleEditorChange = (value) => {
    setFormData(prev => ({ ...prev, code: value || '' }));
  };

  // This function runs when the user clicks the "Save Snippet" button
  const handleSubmit = (e) => {
    e.preventDefault(); // This stops the page from refreshing
    setErrorText(""); // Clear any old errors

    // Step 1: Check if the user forgot to give the snippet a name
    if (!formData.title.trim()) {
      setErrorText("Snippet Title is required.");
      return;
    }

    // Step 2: Check if this name is already taken by another snippet
    const isDuplicateTitle = existingSnippets.some(
      (snippet) => snippet.title.toLowerCase() === formData.title.trim().toLowerCase()
    );

    if (isDuplicateTitle) {
      setErrorText(`Wait! A snippet with the title "${formData.title.trim()}" already exists.`);
      return;
    }

    // Step 3: Check if the user is trying to save the exact same code twice
    const isDuplicateCode = existingSnippets.some(
      (snippet) => snippet.code.trim() === formData.code.trim()
    );

    if (isDuplicateCode) {
      setErrorText("Oops! This EXACT code is already saved in another snippet.");
      return;
    }

    // Step 4: If everything is okay, we save the snippet
    // We also turn the "tags" string into a clean list (array) here
    if (onSave) {
      onSave({
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-8 h-[4.5rem] border-b border-gray-100 dark:border-neutral-800/60 shrink-0">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight text-gray-900 dark:text-[#f3f4f6]">
            Create New Snippet
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#111216] text-[14px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-[14px] font-medium text-white shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Snippet
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 overflow-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
          <ErrorMessage message={errorText} onClose={() => setErrorText("")} />

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
                className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] px-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600 shadow-sm"
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2 relative">
              <label htmlFor="language" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Code className="absolute left-3.5 top-[13px] h-[18px] w-[18px] text-gray-400 pointer-events-none z-10" />
                <button
                  type="button"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{LANGUAGES.find(l => l.value === formData.language)?.label || 'Select Language'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLanguageDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLanguageDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#111216] border border-gray-200 dark:border-neutral-800/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, language: lang.value }));
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.language === lang.value ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
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
                <Layers className="absolute left-3.5 top-[13px] h-[18px] w-[18px] text-gray-400 pointer-events-none z-10" />
                <button
                  type="button"
                  onClick={() => setIsFrameworkDropdownOpen(!isFrameworkDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{FRAMEWORKS.find(f => f.value === formData.framework)?.label || 'None / Vanilla'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isFrameworkDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFrameworkDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFrameworkDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#111216] border border-gray-200 dark:border-neutral-800/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {FRAMEWORKS.map(fw => (
                        <button
                          key={fw.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, framework: fw.value }));
                            setIsFrameworkDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.framework === fw.value ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
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
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
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
                  <Globe className="absolute left-3.5 top-[13px] h-[18px] w-[18px] text-gray-400 pointer-events-none z-10" /> :
                  <Lock className="absolute left-3.5 top-[13px] h-[18px] w-[18px] text-gray-400 pointer-events-none z-10" />
                }
                <button
                  type="button"
                  onClick={() => setIsVisibilityDropdownOpen(!isVisibilityDropdownOpen)}
                  className="w-full h-[44px] flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all text-left"
                >
                  <span className="truncate">{VISIBILITY_OPTIONS.find(v => v.value === formData.visibility)?.label || 'Public (Shared with team)'}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isVisibilityDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isVisibilityDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsVisibilityDropdownOpen(false)}></div>
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#111216] border border-gray-200 dark:border-neutral-800/60 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-[240px] overflow-y-auto py-1">
                      {VISIBILITY_OPTIONS.map(vis => (
                        <button
                          key={vis.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, visibility: vis.value }));
                            setIsVisibilityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 text-[14px] transition-colors text-left ${formData.visibility === vis.value ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50'}`}
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
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Reference Link */}
            <div className="space-y-2">
              <label htmlFor="referenceLink" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Ext. Reference Link <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Link className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <input
                  type="url"
                  id="referenceLink"
                  name="referenceLink"
                  value={formData.referenceLink}
                  onChange={handleChange}
                  placeholder="https://stackoverflow.com/..."
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
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
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  Snippet Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-neutral-800/60 overflow-hidden bg-[#fafafa] dark:bg-[#0d0e12] transition-all shadow-sm">

                {/* Editor Header like MacOS */}
                <div className="flex items-center px-4 py-2.5 border-b border-gray-200 dark:border-neutral-800/60 bg-gray-50 dark:bg-[#111216]">
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