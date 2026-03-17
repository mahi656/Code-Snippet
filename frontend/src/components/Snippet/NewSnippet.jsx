import React, { useState } from 'react';
import { Save, X, Code, Tag, Folder, AlignLeft, ChevronDown } from 'lucide-react';

export default function NewSnippet({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'javascript',
    code: '',
    tags: '',
    project: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
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
                className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] px-4 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600 shadow-sm"
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label htmlFor="language" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Code className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full h-[44px] appearance-none rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-10 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white transition-all"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="react">React / JSX</option>
                  <option value="json">JSON</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Project Selection */}
            <div className="space-y-2">
              <label htmlFor="project" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                Project Domain
              </label>
              <div className="relative shadow-sm rounded-xl">
                <Folder className="absolute left-3.5 top-3.5 h-[18px] w-[18px] text-gray-400" />
                <select
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className={`w-full h-[44px] appearance-none rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-10 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all ${!formData.project ? "text-gray-400 dark:text-neutral-500" : "dark:text-white"}`}
                >
                  <option value="" disabled>Select a project... (Optional)</option>
                  <option value="nextjs-ecommerce">NextJS E-Commerce</option>
                  <option value="python-backend">Python Backend</option>
                </select>
                <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
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
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Code Textarea mimicking IDE */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="code" className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                  Snippet Code <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative rounded-xl border border-gray-200 dark:border-neutral-800/60 overflow-hidden bg-[#fafafa] dark:bg-[#0d0e12] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-sm">

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

                {/* Editor Body */}
                <textarea
                  id="code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="// Paste or write your awesome code here..."
                  className="w-full min-h-[300px] p-5 bg-transparent text-[14px] leading-relaxed font-mono outline-none dark:text-gray-300 resize-y placeholder:text-gray-400 dark:placeholder:text-neutral-600 selection:bg-blue-200 dark:selection:bg-blue-900/50"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-2 md:col-span-2">
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
                  placeholder="e.g. react, hooks, utility..."
                  className="w-full h-[44px] rounded-xl border border-gray-200 dark:border-neutral-800/60 bg-white dark:bg-[#111216] pl-10 pr-4 text-[15px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-neutral-600"
                />
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
