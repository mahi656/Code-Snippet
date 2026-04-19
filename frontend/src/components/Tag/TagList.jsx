import React from 'react';
import { getTagColor } from '../../utils/tag-lang-colors';

const TagList = ({ tags, selected, selectedTag, setSelectedTag, setSelected }) => {
  return (
    <div className="mt-1 flex flex-col space-y-0.5">
      {tags.length > 0 ? (
        tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => {
              setSelectedTag(tag.name);
              setSelected("Tag");
            }}
            className={`group relative flex h-9 w-full items-center rounded-lg transition-all duration-200 px-3 ${
              selected === "Tag" && selectedTag === tag.name
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
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                selected === "Tag" && selectedTag === tag.name
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
  );
};

export default TagList;
