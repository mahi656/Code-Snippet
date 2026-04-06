import React from 'react';
import { ArrowLeft, MoreHorizontal, MapPin, CalendarDays, FileText, Download, Award } from 'lucide-react';

export const ProfilePage = ({ onBack, isDark }) => {
  return (
    <div className={`flex-1 overflow-auto bg-white dark:bg-black p-4 md:p-8 flex justify-center items-start ${isDark ? 'dark' : ''}`}>
      <div className="w-full max-w-2xl bg-white dark:bg-[#09090b] rounded-[32px] overflow-hidden border border-gray-200 dark:border-[#27272a] shadow-sm relative pb-24">

        {/* Header Block with Blobs */}
        <div className="relative h-48 bg-[#f5f3ff] dark:bg-[#121212] overflow-hidden rounded-t-[32px]">
          {/* Decorative Blobs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#e0e7ff] dark:bg-[#a78bfa]/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#ede9fe] dark:bg-[#7c3aed]/20 rounded-full blur-2xl"></div>

          {/* Nav */}
          <div className="relative z-10 flex items-center justify-between p-6">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-[#27272a] shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#3f3f46] transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white">Profile</h2>
            <button className="w-10 h-10 rounded-full bg-white dark:bg-[#27272a] shadow-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#3f3f46] transition-colors">
              <MoreHorizontal className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-16 relative z-20">
          <div className="relative p-2 bg-white dark:bg-[#09090b] rounded-full">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden border-4 border-white dark:border-[#09090b]">
              <span className="drop-shadow-sm">N</span>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="px-8 mt-2 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User</h1>

          <div className="flex items-center gap-4 mt-3 text-sm font-medium">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" /> San Francisco, CA
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <CalendarDays className="h-4 w-4" /> Member since '23
            </div>
            <div className="px-3 py-1 bg-[#fef2f2] dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold tracking-wide">
              Regular
            </div>
          </div>

          <div className="w-full mt-10">
            <h3 className="text-[19px] font-bold text-gray-900 dark:text-white mb-3">Nick's Note</h3>
            <p className="text-[15px] text-gray-500 dark:text-[#a1a1aa] leading-relaxed">
              Passionate software engineer building robust and scalable web applications. Always exploring clean architecture, glassmorphism UI, and dark mode optimizations. Exploring new snippets daily!
            </p>
          </div>

          <div className="w-full mt-10">
            <h3 className="text-[19px] font-bold text-gray-900 dark:text-white mb-4">Recent Snippets</h3>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {[
                { name: "React_Fetch_Hook.tsx", color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10" },
                { name: "Express_Auth.js", color: "text-[#60a5fa]", bg: "bg-[#60a5fa]/10" },
                { name: "Glassmorphism_CSS", color: "text-[#f472b6]", bg: "bg-[#f472b6]/10" }
              ].map((file, i) => (
                <div key={i} className="min-w-[140px] flex-shrink-0 snap-center p-4 rounded-2xl border border-gray-100 dark:border-[#27272a] bg-white dark:bg-[#121212] flex flex-col items-center justify-center text-center gap-3 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer shadow-sm">
                  <div className={`p-3 rounded-xl ${file.bg}`}>
                    <FileText className={`h-6 w-6 ${file.color}`} />
                  </div>
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 break-all line-clamp-2">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-xl border-t border-gray-200 dark:border-[#27272a] flex items-center gap-3">
          <button className="flex-1 max-w-[140px] h-[52px] rounded-2xl border border-gray-200 dark:border-[#27272a] bg-white dark:bg-[#121212] flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors font-semibold text-gray-900 dark:text-white text-[15px]">
            <Award className="h-5 w-5 text-[#a78bfa]" /> Premium
          </button>
          <button className="flex-1 h-[52px] rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-[15px] shadow-md hover:bg-black dark:hover:bg-gray-100 transition-colors">
            Get Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
