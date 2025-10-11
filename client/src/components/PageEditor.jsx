import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Code, Minus, AlertCircle, ChevronRight, Save, MoreHorizontal,
  Star, Lock, Share2, Download, FileText, X, ChevronDown, Trash2, Plus,
  GripVertical, Copy, StarOff
} from 'lucide-react';
import { 
  updatePage, 
  createBlock, 
  updateBlock, 
  deleteBlock,
  getPageBlocks,
  toggleFavorite,
  duplicatePage
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function PageEditor({ page, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('👋');
  const [pageTitle, setPageTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState({ top: 0, left: 0 });
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const moreMenuRef = useRef(null);
  const blockRefs = useRef({});

  const emojis = ['👋', '📝', '🚀', '💡', '📊', '🎯', '✨', '🔥', '💼', '📅', '🎨', '🌟', '📌', '🏆', '💪', '🎉', '🎭', '🌈', '⚡', '🎪'];

  const blockTypes = [
    { icon: Type, label: 'Paragraph', type: 'paragraph', description: 'Plain text' },
    { icon: Heading1, label: 'Heading 1', type: 'heading1', description: 'Large section heading' },
    { icon: Heading2, label: 'Heading 2', type: 'heading2', description: 'Medium section heading' },
    { icon: Heading3, label: 'Heading 3', type: 'heading3', description: 'Small section heading' },
    { icon: List, label: 'Bulleted List', type: 'bulletList', description: 'Create a simple list' },
    { icon: ListOrdered, label: 'Numbered List', type: 'numberedList', description: 'Create a numbered list' },
    { icon: CheckSquare, label: 'To-do', type: 'todo', description: 'Track tasks with checkboxes' },
    { icon: Quote, label: 'Quote', type: 'quote', description: 'Capture a quote' },
    { icon: Code, label: 'Code', type: 'code', description: 'Code snippet with syntax' },
    { icon: Minus, label: 'Divider', type: 'divider', description: 'Visual divider' },
    { icon: AlertCircle, label: 'Callout', type: 'callout', description: 'Highlight important info' },
    { icon: ChevronRight, label: 'Toggle', type: 'toggle', description: 'Collapsible content' }
  ];

  // Load page data and blocks
  useEffect(() => {
    if (page) {
      setPageTitle(page.title || '');
      setSelectedEmoji(page.icon || '👋');
      setIsFavorite(page.isFavorite || false);
      loadBlocks();
    }
  }, [page]);

  const loadBlocks = async () => {
    if (!page || !user?.token) return;
    
    const res = await getPageBlocks(page._id, user.token);
    if (res.success) {
      setBlocks(res.blocks || []);
      // If no blocks, create initial one
      if (!res.blocks || res.blocks.length === 0) {
        handleAddBlock(null);
      }
    }
  };

  const handleSavePage = async () => {
    if (!page || !user?.token) return;
    
    setSaving(true);
    const res = await updatePage(page._id, {
      title: pageTitle || 'Untitled',
      icon: selectedEmoji
    }, user.token);
    
    if (res.success) {
      if (onUpdate) {
        onUpdate({ ...page, title: pageTitle || 'Untitled', icon: selectedEmoji });
      }
    } else {
      alert('Failed to save page: ' + res.error);
    }
    setSaving(false);
  };

  const handleToggleFavorite = async () => {
    if (!page || !user?.token) return;
    
    const res = await toggleFavorite(page._id, user.token);
    if (res.success) {
      setIsFavorite(!isFavorite);
      if (onUpdate) {
        onUpdate({ ...page, isFavorite: !isFavorite });
      }
    }
  };

  const handleDuplicate = async () => {
    if (!page || !user?.token) return;
    
    const res = await duplicatePage(page._id, user.token);
    if (res.success) {
      alert('Page duplicated successfully!');
      if (onUpdate) {
        onUpdate(res.page);
      }
    } else {
      alert('Failed to duplicate page: ' + res.error);
    }
    setShowMoreMenu(false);
  };

  const handleBlockContentChange = async (blockId, content) => {
    // Don't trigger re-render immediately to prevent cursor jump
    const block = blocks.find(b => b._id === blockId);
    if (block && block.content === content) return;

    setBlocks(blocks.map(b => 
      b._id === blockId ? { ...b, content } : b
    ));

    if (user?.token) {
      await updateBlock(blockId, { content }, user.token);
    }
  };

  const handleBlockTypeChange = async (blockId, newType) => {
    setBlocks(blocks.map(b => 
      b._id === blockId ? { ...b, type: newType } : b
    ));

    if (user?.token) {
      await updateBlock(blockId, { type: newType }, user.token);
    }
    setShowCommandMenu(false);
  };

  const handleAddBlock = async (afterBlockId, type = 'paragraph') => {
    if (!page || !user?.token) return;

    const afterBlock = afterBlockId ? blocks.find(b => b._id === afterBlockId) : null;
    const newOrder = afterBlock ? afterBlock.order + 1 : blocks.length;

    const updatedBlocks = blocks.map(b => 
      b.order >= newOrder ? { ...b, order: b.order + 1 } : b
    );

    const res = await createBlock({
      pageId: page._id,
      type,
      content: '',
      order: newOrder
    }, user.token);

    if (res.success) {
      const allBlocks = [...updatedBlocks, res.block].sort((a, b) => a.order - b.order);
      setBlocks(allBlocks);

      setTimeout(() => {
        const newBlockElement = blockRefs.current[res.block._id];
        if (newBlockElement) {
          newBlockElement.focus();
          setFocusedBlockId(res.block._id);
        }
      }, 0);
    }
  };

  const handleDeleteBlock = async (blockId) => {
    if (!user?.token || blocks.length === 1) return;

    const blockIndex = blocks.findIndex(b => b._id === blockId);
    const res = await deleteBlock(blockId, user.token);
    
    if (res.success) {
      setBlocks(blocks.filter(b => b._id !== blockId));

      if (blockIndex > 0) {
        const prevBlock = blocks[blockIndex - 1];
        setTimeout(() => {
          const prevBlockElement = blockRefs.current[prevBlock._id];
          if (prevBlockElement) {
            prevBlockElement.focus();
          }
        }, 0);
      }
    }
  };

  const handleKeyDown = (e, blockId, index) => {
    // Ctrl+Enter or Cmd+Enter creates a new block
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAddBlock(blockId);
    } else if (e.key === 'Backspace' && e.target.innerText === '') {
      e.preventDefault();
      if (blocks.length > 1) {
        handleDeleteBlock(blockId);
      }
    } else if (e.key === '/' && e.target.innerText === '') {
      e.preventDefault();
      setActiveBlockId(blockId);
      setShowCommandMenu(true);
      const rect = e.target.getBoundingClientRect();
      setCommandMenuPosition({ 
        top: rect.bottom + window.scrollY + 5, 
        left: rect.left + window.scrollX 
      });
    } else if (e.key === 'ArrowUp' && index > 0) {
      const caretPos = window.getSelection().anchorOffset;
      if (caretPos === 0) {
        e.preventDefault();
        const prevBlock = blocks[index - 1];
        const prevElement = blockRefs.current[prevBlock._id];
        if (prevElement) prevElement.focus();
      }
    } else if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      const text = e.target.innerText;
      const caretPos = window.getSelection().anchorOffset;
      if (caretPos === text.length) {
        e.preventDefault();
        const nextBlock = blocks[index + 1];
        const nextElement = blockRefs.current[nextBlock._id];
        if (nextElement) nextElement.focus();
      }
    }
  };

  const getBlockStyle = (type) => {
    switch (type) {
      case 'heading1':
        return 'text-4xl font-bold text-white';
      case 'heading2':
        return 'text-3xl font-bold text-white';
      case 'heading3':
        return 'text-2xl font-bold text-white';
      case 'quote':
        return 'border-l-4 border-blue-500 pl-4 italic text-gray-300';
      case 'code':
        return 'bg-neutral-800 border border-neutral-700 p-4 rounded-lg font-mono text-sm text-green-400';
      case 'callout':
        return 'bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg text-gray-200';
      case 'bulletList':
      case 'numberedList':
      case 'todo':
        return 'text-gray-200';
      default:
        return 'text-gray-200';
    }
  };

  const getPlaceholder = (type) => {
    switch (type) {
      case 'heading1': return 'Heading 1';
      case 'heading2': return 'Heading 2';
      case 'heading3': return 'Heading 3';
      case 'quote': return 'Empty quote';
      case 'code': return '// Write your code here';
      case 'callout': return 'Callout text';
      case 'bulletList': return 'List item';
      case 'numberedList': return 'List item';
      case 'todo': return 'To-do';
      default: return "Type '/' for commands, Ctrl+Enter for new block...";
    }
  };

  const renderBlock = (block, index) => {
    const BlockIcon = blockTypes.find(t => t.type === block.type)?.icon || Type;

    if (block.type === 'divider') {
      return (
        <div key={block._id} className="relative group my-6">
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
            <button className="p-1 hover:bg-neutral-700 rounded">
              <GripVertical className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="border-t-2 border-neutral-700"></div>
          <button
            onClick={() => handleDeleteBlock(block._id)}
            className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-900/30 rounded transition-opacity"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      );
    }

    return (
      <div key={block._id} className="relative group flex items-start gap-2 py-1">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-neutral-700 rounded cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </button>
          <button 
            onClick={() => handleAddBlock(block._id)}
            className="p-1 hover:bg-neutral-700 rounded"
            title="Add block below"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="flex-1 min-w-0">
          {block.type === 'bulletList' && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                }`}
                data-placeholder={getPlaceholder(block.type)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {block.type === 'numberedList' && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">{index + 1}.</span>
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                }`}
                data-placeholder={getPlaceholder(block.type)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {block.type === 'todo' && (
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1.5 w-4 h-4 rounded border-gray-600 bg-neutral-800" />
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                }`}
                data-placeholder={getPlaceholder(block.type)}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {!['bulletList', 'numberedList', 'todo'].includes(block.type) && (
            <div
              ref={el => blockRefs.current[block._id] = el}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
              onKeyDown={(e) => handleKeyDown(e, block._id, index)}
              onFocus={() => setFocusedBlockId(block._id)}
              className={`outline-none ${getBlockStyle(block.type)} ${
                !block.content ? 'empty-placeholder' : ''
              }`}
              data-placeholder={getPlaceholder(block.type)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          )}
        </div>

        <button
          onClick={() => handleDeleteBlock(block._id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-900/30 rounded transition-opacity"
          title="Delete block"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
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
      if (showCommandMenu && !event.target.closest('.command-menu-wrapper')) {
        setShowCommandMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu, showCommandMenu]);

  if (!page) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900 text-white">
      {/* Top Bar */}
      <div className="border-b border-neutral-800 px-6 py-3 flex items-center justify-between bg-neutral-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedEmoji}</span>
          <span className="text-sm text-gray-400">{pageTitle || 'Untitled'}</span>
          <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:bg-neutral-800 rounded transition-colors">
            <Lock className="w-3 h-3" />
            Private
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSavePage}
            disabled={saving}
            className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded text-white font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleToggleFavorite}
            className={`p-1.5 hover:bg-neutral-800 rounded transition-colors ${isFavorite ? 'text-yellow-400' : ''}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl py-1 z-50">
                <button 
                  onClick={handleDuplicate}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Copy link
                </button>
                <button className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <div className="h-px bg-neutral-700 my-1" />
                <button 
                  onClick={handleToggleFavorite}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  {isFavorite ? (
                    <>
                      <StarOff className="w-4 h-4" />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Add to favorites
                    </>
                  )}
                </button>
                <div className="h-px bg-neutral-700 my-1" />
                <button 
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
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
                <div className="grid grid-cols-10 gap-2">
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
            className="w-full text-5xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 mb-8"
          />

          {/* Render Blocks */}
          <div className="space-y-1">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>

          {/* Command Menu */}
          {showCommandMenu && (
            <div 
              className="command-menu-wrapper fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl p-2 w-80 z-50"
              style={{ top: commandMenuPosition.top, left: commandMenuPosition.left }}
            >
              <div className="max-h-96 overflow-y-auto">
                <div className="text-xs text-gray-500 px-3 py-2 font-medium">BASIC BLOCKS</div>
                {blockTypes.map((blockType, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBlockTypeChange(activeBlockId, blockType.type)}
                    className="w-full flex items-start gap-3 px-3 py-2 hover:bg-neutral-700 rounded text-left transition-colors"
                  >
                    <blockType.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{blockType.label}</div>
                      <div className="text-xs text-gray-500">{blockType.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Style for placeholder */}
      <style>{`
        .empty-placeholder[contenteditable]:empty:before {
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