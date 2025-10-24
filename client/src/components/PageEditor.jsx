import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Code, Minus, AlertCircle, ChevronRight, Save, MoreHorizontal,
  Star, Lock, Share2, Download, X, ChevronDown, Trash2, Plus,
  GripVertical, Copy, StarOff, Users, ChevronLeft, FileText
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
import ShareModal from './ShareModal';

export default function PageEditor({ page, onDelete, onUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('👋');
  const [pageTitle, setPageTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandMenuPosition, setCommandMenuPosition] = useState({ top: 0, left: 0 });
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState(null);
  const moreMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
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

  // Determine user permissions
  const isOwner = page?.isOwner === true || page?.userRole === 'owner' || page?.userRole === undefined || page?.userRole === null;
  const canEdit = isOwner || page?.userRole === 'editor' || page?.userRole === 'admin';
  const canManage = isOwner || page?.userRole === 'admin';
  const isViewer = page?.userRole === 'viewer';

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
    
    try {
      const res = await getPageBlocks(page._id, user.token);
      if (res.success) {
        setBlocks(res.blocks || []);
        if (!res.blocks || res.blocks.length === 0) {
          handleAddBlock(null);
        }
      }
    } catch (error) {
      console.error('Failed to load blocks:', error);
    }
  };

  // Export functions
  const exportToMarkdown = () => {
    let markdown = `# ${pageTitle}\n\n`;
    
    blocks.forEach(block => {
      switch (block.type) {
        case 'heading1':
          markdown += `# ${stripHtml(block.content)}\n\n`;
          break;
        case 'heading2':
          markdown += `## ${stripHtml(block.content)}\n\n`;
          break;
        case 'heading3':
          markdown += `### ${stripHtml(block.content)}\n\n`;
          break;
        case 'bulletList':
          markdown += `- ${stripHtml(block.content)}\n`;
          break;
        case 'numberedList':
          markdown += `1. ${stripHtml(block.content)}\n`;
          break;
        case 'todo':
          markdown += `- [ ] ${stripHtml(block.content)}\n`;
          break;
        case 'quote':
          markdown += `> ${stripHtml(block.content)}\n\n`;
          break;
        case 'code':
          markdown += `\`\`\`\n${stripHtml(block.content)}\n\`\`\`\n\n`;
          break;
        case 'callout':
          markdown += `> **Note:** ${stripHtml(block.content)}\n\n`;
          break;
        case 'divider':
          markdown += `---\n\n`;
          break;
        default:
          markdown += `${stripHtml(block.content)}\n\n`;
      }
    });

    downloadFile(markdown, `${pageTitle}.md`, 'text/markdown');
    setShowExportMenu(false);
  };

  const exportToText = () => {
    let text = `${pageTitle}\n${'='.repeat(pageTitle.length)}\n\n`;
    
    blocks.forEach(block => {
      text += `${stripHtml(block.content)}\n\n`;
    });

    downloadFile(text, `${pageTitle}.txt`, 'text/plain');
    setShowExportMenu(false);
  };

  const exportToHTML = () => {
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { font-size: 2.5em; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        h2 { font-size: 2em; color: #667eea; }
        h3 { font-size: 1.5em; color: #764ba2; }
        blockquote { border-left: 4px solid #667eea; padding-left: 20px; margin-left: 0; font-style: italic; background: #f9f9f9; padding: 10px; }
        code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: 'Monaco', 'Menlo', monospace; }
        pre { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 6px; overflow-x: auto; }
        .callout { background: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 10px 0; border-radius: 4px; }
        ul, ol { padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <h1>${pageTitle}</h1>
`;

    blocks.forEach(block => {
      switch (block.type) {
        case 'heading1':
          html += `    <h1>${block.content}</h1>\n`;
          break;
        case 'heading2':
          html += `    <h2>${block.content}</h2>\n`;
          break;
        case 'heading3':
          html += `    <h3>${block.content}</h3>\n`;
          break;
        case 'bulletList':
          html += `    <ul><li>${block.content}</li></ul>\n`;
          break;
        case 'numberedList':
          html += `    <ol><li>${block.content}</li></ol>\n`;
          break;
        case 'todo':
          html += `    <div style="display: flex; align-items: center; gap: 8px; margin: 5px 0;">
        <input type="checkbox" disabled>
        <span>${block.content}</span>
    </div>\n`;
          break;
        case 'quote':
          html += `    <blockquote>${block.content}</blockquote>\n`;
          break;
        case 'code':
          html += `    <pre><code>${escapeHtml(stripHtml(block.content))}</code></pre>\n`;
          break;
        case 'callout':
          html += `    <div class="callout">${block.content}</div>\n`;
          break;
        case 'divider':
          html += `    <hr>\n`;
          break;
        default:
          html += `    <p>${block.content}</p>\n`;
      }
    });

    html += `</body>\n</html>`;
    downloadFile(html, `${pageTitle}.html`, 'text/html');
    setShowExportMenu(false);
  };

  const exportToPDF = () => {
    // Simple PDF export using browser print functionality
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">${pageTitle}</h1>
        ${blocks.map(block => {
          switch (block.type) {
            case 'heading1':
              return `<h1 style="color: #333;">${block.content}</h1>`;
            case 'heading2':
              return `<h2 style="color: #667eea;">${block.content}</h2>`;
            case 'heading3':
              return `<h3 style="color: #764ba2;">${block.content}</h3>`;
            case 'bulletList':
              return `<ul><li>${block.content}</li></ul>`;
            case 'numberedList':
              return `<ol><li>${block.content}</li></ol>`;
            case 'todo':
              return `<div style="display: flex; align-items: center; gap: 8px; margin: 5px 0;">
                <input type="checkbox" disabled style="margin-right: 8px;">
                <span>${block.content}</span>
              </div>`;
            case 'quote':
              return `<blockquote style="border-left: 4px solid #667eea; padding-left: 20px; margin-left: 0; font-style: italic; background: #f9f9f9; padding: 10px;">${block.content}</blockquote>`;
            case 'code':
              return `<pre style="background: #f4f4f4; padding: 15px; border-radius: 4px; overflow-x: auto; font-family: monospace;">${escapeHtml(stripHtml(block.content))}</pre>`;
            case 'callout':
              return `<div style="background: #ebf8ff; border-left: 4px solid #4299e1; padding: 15px; margin: 10px 0; border-radius: 4px;">${block.content}</div>`;
            case 'divider':
              return `<hr style="border: none; border-top: 2px solid #e2e8f0; margin: 20px 0;">`;
            default:
              return `<p>${block.content}</p>`;
          }
        }).join('')}
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${pageTitle}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    setShowExportMenu(false);
  };

  // Utility functions for export
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSavePage = async () => {
    if (!page || !user?.token || !canEdit) return;
    
    setSaving(true);
    try {
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
    } catch (error) {
      alert('Failed to save page: ' + error.message);
    }
    setSaving(false);
  };

  const handleToggleFavorite = async () => {
    if (!page || !user?.token || !isOwner) return;
    
    try {
      const res = await toggleFavorite(page._id, user.token);
      if (res.success) {
        setIsFavorite(!isFavorite);
        if (onUpdate) {
          onUpdate({ ...page, isFavorite: !isFavorite });
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDuplicate = async () => {
    if (!page || !user?.token) return;
    
    try {
      const res = await duplicatePage(page._id, user.token);
      if (res.success) {
        alert('Page duplicated successfully!');
        if (onUpdate) {
          onUpdate(res.page);
        }
      } else {
        alert('Failed to duplicate page: ' + res.error);
      }
    } catch (error) {
      alert('Failed to duplicate page: ' + error.message);
    }
    setShowMoreMenu(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
    setShowMoreMenu(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/page/${page._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
    setShowMoreMenu(false);
  };

  // Add back to dashboard function
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBlockContentChange = async (blockId, content) => {
    if (!canEdit) return;
    
    const block = blocks.find(b => b._id === blockId);
    if (block && block.content === content) return;

    setBlocks(blocks.map(b => 
      b._id === blockId ? { ...b, content } : b
    ));

    if (user?.token) {
      try {
        await updateBlock(blockId, { content }, user.token);
      } catch (error) {
        console.error('Failed to update block:', error);
      }
    }
  };

  const handleBlockTypeChange = async (blockId, newType) => {
    if (!canEdit) return;
    
    setBlocks(blocks.map(b => 
      b._id === blockId ? { ...b, type: newType } : b
    ));

    if (user?.token) {
      try {
        await updateBlock(blockId, { type: newType }, user.token);
      } catch (error) {
        console.error('Failed to update block type:', error);
      }
    }
    setShowCommandMenu(false);
  };

  const handleAddBlock = async (afterBlockId, type = 'paragraph') => {
    if (!page || !user?.token || !canEdit) return;

    const afterBlock = afterBlockId ? blocks.find(b => b._id === afterBlockId) : null;
    const newOrder = afterBlock ? afterBlock.order + 1 : blocks.length;

    const updatedBlocks = blocks.map(b => 
      b.order >= newOrder ? { ...b, order: b.order + 1 } : b
    );

    try {
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
    } catch (error) {
      console.error('Failed to create block:', error);
    }
  };

  const handleDeleteBlock = async (blockId) => {
    if (!user?.token || blocks.length === 1 || !canEdit) return;

    const blockIndex = blocks.findIndex(b => b._id === blockId);
    
    try {
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
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleKeyDown = (e, blockId, index) => {
    if (!canEdit) return;
    
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
    if (block.type === 'divider') {
      return (
        <div key={block._id} className="relative group my-6">
          {canEdit && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
              <button className="p-1 hover:bg-neutral-700 rounded">
                <GripVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          <div className="border-t-2 border-neutral-700"></div>
          {canEdit && (
            <button
              onClick={() => handleDeleteBlock(block._id)}
              className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-900/30 rounded transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div key={block._id} className="relative group flex items-start gap-2 py-1">
        {canEdit && (
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
        )}
        
        <div className="flex-1 min-w-0">
          {block.type === 'bulletList' && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                } ${!canEdit ? 'cursor-default' : ''}`}
                data-placeholder={canEdit ? getPlaceholder(block.type) : ''}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {block.type === 'numberedList' && (
            <div className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">{index + 1}.</span>
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                } ${!canEdit ? 'cursor-default' : ''}`}
                data-placeholder={canEdit ? getPlaceholder(block.type) : ''}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {block.type === 'todo' && (
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                className="mt-1.5 w-4 h-4 rounded border-gray-600 bg-neutral-800" 
                disabled={!canEdit}
                onChange={(e) => {
                  // Handle checkbox state change if needed
                }}
              />
              <div
                ref={el => blockRefs.current[block._id] = el}
                contentEditable={canEdit}
                suppressContentEditableWarning
                onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
                onKeyDown={(e) => handleKeyDown(e, block._id, index)}
                onFocus={() => setFocusedBlockId(block._id)}
                className={`flex-1 outline-none ${getBlockStyle(block.type)} ${
                  !block.content ? 'empty-placeholder' : ''
                } ${!canEdit ? 'cursor-default' : ''}`}
                data-placeholder={canEdit ? getPlaceholder(block.type) : ''}
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            </div>
          )}
          {!['bulletList', 'numberedList', 'todo'].includes(block.type) && (
            <div
              ref={el => blockRefs.current[block._id] = el}
              contentEditable={canEdit}
              suppressContentEditableWarning
              onBlur={(e) => handleBlockContentChange(block._id, e.currentTarget.innerHTML)}
              onKeyDown={(e) => handleKeyDown(e, block._id, index)}
              onFocus={() => setFocusedBlockId(block._id)}
              className={`outline-none ${getBlockStyle(block.type)} ${
                !block.content ? 'empty-placeholder' : ''
              } ${!canEdit ? 'cursor-default' : ''}`}
              data-placeholder={canEdit ? getPlaceholder(block.type) : ''}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          )}
        </div>

        {canEdit && (
          <button
            onClick={() => handleDeleteBlock(block._id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-900/30 rounded transition-opacity"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        )}
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
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
      if (showCommandMenu && !event.target.closest('.command-menu-wrapper')) {
        setShowCommandMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu, showExportMenu, showCommandMenu]);

  if (!page) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-900 text-white">
        <div className="text-center">
          <p className="text-gray-400">Page not found</p>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-900 text-white">
      {/* Top Bar */}
      <div className="border-b border-neutral-800 px-6 py-3 flex items-center justify-between bg-neutral-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button 
            onClick={handleBackToDashboard}
            className="p-2 hover:bg-neutral-800 rounded transition-colors"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-2xl">{selectedEmoji}</span>
          <span className="text-sm text-gray-400">{pageTitle || 'Untitled'}</span>
          {page.userRole && page.userRole !== 'owner' && (
            <span className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-neutral-800 rounded">
              <Lock className="w-3 h-3" />
              {page.userRole.charAt(0).toUpperCase() + page.userRole.slice(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSavePage}
            disabled={saving || !canEdit}
            className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-medium flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          {canManage && (
            <button 
              onClick={handleShare}
              className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center gap-2 transition-colors"
              title="Share and manage collaborators"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
          {isOwner && (
            <button 
              onClick={handleToggleFavorite}
              className={`p-1.5 hover:bg-neutral-800 rounded transition-colors ${isFavorite ? 'text-yellow-400' : ''}`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
            </button>
          )}
          
          {/* Export Button */}
          <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 hover:bg-neutral-800 rounded transition-colors"
              title="Export page"
            >
              <Download className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl py-1 z-50">
                <button 
                  onClick={exportToMarkdown}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Export as Markdown
                </button>
                <button 
                  onClick={exportToText}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Export as Text
                </button>
                <button 
                  onClick={exportToHTML}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Export as HTML
                </button>
                <button 
                  onClick={exportToPDF}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>
            )}
          </div>

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
                {canManage && (
                  <button 
                    onClick={handleShare}
                    className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Manage sharing
                  </button>
                )}
                <button 
                  onClick={handleCopyLink}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-700 flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Copy link
                </button>
                {isOwner && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View-only banner for viewers */}
      {isViewer && (
        <div className="bg-yellow-900/20 border-b border-yellow-700/30 px-6 py-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-yellow-200">
            You have view-only access to this page
          </span>
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-16 py-20">
          <div className="mb-6 relative">
            <button 
              onClick={() => canEdit && setShowEmojiPicker(!showEmojiPicker)}
              className={`text-8xl ${canEdit ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'} transition-opacity`}
              disabled={!canEdit}
            >
              {selectedEmoji}
            </button>
            
            {showEmojiPicker && canEdit && (
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
            className={`w-full text-5xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 mb-8 ${!canEdit ? 'cursor-default' : ''}`}
            disabled={!canEdit}
          />

          {/* Render Blocks */}
          <div className="space-y-1">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>

          {/* Command Menu - only show if can edit */}
          {showCommandMenu && canEdit && (
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

      {/* Share Modal */}
      <ShareModal 
  page={page} 
  isOpen={showShareModal} 
  onClose={() => setShowShareModal(false)}
  onUpdate={onUpdate} // Add this if you want to update the page in parent
/>

      {/* Style for placeholder */}
      <style>{`
        .empty-placeholder[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable="false"] {
          cursor: default;
        }
      `}</style>
    </div>
  );
}