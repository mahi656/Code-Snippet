import React from 'react';
import {
  Heart,
  Trash2,
  Code,
  Calendar,
  RotateCcw,
  Edit3,
  History,
  BookOpen,
  Folder,
} from 'lucide-react';
import { formatStandardDate } from '../../utils/dateUtils';
import { motion } from 'framer-motion';
import * as SiIcons from 'react-icons/si';

const iconColors = {
  // Languages & Frameworks
  SiJavascript: '#F7DF1E',
  SiTypescript: '#3178C6',
  SiPython: '#3776AB',
  SiHtml5: '#E34F26',
  SiCss3: '#1572B6',
  SiReact: '#61DAFB',
  SiNextdotjs: '#000000',
  SiNodedotjs: '#339933',
  SiExpress: '#000000',
  SiMongodb: '#47A248',
  SiPostgresql: '#4169E1',
  SiRedis: '#DC382D',
  SiTailwindcss: '#06B6D4',
  SiDocker: '#2496ED',
  SiGit: '#F05032',
  SiGithub: '#181717',
  SiVercel: '#000000',
  SiSocketdotio: '#010101',
  SiRender: '#46E3B7',
  SiFirebase: '#FFCA28',
  SiSupabase: '#3ECF8E',
  SiMysql: '#4479A1',
  SiGraphql: '#E10098',
  SiDjango: '#092E20',
  SiFlask: '#000000',
  SiRust: '#000000',
  SiGo: '#00ADD8',
  SiSwift: '#F05138',
  SiKotlin: '#7F52FF',
  SiJava: '#007396',
  SiCplusplus: '#00599C',
  SiCsharp: '#239120',
  SiPhp: '#777BB4',
  SiLaravel: '#FF2D20',
  SiVuejs: '#4FC08D',
  SiAngular: '#DD0031',
  SiSvelte: '#FF3E00',
  SiRedux: '#764ABC',
  SiZustand: '#433929',
  SiC: '#A8B9CC',
  SiDart: '#0175C2',
  SiJson: '#000000',
  SiGnubash: '#4EAA25',
  SiMarkdown: '#000000',
  SiSpringboot: '#6DB33F',
};

const getSiIconName = (lang) => {
  if (!lang) return null;
  const search = lang.toLowerCase().replace(/[^a-z0-9]/g, '');

  const keys = Object.keys(SiIcons);

  // First priority: Exact match (after stripping 'Si' and non-alphanumeric)
  const exactMatch = keys.find(key => {
    const iconName = key.toLowerCase().replace(/^si/, '');
    return iconName === search;
  });
  if (exactMatch) return exactMatch;

  // Second priority: Common aliases
  const aliases = {
    'js': 'SiJavascript',
    'ts': 'SiTypescript',
    'py': 'SiPython',
    'cpp': 'SiCplusplus',
    'c#': 'SiCsharp',
    'golang': 'SiGo',
    'node': 'SiNodedotjs',
    'mongo': 'SiMongodb',
    'sql': 'SiPostgresql',
    'bash': 'SiGnubash',
    'c': 'SiC',
    'dart': 'SiDart',
    'json': 'SiJson',
    'md': 'SiMarkdown',
    'markdown': 'SiMarkdown',
    'spring': 'SiSpringboot',
    'springboot': 'SiSpringboot',
  };
  if (aliases[search]) return aliases[search];

  // Third priority: Partial match
  const partialMatch = keys.find(key => {
    const iconName = key.toLowerCase().replace(/^si/, '');
    return iconName.includes(search);
  });

  return partialMatch || null;
};

