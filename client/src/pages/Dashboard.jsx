import React, { useState, useEffect } from 'react';
import { 
  Home, FileText, Calendar, CheckSquare, Users, Settings, 
  Plus, Search, Inbox, ChevronDown, ChevronRight, Trash2, 
  Star, Clock, Edit3, Send, FilePlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePages } from '../contexts/PageContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { pages, trashPages, addPage, moveToTrash, restoreFromTrash, permanentDelete, fetchTrashPages, loading } = usePages();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'my-pages', 'trash', 'create'
  const [expandedSections, setExpandedSections] = useState({
    private: true,
    shared: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddPage = async () => {
    if (!user?.token) return;
    
    const newPage = { title: "Untitled", content: "" };
    const created = await addPage(newPage);
    
    if (!created) {
      console.error("Failed to create page");
      return;
    }
    
    // Navigate to the new page or show success message
    setCurrentView('my-pages');
  };

  const handleDeletePage = async (pageId) => {
    const success = await moveToTrash(pageId);
    if (success) {
      alert("Page moved to trash");
    }
  };

  const handleRestorePage = async (pageId) => {
    const success = await restoreFromTrash(pageId);
    if (success) {
      alert("Page restored successfully");
    }
  };

  const handlePermanentDelete = async (pageId) => {
    if (window.confirm("Are you sure? This action cannot be undone.")) {
      const success = await permanentDelete(pageId);
      if (success) {
        alert("Page permanently deleted");
      }
    }
  };

  // Fetch trash when viewing trash
  useEffect(() => {
    if (currentView === 'trash') {
      fetchTrashPages();
    }
  }, [currentView]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-900">
        <h1 className="text-2xl font-bold text-white">You are not logged in</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-neutral-800 flex flex-col overflow-hidden`}>
        {/* User Section */}
        <div className="p-3">
          <div className="flex items-center justify-between p-2 hover:bg-neutral-700 rounded cursor-pointer group">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                {user.firstname?.[0] || 'S'}
              </div>
              <span className="text-sm font-medium">{user.firstname}'s Workspace</span>
            </div>
            <div className="flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2">
          <div className="space-y-0.5">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button 
              onClick={() => setCurrentView('home')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded ${currentView === 'home' ? 'bg-neutral-700' : ''}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </button>
          </div>

          <div className="my-3 border-t border-neutral-700" />

          {/* New Options */}
          <div className="space-y-0.5 mb-3">
            <button 
              onClick={() => setCurrentView('create')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded ${currentView === 'create' ? 'bg-neutral-700' : ''}`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Create Page</span>
            </button>
            <button 
              onClick={() => setCurrentView('my-pages')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded ${currentView === 'my-pages' ? 'bg-neutral-700' : ''}`}
            >
              <FileText className="w-4 h-4" />
              <span>My Pages</span>
            </button>
            <button 
              onClick={() => setCurrentView('trash')}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded ${currentView === 'trash' ? 'bg-neutral-700' : ''}`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Trash</span>
            </button>
          </div>

          <div className="my-3 border-t border-neutral-700" />

          {/* Private Section */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSection('private')}
              className="w-full flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 hover:bg-neutral-700 rounded"
            >
              {expandedSections.private ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>Private</span>
            </button>
            {expandedSections.private && (
              <div className="mt-1 space-y-0.5">
                {loading ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">Loading pages...</div>
                ) : pages.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-gray-500">No pages yet</div>
                ) : (
                  pages.slice(0, 5).map(page => (
                    <button key={page._id} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded group">
                      <FileText className="w-4 h-4" />
                      <span className="flex-1 text-left truncate">{page.title}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Shared Section */}
          <div className="mb-4">
            <button 
              onClick={() => toggleSection('shared')}
              className="w-full flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 hover:bg-neutral-700 rounded"
            >
              {expandedSections.shared ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span>Shared</span>
            </button>
            {expandedSections.shared && (
              <div className="mt-1 space-y-0.5">
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded">
                  <Plus className="w-4 h-4" />
                  <span>Start collaborating</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-neutral-700">
          <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded mb-1">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-neutral-700 rounded"
          >
            <span className="flex-1 text-left text-s">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showSearch && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32">
            <div className="bg-neutral-800 border border-neutral-700 rounded-lg w-full max-w-2xl shadow-2xl">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-white"
                    autoFocus
                  />
                  <button 
                    onClick={() => setShowSearch(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <div className="max-w-6xl mx-auto px-20 py-16">
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-2">Good afternoon</h1>
                <p className="text-gray-400">Welcome back, {user.firstname}!</p>
              </div>

              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-medium text-gray-400">Recently visited</h2>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {pages.slice(0, 9).map((page) => (
                    <button 
                      key={page._id}
                      className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all"
                    >
                      <div className={`w-full h-full ${page.color || 'bg-gradient-to-br from-purple-500 to-pink-500'} flex items-center justify-center`}>
                        {page.emoji ? <span className="text-4xl">{page.emoji}</span> : <FileText className="w-8 h-8 text-white/50" />}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="text-sm font-medium text-left text-white truncate">{page.title}</div>
                        <div className="text-xs text-gray-300 text-left flex items-center gap-1">
                          <span className="text-xs">{user.firstname?.[0]}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={handleAddPage}
                    className="aspect-[4/3] rounded-lg border border-dashed border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CREATE PAGE VIEW */}
          {currentView === 'create' && (
            <div className="max-w-4xl mx-auto px-16 py-16">
              <h1 className="text-3xl font-bold mb-8">Create New Page</h1>
              <button 
                onClick={handleAddPage}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Page
              </button>
              <p className="text-gray-400 mt-4">Click the button above to create a new page</p>
            </div>
          )}

          {/* MY PAGES VIEW */}
          {currentView === 'my-pages' && (
            <div className="max-w-6xl mx-auto px-20 py-16">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Pages</h1>
                <p className="text-gray-400">All your pages in one place</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-400 py-12">Loading pages...</div>
              ) : pages.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">No pages yet</h3>
                  <p className="text-gray-500 mb-6">Create your first page to get started</p>
                  <button 
                    onClick={handleAddPage}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Page
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {pages.map((page) => (
                    <div 
                      key={page._id}
                      className="flex items-center justify-between p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg border border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-gray-500">
                            Updated {new Date(page.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeletePage(page._id)}
                        className="p-2 hover:bg-neutral-700 rounded text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRASH VIEW */}
          {currentView === 'trash' && (
            <div className="max-w-6xl mx-auto px-20 py-16">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Trash</h1>
                <p className="text-gray-400">Deleted pages are stored here for 30 days</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-400 py-12">Loading trash...</div>
              ) : trashPages.length === 0 ? (
                <div className="text-center py-12">
                  <Trash2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Trash is empty</h3>
                  <p className="text-gray-500">Deleted pages will appear here</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trashPages.map((page) => (
                    <div 
                      key={page._id}
                      className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg border border-neutral-700"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-300">{page.title}</h3>
                          <p className="text-sm text-gray-500">
                            Deleted {new Date(page.deletedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRestorePage(page._id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition-colors"
                        >
                          Restore
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(page._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm text-white transition-colors"
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}