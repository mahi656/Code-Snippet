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
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--sc-strip-bg)',
        borderBottom: '1px solid var(--sc-divider)',
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--sc-lang-label, var(--sc-label))',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {snippet.language || 'Snippet'}
        </span>

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
      <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Type badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'var(--sc-badge-bg)',
            color: 'var(--sc-badge-icon)',
            flexShrink: 0,
            border: '1px solid var(--sc-divider)',
          }}>
            {isProjectSnippet ? <Folder size={16} /> : <BookOpen size={16} />}
          </span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--sc-project-label, var(--sc-label))',
            letterSpacing: '-0.01em',
          }}>
            {isProjectSnippet ? 'Project Module' : 'General Snippet'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--sc-title)',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '-0.02em',
        }}>
          {snippet.title}
        </h3>

        {/* Tag badges */}
        {(tagCount > 0 || projectName) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {displayTags.slice(0, 3).map((tag, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'var(--sc-tag-bg)',
                color: 'var(--sc-tag-text)',
                fontSize: '11px',
                fontWeight: 600,
                border: '1px solid var(--sc-tag-border)',
              }}>
                {tag}
              </span>
            ))}
            {tagCount > 3 && (
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--sc-meta)',
                paddingLeft: '2px',
              }}>
                +{tagCount - 3} more
              </span>
            )}
          </div>
        )}

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--sc-meta)',
          fontSize: '12px',
          marginTop: 'auto',
          paddingTop: '4px',
        }}>
          <Calendar size={12} />
          <span style={{ fontWeight: 500 }}>{formattedDate}</span>
        </div>
      </div>

      {/* ── Zone 3: Bottom action bar ── */}
      <div style={{
        padding: '12px 16px',
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