const SnippetCard = ({ snippet, onFavorite, onDelete, onEdit, onHistory, onRestore, isDark, view }) => {
  const formattedDate = formatStandardDate(snippet.createdAt);
  const projectTag = (snippet.tags || []).find((tag) => typeof tag === "string" && tag.startsWith("project:"));
  const projectName = projectTag ? projectTag.replace("project:", "") : "";
  const isProjectSnippet = !!projectName;
  const displayTags = [
    ...(projectName ? [projectName] : []),
    ...(snippet.tags || [])
      .filter((tag) => typeof tag === "string" && !tag.startsWith("project:"))
  ];
  const tagCount = displayTags.length;

  const siIconName = getSiIconName(snippet.language);
  const IconComponent = siIconName ? SiIcons[siIconName] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      style={{
        background: 'var(--sc-bg)',
        border: '1px solid var(--sc-border)',
        borderRadius: '14px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className={`group sc-card ${isProjectSnippet ? 'sc-card--project' : ''}`}
    >
      {/* ── Zone 1: Top strip — Language label ── */}
      <div style={{
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--sc-strip-bg)',
        borderBottom: '1px solid var(--sc-divider)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {IconComponent ? (
            <IconComponent
              style={{
                width: '16px',
                height: '16px',
                color: iconColors[siIconName] || 'currentColor'
              }}
            />
          ) : (
            <Code size={14} className="text-gray-400" />
          )}
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--sc-lang-label, var(--sc-label))',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {snippet.language || 'Snippet'}
          </span>
        </div>

        {/* Action buttons — top-right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {view !== 'Trash' && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(snippet._id, !snippet.isFavorite); }}
              className="sc-icon-btn sc-icon-btn--rose"
              style={{ color: snippet.isFavorite ? '#f43f5e' : undefined, width: '32px', height: '32px' }}
              title="Favorite"
            >
              <Heart size={18} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          {view === 'Trash' && (
            <button
              onClick={(e) => { e.stopPropagation(); onRestore && onRestore(snippet._id); }}
              className="sc-icon-btn sc-icon-btn--green"
              style={{ width: '32px', height: '32px' }}
              title="Restore Snippet"
            >
              <RotateCcw size={18} />
            </button>
          )}
          {view !== 'Trash' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(snippet); }}
                className="sc-icon-btn sc-icon-btn--blue"
                style={{ width: '32px', height: '32px' }}
                title="Edit Snippet"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onHistory && onHistory(snippet._id); }}
                className="sc-icon-btn sc-icon-btn--amber"
                style={{ width: '32px', height: '32px' }}
                title="Version History"
              >
                <History size={18} />
              </button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(snippet._id); }}
            className="sc-icon-btn sc-icon-btn--red"
            style={{ width: '32px', height: '32px' }}
            title={view === 'Trash' ? 'Permanently Delete' : 'Move to Trash'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* ── Zone 2: Main body ── */}
      <div style={{
        padding: '40px 20px 16px 20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        minHeight: '180px'
      }}>

        {/* Title & Icon Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: isProjectSnippet ? (isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.08)') : (isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(124, 58, 237, 0.08)'),
            color: isProjectSnippet ? (isDark ? '#818cf8' : '#4f46e5') : (isDark ? '#a78bfa' : '#7c3aed'),
            flexShrink: 0,
            border: isProjectSnippet ? (isDark ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(79, 70, 229, 0.15)') : (isDark ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(124, 58, 237, 0.15)'),
          }}>
            {isProjectSnippet ? <Folder size={18} /> : <BookOpen size={18} />}
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--sc-title)',
            letterSpacing: '-0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}>
            {snippet.title}
          </span>
        </div>

        {/* Metadata Row: Tags/Framework (left) & Date (right) */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingTop: '12px'
        }}>
          {/* Left side: Tags & Framework */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
            {/* Framework first */}
            {snippet.framework && snippet.framework !== 'none' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {(() => {
                  const fwIconName = getSiIconName(snippet.framework);
                  const FwIcon = fwIconName ? SiIcons[fwIconName] : null;
                  return (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--sc-tag-bg)',
                      color: 'var(--sc-tag-text)',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid var(--sc-tag-border)',
                    }}>
                      {FwIcon && (
                        <FwIcon style={{ width: '12px', height: '12px', color: iconColors[fwIconName] || 'currentColor' }} />
                      )}
                      {snippet.framework.charAt(0).toUpperCase() + snippet.framework.slice(1)}
                    </span>
                  );
                })()}
              </div>
            )}

            {/* Tags (text only) */}
            {displayTags.slice(0, 2).map((tag, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'var(--sc-tag-bg)',
                color: 'var(--sc-tag-text)',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid var(--sc-tag-border)',
                whiteSpace: 'nowrap'
              }}>
                {tag}
              </span>
            ))}
            {tagCount > 2 && (
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--sc-meta)', opacity: 0.6 }}>
                +{tagCount - 2}
              </span>
            )}
          </div>

          {/* Right side: Date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--sc-meta)',
            fontSize: '11px',
            marginLeft: 'auto',
            flexShrink: 0
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(217, 119, 6, 0.1)',
              color: isDark ? '#fbbf24' : '#b45309',
            }}>
              <Calendar size={14} />
            </div>
            <span style={{ fontWeight: 600, color: 'var(--sc-title)', opacity: isDark ? 0.8 : 0.9 }}>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* ── Zone 3: Bottom action bar ── */}
      <div style={{
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'var(--sc-strip-bg)',
        borderTop: '1px solid var(--sc-divider)',
      }}>
        {/* Left: description preview */}
        <span style={{
          fontSize: '12px',
          color: 'var(--sc-meta)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          fontWeight: 400,
        }}>
          {snippet.description || 'No description provided'}
        </span>

        {/* Right: primary CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (view === 'Trash') {
              onRestore && onRestore(snippet._id);
            } else {
              onEdit && onEdit(snippet);
            }
          }}
          className="sc-cta-btn"
          style={{
            background: isDark ? '#ffffff' : '#111827',
            color: isDark ? '#09090b' : '#ffffff',
            padding: '6px 14px',
            height: '32px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {view === 'Trash' ? 'Restore' : 'Open'}
        </button>
      </div>
    </motion.div>
  );
};

export default SnippetCard;
