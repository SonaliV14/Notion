import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserPages, createPage } from "../services/api";
import { useAuth } from "./AuthContext";

const PageContext = createContext();

export const PageProvider = ({ children }) => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pages when user logs in
  useEffect(() => {
    if (!user?.token) return;

    const fetchPages = async () => {
      setLoading(true);
      const res = await getUserPages(user.token);

      if (res.success && Array.isArray(res.pages)) {
        setPages(res.pages);
      } else {
        console.error("Error fetching pages:", res.error);
        setPages([]); // always fallback to empty array
      }

      setLoading(false);
    };

    fetchPages();
  }, [user]);

  // Create new page
  const addPage = async (pageData) => {
    if (!user?.token) return;

    const res = await createPage(pageData, user.token);
    if (res.success && res.page) {
      setPages(prev => [res.page, ...prev]);
    } else {
      console.error("Error creating page:", res.error);
    }
  };

  return (
    <PageContext.Provider value={{ pages, addPage, loading }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => useContext(PageContext);
