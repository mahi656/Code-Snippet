import React, { useState, useEffect } from 'react';
import api from '../src/api/api';
import { ArrowLeft, MoreHorizontal, MapPin, CalendarDays, FileText, Download, Award, Users, BookOpen } from 'lucide-react';

export const ProfilePage = ({ onBack, isDark }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) {
          setLoading(false);
          return;
        }

        const response = await api.get(`/auth/${username}`);

        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className={`flex-1 flex justify-center items-center h-full bg-white dark:bg-black p-4 md:p-8 ${isDark ? 'dark' : ''}`}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-[#27272a]"></div>
          <div className="w-32 h-6 bg-gray-200 dark:bg-[#27272a] rounded"></div>
        </div>
      </div>
    );
  }

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
            {userData?.avatar_url ? (
              <img src={userData.avatar_url} alt="Profile" className="w-24 h-24 rounded-full shadow-lg border-4 border-white dark:border-[#09090b] object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden border-4 border-white dark:border-[#09090b]">
                <span className="drop-shadow-sm">{userData?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Content */}
        <div className="px-8 mt-2 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userData?.fullName || userData?.username || "User"}
          </h1>

          <div className="flex items-center gap-4 mt-3 text-sm font-medium">
            {userData?.followers !== undefined && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" /> {userData.followers} Followers
              </div>
            )}
            {userData?.public_repos !== undefined && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <BookOpen className="h-4 w-4" /> {userData.public_repos} Repos
              </div>
            )}
            <div className="px-3 py-1 bg-[#fef2f2] dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold tracking-wide">
              {userData?.githubId ? 'GitHub User' : 'Regular'}
            </div>
          </div>

          <div className="w-full mt-10">
            <h3 className="text-[19px] font-bold text-gray-900 dark:text-white mb-3">Bio</h3>
            <p className="text-[15px] text-gray-500 dark:text-[#a1a1aa] leading-relaxed">
              {userData?.bio || "No bio available."}
            </p>
          </div>


        </div>

      </div>
    </div>
  );
};
export default ProfilePage;
