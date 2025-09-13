import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Clock, 
  User, 
  Settings, 
  LogOut,
  FileText,
  Folder,
  MoreHorizontal,
  Edit3,
  Trash2,
  Share2,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock notes
  const [notes] = useState([
    { id: 1, title: "Project Planning Notes", content: "Key milestones and deliverables for Q1...", lastModified: "2 hours ago", favorite: true, folder: "Work", color: "bg-white" },
    { id: 2, title: "Meeting Notes - Team Sync", content: "Discussed upcoming features and bug fixes...", lastModified: "1 day ago", favorite: false, folder: "Work", color: "bg-white" },
    { id: 3, title: "Book Ideas", content: "Collection of interesting book recommendations...", lastModified: "3 days ago", favorite: true, folder: "Personal", color: "bg-white" },
    { id: 4, title: "Recipe Collection", content: "Favorite recipes from around the world...", lastModified: "1 week ago", favorite: false, folder: "Personal", color: "bg-white" }
  ]);

  const folders = ["All Notes", "Work", "Personal", "Archive"];

  const handleLogout = () => logout();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">NoteHub</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstname} {user?.lastname}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 p-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 mb-6 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>

          <nav className="space-y-2">
            {folders.map((folder) => (
              <button
                key={folder}
                className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Folder className="w-4 h-4 text-gray-500" />
                <span>{folder}</span>
                {folder === "All Notes" && (
                  <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {notes.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Favorites</span>
              </button>
              <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>Recent</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Filter className="w-4 h-4" />
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Notes Display */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `No notes match your search for "${searchQuery}"`
                  : 'Create your first note to get started'
                }
              </p>
              {!searchQuery && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Create your first note</span>
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {note.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{note.lastModified}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{note.folder}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between group ${index !== filteredNotes.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      {note.favorite && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{note.content}</p>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      <p>{note.lastModified}</p>
                      <p className="text-xs">{note.folder}</p>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-4">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Share2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
