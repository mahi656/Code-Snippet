import React from "react";
import SnippetCard from "../Snippet/SnippetCard.jsx";

export const ProjectWorkspaceView = ({
  snippets = [],
  onCreateSnippetForProject,
  onFavorite,
  onDelete,
  onEdit,
  onHistory,
}) => {
  const groupedProjects = snippets.reduce((acc, snippet) => {
    const projectTag = (snippet.tags || []).find((tag) => tag.startsWith("project:"));
    if (!projectTag) return acc;
    const projectName = projectTag.replace("project:", "");
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(snippet);
    return acc;
  }, {});

  const projectNames = Object.keys(groupedProjects);

  return (
    <div className="flex-1 overflow-auto p-6 md:p-8 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Project Snippets</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse snippets grouped by project with clean file paths and quick open actions.</p>
          </div>
        </div>

        {projectNames.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-[#27272a] bg-gray-50/50 dark:bg-[#09090b]/50 p-8 text-center text-gray-500 dark:text-gray-400">
            No project snippets yet.
          </div>
        ) : (
          <div className="space-y-5">
            {projectNames.map((projectName) => (
              <div key={projectName} className="rounded-2xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#101014] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.3)]">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-[#27272a] flex items-center justify-between bg-gray-50/70 dark:bg-[#13131a]">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400">Project</p>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{projectName}</h3>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(groupedProjects[projectName] || []).map((snippet) => (
                    <div key={snippet._id} className="space-y-2">
                      <div className="px-1">
                        <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Path</p>
                        <p className="text-[12px] text-gray-600 dark:text-gray-300 truncate">{projectName}/{snippet.title}</p>
                      </div>
                      <SnippetCard
                        snippet={snippet}
                        view="Projects"
                        isDark={true}
                        onFavorite={onFavorite}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onHistory={onHistory}
                        onRestore={() => {}}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
