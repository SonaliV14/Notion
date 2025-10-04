import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getUserPages, 
  getTrashPages,
  createPage,
  deletePage as deletePageAPI,
  restorePage as restorePageAPI,
  permanentDeletePage as permanentDeletePageAPI
} from "../services/api";
import { useAuth } from "./AuthContext";

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [trashPages, setTrashPages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch active pages when user logs in
  useEffect(() => {
    if (!user?.token) return;

    const fetchPages = async () => {
      setLoading(true);
      const res = await getUserPages(user.token);

      if (res.success && Array.isArray(res.pages)) {
        setPages(res.pages);
      } else {
        console.error("Error fetching pages:", res.error);
        setPages([]);
      }

      setLoading(false);
    };

    fetchPages();
  }, [user]);

  // Fetch trash pages
  const fetchTrashPages = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    const res = await getTrashPages(user.token);

    if (res.success && Array.isArray(res.pages)) {
      setTrashPages(res.pages);
    } else {
      console.error("Error fetching trash pages:", res.error);
      setTrashPages([]);
    }

    setLoading(false);
  };

  // Create new page
  const addPage = async (pageData) => {
    if (!user?.token) return;

    const res = await createPage(pageData, user.token);
    if (res.success && res.page) {
      setPages(prev => [res.page, ...prev]);
      return res.page;
    } else {
      console.error("Error creating page:", res.error);
      return null;
    }
  };

  // Move page to trash (soft delete)
  const moveToTrash = async (pageId) => {
    if (!user?.token) return;

    const res = await deletePageAPI(pageId, user.token);
    if (res.success) {
      setPages(prev => prev.filter(p => p._id !== pageId));
      return true;
    } else {
      console.error("Error deleting page:", res.error);
      return false;
    }
  };

  // Restore page from trash
  const restoreFromTrash = async (pageId) => {
    if (!user?.token) return;

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
      return false;
    }
  };

  // Permanently delete page
  const permanentDelete = async (pageId) => {
    if (!user?.token) return;

    const res = await permanentDeletePageAPI(pageId, user.token);
    if (res.success) {
      setTrashPages(prev => prev.filter(p => p._id !== pageId));
      return true;
    } else {
      console.error("Error permanently deleting page:", res.error);
      return false;
    }
  };

  return (
    <PageContext.Provider value={{ 
      pages, 
      trashPages,
      addPage, 
      moveToTrash,
      restoreFromTrash,
      permanentDelete,
      fetchTrashPages,
      loading 
    }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => useContext(PageContext);