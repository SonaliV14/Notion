import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// -------------------- AUTH APIs --------------------

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

export const getSharedPages = async (token) => {
  try {
    const { data } = await api.get("/pages/shared", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch shared pages",
    };
  }
};

export const getFavoritePages = async (token) => {
  try {
    const { data } = await api.get("/pages/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch favorite pages",
    };
  }
};

export const getTrashPages = async (token) => {
  try {
    const { data } = await api.get("/pages/trash", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch trash pages",
    };
  }
};

export const searchPages = async (query, token) => {
  try {
    const { data } = await api.get(`/pages/search?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Search failed",
    };
  }
};

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

export const toggleFavorite = async (pageId, token) => {
  try {
    const { data } = await api.patch(`/pages/${pageId}/favorite`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to toggle favorite",
    };
  }
};

export const duplicatePage = async (pageId, token) => {
  try {
    const { data } = await api.post(`/pages/${pageId}/duplicate`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to duplicate page",
    };
  }
};

export const sharePage = async (pageId, emails, permission, token) => {
  try {
    const { data } = await api.post(`/pages/${pageId}/share`, 
      { emails, permission }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to share page",
    };
  }
};

export const removeSharedUser = async (pageId, userId, token) => {
  try {
    const { data } = await api.delete(`/pages/${pageId}/share/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to remove user",
    };
  }
};

export const generateShareLink = async (pageId, token) => {
  try {
    const { data } = await api.post(`/pages/${pageId}/share-link`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to generate share link",
    };
  }
};

export const disableShareLink = async (pageId, token) => {
  try {
    const { data } = await api.delete(`/pages/${pageId}/share-link`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to disable share link",
    };
  }
};

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

export const restorePage = async (pageId, token) => {
  try {
    const { data } = await api.patch(`/pages/${pageId}/restore`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to restore page",
    };
  }
};

export const permanentDeletePage = async (pageId, token) => {
  try {
    const { data } = await api.delete(`/pages/${pageId}/permanent`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to permanently delete page",
    };
  }
};

// -------------------- BLOCK APIs --------------------

export const getPageBlocks = async (pageId, token) => {
  try {
    const { data } = await api.get(`/blocks/page/${pageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch blocks",
    };
  }
};

export const createBlock = async (blockData, token) => {
  try {
    const { data } = await api.post("/blocks", blockData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to create block",
    };
  }
};

export const updateBlock = async (blockId, blockData, token) => {
  try {
    const { data } = await api.put(`/blocks/${blockId}`, blockData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to update block",
    };
  }
};

export const deleteBlock = async (blockId, token) => {
  try {
    const { data } = await api.delete(`/blocks/${blockId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to delete block",
    };
  }
};

export const reorderBlocks = async (pageId, blockOrders, token) => {
  try {
    const { data } = await api.patch(`/blocks/reorder/${pageId}`, 
      { blockOrders }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to reorder blocks",
    };
  }
};

// -------------------- INVITE APIs --------------------

export const acceptInvite = async (inviteToken, userToken) => {
  try {
    const { data } = await api.post(
      `/invites/accept/${inviteToken}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to accept invitation",
    };
  }
};

export const rejectInvite = async (inviteToken, userToken) => {
  try {
    const { data } = await api.post(
      `/invites/reject/${inviteToken}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Failed to reject invitation",
    };
  }
};