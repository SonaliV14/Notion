import React, { useState, useRef, useEffect } from 'react';
import { 
  Table, LayoutGrid, List, Calendar, Grid3x3, Download, FileText, 
  Video, AlignLeft, MoreHorizontal, Lock, Share2, Star, X, Save, ChevronDown
} from 'lucide-react';
import { updatePage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function PageEditor({ page, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('👋');
  const [pageTitle, setPageTitle] = useState('');
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [content, setContent] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);
  const moreMenuRef = useRef(null);

  const emojis = ['👋', '📝', '🚀', '💡', '📊', '🎯', '✨', '🔥', '💼', '📅', '🎨', '🌟', '📌', '🏆', '💪', '🎉'];

  const quickActions = [
    { icon: Video, label: 'Meet', description: 'Create a new meeting' },
    { icon: Table, label: 'Database', description: 'Add a database' },
    { icon: AlignLeft, label: 'Form', description: 'Create a form' },
    { icon: FileText, label: 'Templates', description: 'Use a template', highlight: true },
    { icon: MoreHorizontal, label: 'More', description: 'See more options' }
  ];

  const viewOptions = [
    { icon: Table, label: 'Table' },
    { icon: LayoutGrid, label: 'Board' },
    { icon: List, label: 'List' },
    { icon: AlignLeft, label: 'Timeline' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Grid3x3, label: 'Gallery' },
    { icon: Download, label: 'Import' }
  ];

  // Initialize page data
  useEffect(() => {
    if (page) {
      setPageTitle(page.title || '');
      setContent(page.content || '');
      if (contentRef.current) {
        contentRef.current.innerText = page.content || '';
      }
    }
  }, [page]);

  const handleSave = async () => {
    if (!page || !user?.token) return;
    
    setSaving(true);
    const res = await updatePage(page._id, {
      title: pageTitle || 'Untitled',
      content: content
    }, user.token);
    
    if (res.success) {
      alert('Page saved successfully!');
      if (onUpdate) {
        onUpdate({ ...page, title: pageTitle || 'Untitled', content });
      }
    } else {
      alert('Failed to save page: ' + res.error);
    }
    setSaving(false);
  };

  const handleContentChange = (e) => {
    const text = e.target.innerText;
    setContent(text);
    
    if (text === '/' || text.endsWith('/')) {
      setShowCommandMenu(true);
    } else if (!text.includes('/')) {
      setShowCommandMenu(false);
    }
  };

  const selectViewOption = (option) => {
    setShowCommandMenu(false);
    if (contentRef.current) {
      contentRef.current.innerText = '';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      if (onDelete) {
        onDelete(page._id);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  if (!page) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedEmoji}</span>
          <span className="text-sm text-gray-400">{pageTitle || 'Untitled'}</span>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:bg-neutral-800 rounded">
            <Lock className="w-3 h-3" />
            Private
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white">
            Share
          </button>
          <button className="p-1.5 hover:bg-neutral-800 rounded">
            <Star className="w-4 h-4" />
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 hover:bg-neutral-800 rounded"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl py-1 z-50">
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Copy link
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <div className="h-px bg-neutral-700 my-1" />
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Add to favorites
                </button>
                <div className="h-px bg-neutral-700 my-1" />
                <button 
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 text-red-400"
                >
                  <X className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-16 py-20">
          <div className="mb-6 relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-8xl hover:opacity-80 transition-opacity"
            >
              {selectedEmoji}
            </button>
            
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-xl z-10">
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-3xl hover:bg-neutral-700 rounded p-1 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-5xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 mb-2"
          />

          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="min-h-[200px] text-gray-300 outline-none mb-8"
            data-placeholder="Write, press 'space' for AI, '/' for commands..."
            style={{ minHeight: '100px' }}
          />

          {showCommandMenu && (
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-2 mb-8 w-64">
              <div className="space-y-1">
                {viewOptions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectViewOption(option)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-700 rounded text-left transition-colors"
                  >
                    <option.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm text-gray-500 mb-4">Get started with</h3>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    action.highlight
                      ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-orange-500/30 hover:border-orange-500/50'
                      : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Style for placeholder */}
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}