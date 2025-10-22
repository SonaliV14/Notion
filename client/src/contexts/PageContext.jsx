import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getUserPages, 
  createPage, 
  updatePage, 
  deletePage, 
  restorePage, 
  permanentDeletePage,
  duplicatePage,
  toggleFavorite,
  getSharedPages,
  getTrashPages,
  getCollaboratedPages
} from '../services/api';
import { useAuth } from './AuthContext';

const PageContext = createContext();

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
};

export const PageProvider = ({ children }) => {
  const [pages, setPages] = useState([]);
  const [sharedPages, setSharedPages] = useState([]);
  const [trashPages, setTrashPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch user's own pages
  const fetchPages = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    const res = await getUserPages(user.token);
    if (res.success) {
      // Add isOwner flag to all pages
      const pagesWithOwner = res.pages.map(page => ({
        ...page,
        isOwner: true,
        userRole: 'owner'
      }));
      setPages(pagesWithOwner);
    }
    setLoading(false);
  };

  // Fetch shared pages
  const fetchSharedPages = async () => {
    if (!user?.token) return;
    
    try {
      const res = await getSharedPages(user.token);
      if (res.success) {
        // Add userRole and isOwner flags
        const sharedWithRoles = res.pages.map(page => ({
          ...page,
          isOwner: page.owner?._id === user._id,
          userRole: page.owner?._id === user._id ? 'owner' : 'editor'
        }));
        setSharedPages(sharedWithRoles);
      }
    } catch (error) {
      console.error('Failed to fetch shared pages:', error);
    }
  };

  // Fetch collaborated pages (more accurate role information)
  const fetchCollaboratedPages = async () => {
    if (!user?.token) return;
    
    try {
      const res = await getCollaboratedPages(user.token);
      if (res.success) {
        // Update shared pages with accurate roles from collaborations
        const collaboratedPages = res.pages.map(collabPage => ({
          ...collabPage,
          isOwner: false, // These are always shared pages, not owned
          userRole: collabPage.userRole || 'editor'
        }));
        
        setSharedPages(collaboratedPages);
      }
    } catch (error) {
      console.error('Failed to fetch collaborated pages:', error);
    }
  };

  // Fetch trash pages
  const fetchTrashPages = async () => {
    if (!user?.token) return;
    
    const res = await getTrashPages(user.token);
    if (res.success) {
      setTrashPages(res.pages);
    }
  };

  // Add a new page
  const addPage = async (pageData) => {
    if (!user?.token) return null;
    
    const res = await createPage(pageData, user.token);
    if (res.success) {
      const newPage = {
        ...res.page,
        isOwner: true,
        userRole: 'owner'
      };
      setPages(prev => [newPage, ...prev]);
      return newPage;
    }
    return null;
  };

  // Update a page
  const updatePageContext = async (pageId, pageData) => {
    if (!user?.token) return false;
    
    const res = await updatePage(pageId, pageData, user.token);
    if (res.success) {
      setPages(prev => prev.map(page => 
        page._id === pageId ? { ...page, ...res.page } : page
      ));
      setSharedPages(prev => prev.map(page => 
        page._id === pageId ? { ...page, ...res.page } : page
      ));
      return true;
    }
    return false;
  };

  // Move page to trash
  const moveToTrash = async (pageId) => {
    if (!user?.token) return false;
    
    const res = await deletePage(pageId, user.token);
    if (res.success) {
      setPages(prev => prev.filter(page => page._id !== pageId));
      setSharedPages(prev => prev.filter(page => page._id !== pageId));
      await fetchTrashPages();
      return true;
    }
    return false;
  };

  // Restore page from trash
  const restoreFromTrash = async (pageId) => {
    if (!user?.token) return false;
    
    const res = await restorePage(pageId, user.token);
    if (res.success) {
      setTrashPages(prev => prev.filter(page => page._id !== pageId));
      await fetchPages();
      return true;
    }
    return false;
  };

  // Permanently delete page
  const permanentDelete = async (pageId) => {
    if (!user?.token) return false;
    
    const res = await permanentDeletePage(pageId, user.token);
    if (res.success) {
      setTrashPages(prev => prev.filter(page => page._id !== pageId));
      return true;
    }
    return false;
  };

  // Duplicate page
  const duplicatePageContext = async (pageId) => {
    if (!user?.token) return false;
    
    const res = await duplicatePage(pageId, user.token);
    if (res.success) {
      const duplicatedPage = {
        ...res.page,
        isOwner: true,
        userRole: 'owner'
      };
      setPages(prev => [duplicatedPage, ...prev]);
      return true;
    }
    return false;
  };

  // Toggle favorite
  const toggleFavoriteContext = async (pageId) => {
    if (!user?.token) return false;
    
    const res = await toggleFavorite(pageId, user.token);
    if (res.success) {
      setPages(prev => prev.map(page => 
        page._id === pageId ? { ...page, isFavorite: res.page.isFavorite } : page
      ));
      setSharedPages(prev => prev.map(page => 
        page._id === pageId ? { ...page, isFavorite: res.page.isFavorite } : page
      ));
      return true;
    }
    return false;
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchPages();
      fetchCollaboratedPages();
    }
  }, [user]);

  const value = {
    pages,
    sharedPages,
    trashPages,
    loading,
    fetchPages,
    fetchSharedPages,
    fetchCollaboratedPages,
    fetchTrashPages,
    addPage,
    updatePage: updatePageContext,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    duplicatePage: duplicatePageContext,
    toggleFavorite: toggleFavoriteContext
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};