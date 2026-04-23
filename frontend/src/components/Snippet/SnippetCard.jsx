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
} from 'lucide-react';
import { formatStandardDate } from '../../utils/dateUtils';
import { motion } from 'framer-motion';

const SnippetCard = ({ snippet, onFavorite, onDelete, onEdit, onHistory, onRestore, isDark, view }) => {
  const formattedDate = formatStandardDate(snippet.createdAt);
  const projectTag = (snippet.tags || []).find((tag) => typeof tag === "string" && tag.startsWith("project:"));
  const projectName = projectTag ? projectTag.replace("project:", "") : "";
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
        border: '3px double var(--sc-border)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s',
      }}
      className="group sc-card"
    >
      {/* ── Zone 1: Top strip — Language label ── */}
      <div style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--sc-label)',
          letterSpacing: '0.01em',
        }}>
          {snippet.language || 'Snippet'}
        </span>

        {/* Action buttons — top-right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {view !== 'Trash' && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(snippet._id, !snippet.isFavorite); }}
              className="sc-icon-btn sc-icon-btn--rose"
              style={{ color: snippet.isFavorite ? '#f43f5e' : undefined }}
              title="Favorite"
            >
              <Heart size={20} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}
          {view === 'Trash' && (
            <button
              onClick={(e) => { e.stopPropagation(); onRestore && onRestore(snippet._id); }}
              className="sc-icon-btn sc-icon-btn--green"
              title="Restore Snippet"
            >
              <RotateCcw size={20} />
            </button>
          )}
          {view !== 'Trash' && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit && onEdit(snippet); }}
                className="sc-icon-btn sc-icon-btn--blue"
                title="Edit Snippet"
              >
                <Edit3 size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onHistory && onHistory(snippet._id); }}
                className="sc-icon-btn sc-icon-btn--amber"
                title="Version History"
              >
                <History size={20} />
              </button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(snippet._id); }}
            className="sc-icon-btn sc-icon-btn--red"
            title={view === 'Trash' ? 'Permanently Delete' : 'Move to Trash'}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* ── Zone 2: Main body ── */}
      <div style={{ padding: '4px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Type badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--sc-badge-bg)',
            color: 'var(--sc-badge-icon)',
            flexShrink: 0,
          }}>
            <BookOpen size={18} />
          </span>
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--sc-label)',
          }}>
            Snippet
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 800,
          color: 'var(--sc-title)',
          lineHeight: 1.25,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          letterSpacing: '-0.01em',
        }}>
          {snippet.title}
        </h3>

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--sc-meta)',
          fontSize: '13px',
        }}>
          <Calendar size={13} />
          <span>{formattedDate}</span>
        </div>

        {/* Tag badges */}
        {(tagCount > 0 || projectName) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            {displayTags.slice(0, 3).map((tag, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 11px',
                borderRadius: '999px',
                background: 'var(--sc-tag-bg)',
                color: 'var(--sc-tag-text)',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid var(--sc-tag-border)',
              }}>
                #{tag}
              </span>
            ))}
            {tagCount > 3 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 11px',
                borderRadius: '999px',
                background: '#f59e0b',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 4px 10px rgba(245,158,11,0.3)',
              }}>
                +{tagCount - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Zone 3: Bottom action bar ── */}
      <div style={{
        padding: '0 20px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        {/* Left: description preview */}
        <span style={{
          fontSize: '13px',
          color: 'var(--sc-meta)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {snippet.description
            ? snippet.description.slice(0, 48) + (snippet.description.length > 48 ? '…' : '')
            : 'No description'}
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
            background: isDark ? '#e4e4e7' : '#27272a',
            color: isDark ? '#18181b' : '#ffffff',
            border: 'none',
            boxShadow: 'none',
          }}
          title={view === 'Trash' ? 'Restore Snippet' : 'Edit Snippet'}
        >
          {view === 'Trash' ? 'Restore' : 'Edit'}
        </button>
      </div>
    </motion.div>
  );
};

export default SnippetCard;
