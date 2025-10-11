import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getUserPages, 
  getTrashPages,
  getFavoritePages,
  createPage,
  updatePage as updatePageAPI,
  deletePage as deletePageAPI,
  restorePage as restorePageAPI,
  permanentDeletePage as permanentDeletePageAPI,
  toggleFavorite as toggleFavoriteAPI,
  duplicatePage as duplicatePageAPI
} from "../services/api";
import { useAuth } from "./AuthContext";

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [favoritePages, setFavoritePages] = useState([]);
  const [trashPages, setTrashPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active pages when user logs in
  useEffect(() => {
    if (!user?.token) return;

    const fetchPages = async () => {
      setLoading(true);
      setError(null);
      const res = await getUserPages(user.token);

      if (res.success && Array.isArray(res.pages)) {
        setPages(res.pages);
      } else {
        console.error("Error fetching pages:", res.error);
        setError(res.error);
        setPages([]);
      }

      setLoading(false);
    };

    fetchPages();
  }, [user]);

  // Fetch pages with filters
  const fetchPages = async (filters = {}) => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);
    const res = await getUserPages(user.token, filters);

    if (res.success && Array.isArray(res.pages)) {
      setPages(res.pages);
      return res.pages;
    } else {
      console.error("Error fetching pages:", res.error);
      setError(res.error);
      setPages([]);
      return [];
    }

    setLoading(false);
  };

  // Fetch favorite pages
  const fetchFavoritePages = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);
    const res = await getFavoritePages(user.token);

    if (res.success && Array.isArray(res.pages)) {
      setFavoritePages(res.pages);
      return res.pages;
    } else {
      console.error("Error fetching favorite pages:", res.error);
      setError(res.error);
      setFavoritePages([]);
      return [];
    }

    setLoading(false);
  };

  // Fetch trash pages
  const fetchTrashPages = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);
    const res = await getTrashPages(user.token);

    if (res.success && Array.isArray(res.pages)) {
      setTrashPages(res.pages);
      return res.pages;
    } else {
      console.error("Error fetching trash pages:", res.error);
      setError(res.error);
      setTrashPages([]);
      return [];
    }

    setLoading(false);
  };

  // Create new page
  const addPage = async (pageData) => {
    if (!user?.token) return null;

    setLoading(true);
    setError(null);
    const res = await createPage(pageData, user.token);
    
    if (res.success && res.page) {
      setPages(prev => [res.page, ...prev]);
      setCurrentPage(res.page);
      setLoading(false);
      return res.page;
    } else {
      console.error("Error creating page:", res.error);
      setError(res.error);
      setLoading(false);
      return null;
    }
  };

  // Update page
  const updatePage = async (pageId, pageData) => {
    if (!user?.token) return false;

    setError(null);
    const res = await updatePageAPI(pageId, pageData, user.token);
    
    if (res.success && res.page) {
      // Update in pages list
      setPages(prev => prev.map(p => p._id === pageId ? res.page : p));
      
      // Update in favorites if it's there
      setFavoritePages(prev => prev.map(p => p._id === pageId ? res.page : p));
      
      // Update current page if it's the one being edited
      if (currentPage?._id === pageId) {
        setCurrentPage(res.page);
      }
      
      return true;
    } else {
      console.error("Error updating page:", res.error);
      setError(res.error);
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (pageId) => {
    if (!user?.token) return false;

    setError(null);
    const res = await toggleFavoriteAPI(pageId, user.token);
    
    if (res.success && res.page) {
      // Update in pages list
      setPages(prev => prev.map(p => p._id === pageId ? res.page : p));
      
      // Update favorites list
      if (res.page.isFavorite) {
        setFavoritePages(prev => [res.page, ...prev]);
      } else {
        setFavoritePages(prev => prev.filter(p => p._id !== pageId));
      }
      
      // Update current page if it's the one being edited
      if (currentPage?._id === pageId) {
        setCurrentPage(res.page);
      }
      
      return true;
    } else {
      console.error("Error toggling favorite:", res.error);
      setError(res.error);
      return false;
    }
  };

  // Duplicate page
  const duplicatePage = async (pageId) => {
    if (!user?.token) return null;

    setLoading(true);
    setError(null);
    const res = await duplicatePageAPI(pageId, user.token);
    
    if (res.success && res.page) {
      setPages(prev => [res.page, ...prev]);
      setLoading(false);
      return res.page;
    } else {
      console.error("Error duplicating page:", res.error);
      setError(res.error);
      setLoading(false);
      return null;
    }
  };

  // Move page to trash (soft delete)
  const moveToTrash = async (pageId) => {
    if (!user?.token) return false;

    setError(null);
    const res = await deletePageAPI(pageId, user.token);
    
    if (res.success) {
      setPages(prev => prev.filter(p => p._id !== pageId));
      setFavoritePages(prev => prev.filter(p => p._id !== pageId));
      
      // Clear current page if it's the one being deleted
      if (currentPage?._id === pageId) {
        setCurrentPage(null);
      }
      
      return true;
    } else {
      console.error("Error deleting page:", res.error);
      setError(res.error);
      return false;
    }
  };

  // Restore page from trash
  const restoreFromTrash = async (pageId) => {
    if (!user?.token) return false;

    setError(null);
    const res = await restorePageAPI(pageId, user.token);
    
    if (res.success) {
      setTrashPages(prev => prev.filter(p => p._id !== pageId));
      
      // Refetch active pages to include restored page
      const pagesRes = await getUserPages(user.token);
      if (pagesRes.success) {
        setPages(pagesRes.pages);
      }
      
      return true;
    } else {
      console.error("Error restoring page:", res.error);
      setError(res.error);
      return false;
    }
  };

  // Permanently delete page
  const permanentDelete = async (pageId) => {
    if (!user?.token) return false;

    setError(null);
    const res = await permanentDeletePageAPI(pageId, user.token);
    
    if (res.success) {
      setTrashPages(prev => prev.filter(p => p._id !== pageId));
      return true;
    } else {
      console.error("Error permanently deleting page:", res.error);
      setError(res.error);
      return false;
    }
  };

  // Search pages
  const searchPages = async (searchTerm) => {
    if (!user?.token) return [];
    
    setLoading(true);
    setError(null);
    const res = await getUserPages(user.token, { search: searchTerm });

    if (res.success && Array.isArray(res.pages)) {
      setLoading(false);
      return res.pages;
    } else {
      console.error("Error searching pages:", res.error);
      setError(res.error);
      setLoading(false);
      return [];
    }
  };

  // Refresh all data
  const refreshPages = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);

    try {
      const [pagesRes, favoritesRes] = await Promise.all([
        getUserPages(user.token),
        getFavoritePages(user.token)
      ]);

      if (pagesRes.success && Array.isArray(pagesRes.pages)) {
        setPages(pagesRes.pages);
      }

      if (favoritesRes.success && Array.isArray(favoritesRes.pages)) {
        setFavoritePages(favoritesRes.pages);
      }
    } catch (err) {
      console.error("Error refreshing pages:", err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <PageContext.Provider value={{ 
      // State
      pages, 
      favoritePages,
      trashPages,
      currentPage,
      loading,
      error,
      
      // Actions
      addPage,
      updatePage,
      duplicatePage,
      moveToTrash,
      restoreFromTrash,
      permanentDelete,
      toggleFavorite,
      
      // Fetch methods
      fetchPages,
      fetchFavoritePages,
      fetchTrashPages,
      searchPages,
      refreshPages,
      
      // Current page management
      setCurrentPage
    }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within a PageProvider');
  }
  return context;
};