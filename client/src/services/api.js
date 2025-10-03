import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// -------------------- AUTH APIs --------------------

// Signup API
export const signup = async (formData) => {
  try {
    const { data } = await api.post("/auth/signup", formData);
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Signup failed",
    };
  }
};

// Login API
export const login = async (formData) => {
  try {
    const { data } = await api.post("/auth/login", formData);
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Login failed",
    };
  }
};

// -------------------- PAGE APIs --------------------

// Get pages of logged-in user
export const getUserPages = async (token) => {
  try {
    const { data } = await api.get("/pages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch pages",
    };
  }
};

// Create a new page
export const createPage = async (pageData, token) => {
  try {
    const { data } = await api.post("/pages", pageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to create page",
    };
  }
};

// Update a page
export const updatePage = async (pageId, pageData, token) => {
  try {
    const { data } = await api.put(`/pages/${pageId}`, pageData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to update page",
    };
  }
};

// Delete a page
export const deletePage = async (pageId, token) => {
  try {
    const { data } = await api.delete(`/pages/${pageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to delete page",
    };
  }
};

// Get single page
export const getPage = async (pageId, token) => {
  try {
    const { data } = await api.get(`/pages/${pageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch page",
    };
  }
};