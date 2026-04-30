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
          <div className="space-y-12">
            {projectNames.map((projectName) => (
              <div key={projectName} className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#1e1e24] border border-gray-200 dark:border-[#27272a]">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 tracking-wide">{projectName}</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gray-200 dark:bg-[#27272a]"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(groupedProjects[projectName] || []).map((snippet) => (
                    <SnippetCard
                      key={snippet._id}
                      snippet={snippet}
                      view="Projects"
                      isDark={true}
                      onFavorite={onFavorite}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onHistory={onHistory}
                      onRestore={() => {}}
                    />
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
