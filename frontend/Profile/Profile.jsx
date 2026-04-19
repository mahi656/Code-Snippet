import React, { useState, useEffect } from 'react';
import api from '../src/api/api';
import {
  ArrowLeft, Users, BookOpen, MapPin, Link2, Building2,
  Calendar, Twitter, ExternalLink
} from 'lucide-react';

const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
      <Icon className="h-3.5 w-3.5" />
      <span className="text-[11px] font-semibold uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
  </div>
);

const InfoRow = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2.5 text-[13.5px] text-gray-600 dark:text-gray-300">
    <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500 shrink-0" />
    <span>{children}</span>
  </div>
);

// Exact GitHub palette
const GH_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
const GH_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const CELL = 10;
const GAP = 2;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ContributionGraph = ({ username, isDark }) => {
  const year = new Date().getFullYear();
  const [days, setDays] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!username) return;
    setBusy(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`)
      .then(r => r.json())
      .then(d => { setDays(d.contributions || []); setTotal(d.total?.[year] ?? 0); })
      .catch(() => setDays([]))
      .finally(() => setBusy(false));
  }, [username]);

  // Build week columns (Sun=0 … Sat=6)
  const weeks = [];
  let col = Array(7).fill(null);
  days.forEach(day => {
    const dow = new Date(day.date + 'T00:00:00').getDay();
    col[dow] = day;
    if (dow === 6) { weeks.push(col); col = Array(7).fill(null); }
  });
  if (col.some(Boolean)) weeks.push(col);

  // Month labels: only emit when month changes
  const monthLabels = [];
  let lastMon = -1;
  weeks.forEach((w, wi) => {
    const first = w.find(Boolean);
    if (!first) return;
    const mon = new Date(first.date + 'T00:00:00').getMonth();
    if (mon !== lastMon) {
      monthLabels.push({ wi, label: new Date(first.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' }) });
      lastMon = mon;
    }
  });

  const palette = isDark ? GH_DARK : GH_LIGHT;
  const totalW = weeks.length * (CELL + GAP) - GAP;

  return (
    <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
      <p className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 mb-4">
        {busy ? '…' : `${total.toLocaleString()} contributions in ${year}`}
      </p>

      {busy ? (
        <div className="animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 h-[100px]" />
      ) : (
        <div className="overflow-x-auto">
          <div style={{ width: totalW + 32 + 6 }}>

            {/* Month labels */}
            <div className="flex" style={{ paddingLeft: 32 + 6, marginBottom: 4 }}>
              {monthLabels.map((m, i) => {
                const nextWi = monthLabels[i + 1]?.wi ?? weeks.length;
                const widthPx = (nextWi - m.wi) * (CELL + GAP);
                return (
                  <div key={i} style={{ width: widthPx, minWidth: 0, overflow: 'hidden' }}
                    className="text-[10px] text-gray-400 dark:text-gray-500 select-none whitespace-nowrap">
                    {m.label}
                  </div>
                );
              })}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col shrink-0" style={{ gap: GAP, marginRight: 6, width: 32, paddingTop: 1 }}>
                {DAY_LABELS.map((d, i) => (
                  <div key={i}
                    className="text-[9px] text-gray-400 dark:text-gray-500 text-right select-none"
                    style={{ height: CELL, lineHeight: `${CELL}px` }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                    {week.map((day, di) => (
                      <div
                        key={di}
                        title={day && day.count > 0 ? `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}` : undefined}
                        style={{
                          width: CELL, height: CELL,
                          borderRadius: 2,
                          backgroundColor: day ? palette[day.level] : 'transparent',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-3">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Less</span>
              {palette.map((c, i) => (
                <div key={i} style={{ width: CELL, height: CELL, borderRadius: 2, backgroundColor: c }} />
              ))}
              <span className="text-[10px] text-gray-400 dark:text-gray-500">More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProfilePage = ({ onBack, isDark }) => {
  const [userData, setUserData] = useState(null);
  const [ghData, setGhData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) { setLoading(false); return; }

        const response = await api.get(`/auth/${username}`);
        const user = response.data?.data || response.data;
        setUserData(user);

        if (user?.githubId && user?.username) {
          try {
            const ghResponse = await fetch(`https://api.github.com/users/${user.username}`);
            if (ghResponse.ok) setGhData(await ghResponse.json());
          } catch (e) { console.warn('GitHub API failed', e); }
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
      <div className={`flex-1 flex justify-center items-center h-full ${isDark ? 'dark' : ''} bg-[#fafafa] dark:bg-[#0a0a0a]`}>
        <div className="animate-pulse flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-neutral-800" />
          <div className="w-28 h-4 rounded-full bg-stone-200 dark:bg-neutral-800" />
        </div>
      </div>
    );
  }

  const isGitHub = !!userData?.githubId;
  const avatar = ghData?.avatar_url || userData?.avatar_url;
  const name = ghData?.name || userData?.fullName || userData?.username || 'User';
  const username = userData?.username;
  const bio = ghData?.bio || userData?.bio;
  const followers = ghData?.followers ?? userData?.followers;
  const following = ghData?.following;
  const publicRepos = ghData?.public_repos ?? userData?.public_repos;
  const location = ghData?.location;
  const company = ghData?.company;
  const blog = ghData?.blog;
  const twitterUsername = ghData?.twitter_username;
  const joinedAt = ghData?.created_at;
  const hireable = ghData?.hireable;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <div className={`flex-1 overflow-auto bg-[#fafafa] dark:bg-[#0a0a0a] ${isDark ? 'dark' : ''}`}>
      {/* Breadcrumb nav */}
      <div className="sticky top-0 z-30 flex items-center gap-2 px-6 py-3.5 bg-[#fafafa]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-neutral-800/50">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-gray-300 dark:text-neutral-700">/</span>
        <span className="text-[13px] font-semibold text-gray-900 dark:text-white">Profile</span>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="px-6 pt-6 pb-6">
            <div className="flex items-start justify-between mb-5">
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-neutral-700" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-2xl font-bold text-stone-600 dark:text-stone-300">
                    {username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {isGitHub && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-[3px] rounded-full border-2 border-white dark:border-[#111113]">
                    <GitHubIcon className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {hireable && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 text-[11.5px] font-semibold">
                    Hireable
                  </span>
                )}
                {isGitHub && (
                  <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-[12px] font-semibold hover:opacity-80 transition-opacity">
                    <GitHubIcon className="w-3 h-3" />
                    GitHub
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                )}
              </div>
            </div>

            <h1 className="text-[18px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{name}</h1>
            {username && <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 mb-3">@{username}</p>}
            {bio && <p className="text-[13.5px] text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mb-4">{bio}</p>}

            {(location || company || blog || twitterUsername || joinedAt) && (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {location && <InfoRow icon={MapPin}>{location}</InfoRow>}
                {company && <InfoRow icon={Building2}>{company.replace('@', '')}</InfoRow>}
                {blog && (
                  <InfoRow icon={Link2}>
                    <a href={blog.startsWith('http') ? blog : `https://${blog}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-700 dark:text-gray-200">
                      {blog.replace(/^https?:\/\//, '')}
                    </a>
                  </InfoRow>
                )}
                {twitterUsername && (
                  <InfoRow icon={Twitter}>
                    <a href={`https://twitter.com/${twitterUsername}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-700 dark:text-gray-200">
                      @{twitterUsername}
                    </a>
                  </InfoRow>
                )}
                {joinedAt && <InfoRow icon={Calendar}>Joined {formatDate(joinedAt)}</InfoRow>}
              </div>
            )}
          </div>

          {isGitHub && (followers !== undefined || following !== undefined || publicRepos !== undefined) && (
            <>
              <div className="border-t border-gray-100 dark:border-neutral-800" />
              <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-neutral-800">
                {followers !== undefined && (
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Followers</p>
                    <p className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">{followers.toLocaleString()}</p>
                  </div>
                )}
                {following !== undefined && (
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Following</p>
                    <p className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">{following.toLocaleString()}</p>
                  </div>
                )}
                {publicRepos !== undefined && (
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Repos</p>
                    <p className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">{publicRepos.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </>
          )}
          {isGitHub && username && (
            <>
              <div className="border-t border-gray-100 dark:border-neutral-800" />
              <div className="px-6 py-5">
                <ContributionGraph username={username} isDark={isDark} />
              </div>
            </>
          )}

          {/* Non-GitHub connect prompt */}
          {!isGitHub && (
            <>
              <div className="border-t border-gray-100 dark:border-neutral-800" />
              <div className="px-7 py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-gray-600 dark:text-gray-400">
                  <GitHubIcon className="w-5 h-5" />
                </div>
                <p className="text-[14px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Connect your GitHub</p>
                <p className="text-[12.5px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                  Link your GitHub account to display your repositories, followers, and contribution data.
                </p>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
