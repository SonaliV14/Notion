import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Create separate axios instances for different purposes

// 1. Public API instance (for auth routes - no token needed)
const publicApi = axios.create({
  baseURL: BASE_URL,
});

// 2. Protected API instance (for routes that need token)
const protectedApi = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor for protected routes only
protectedApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for protected routes only
protectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// -------------------- AUTH APIs (use publicApi) --------------------

export const signup = async (formData) => {
  try {
    const { data } = await publicApi.post("/auth/signup", formData);
    
    // If signup successful, store token for future requests
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
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
    const { data } = await publicApi.post("/auth/login", formData);
    
    // If login successful, store token for future requests
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error || "Login failed",
    };
  }
};

// -------------------- PAGE APIs (use protectedApi) --------------------

export const getUserPages = async () => {
  try {
    const { data } = await protectedApi.get("/pages");
    return data;
  } catch (err) {
    console.error('Get user pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch pages",
    };
  }
};

export const getSharedPages = async () => {
  try {
    const { data } = await protectedApi.get("/pages/shared");
    return data;
  } catch (err) {
    console.error('Get shared pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch shared pages",
    };
  }
};

export const getFavoritePages = async () => {
  try {
    const { data } = await protectedApi.get("/pages/favorites");
    return data;
  } catch (err) {
    console.error('Get favorite pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch favorite pages",
    };
  }
};

export const getTrashPages = async () => {
  try {
    const { data } = await protectedApi.get("/pages/trash");
    return data;
  } catch (err) {
    console.error('Get trash pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch trash pages",
    };
  }
};

export const searchPages = async (query) => {
  try {
    const { data } = await protectedApi.get(`/pages/search?query=${encodeURIComponent(query)}`);
    return data;
  } catch (err) {
    console.error('Search pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Search failed",
    };
  }
};

export const createPage = async (pageData) => {
  try {
    const { data } = await protectedApi.post("/pages", pageData);
    return data;
  } catch (err) {
    console.error('Create page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to create page",
    };
  }
};

export const getPage = async (pageId) => {
  try {
    const { data } = await protectedApi.get(`/pages/${pageId}`);
    return data;
  } catch (err) {
    console.error('Get page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch page",
    };
  }
};

export const updatePage = async (pageId, pageData) => {
  try {
    const { data } = await protectedApi.put(`/pages/${pageId}`, pageData);
    return data;
  } catch (err) {
    console.error('Update page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to update page",
    };
  }
};

export const toggleFavorite = async (pageId) => {
  try {
    const { data } = await protectedApi.patch(`/pages/${pageId}/favorite`, {});
    return data;
  } catch (err) {
    console.error('Toggle favorite error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to toggle favorite",
    };
  }
};

export const duplicatePage = async (pageId) => {
  try {
    const { data } = await protectedApi.post(`/pages/${pageId}/duplicate`, {});
    return data;
  } catch (err) {
    console.error('Duplicate page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to duplicate page",
    };
  }
};

export const sharePage = async (pageId, emails, permission) => {
  try {
    const { data } = await protectedApi.post(
      `/pages/${pageId}/share`, 
      { emails, permission }
    );
    return data;
  } catch (err) {
    console.error('Share page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to share page",
    };
  }
};

export const removeSharedUser = async (pageId, userId) => {
  try {
    const { data } = await protectedApi.delete(`/pages/${pageId}/share/${userId}`);
    return data;
  } catch (err) {
    console.error('Remove shared user error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to remove user",
    };
  }
};

export const generateShareLink = async (pageId) => {
  try {
    const { data } = await protectedApi.post(`/pages/${pageId}/share-link`, {});
    return data;
  } catch (err) {
    console.error('Generate share link error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to generate share link",
    };
  }
};

export const disableShareLink = async (pageId) => {
  try {
    const { data } = await protectedApi.delete(`/pages/${pageId}/share-link`);
    return data;
  } catch (err) {
    console.error('Disable share link error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to disable share link",
    };
  }
};

export const deletePage = async (pageId) => {
  try {
    const { data } = await protectedApi.delete(`/pages/${pageId}`);
    return data;
  } catch (err) {
    console.error('Delete page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to delete page",
    };
  }
};

export const restorePage = async (pageId) => {
  try {
    const { data } = await protectedApi.patch(`/pages/${pageId}/restore`, {});
    return data;
  } catch (err) {
    console.error('Restore page error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to restore page",
    };
  }
};

export const permanentDeletePage = async (pageId) => {
  try {
    const { data } = await protectedApi.delete(`/pages/${pageId}/permanent`);
    return data;
  } catch (err) {
    console.error('Permanent delete error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to permanently delete page",
    };
  }
};

// -------------------- BLOCK APIs (use protectedApi) --------------------

export const getPageBlocks = async (pageId) => {
  try {
    const { data } = await protectedApi.get(`/blocks/page/${pageId}`);
    return data;
  } catch (err) {
    console.error('Get page blocks error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch blocks",
    };
  }
};

export const createBlock = async (blockData) => {
  try {
    const { data } = await protectedApi.post("/blocks", blockData);
    return data;
  } catch (err) {
    console.error('Create block error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to create block",
    };
  }
};

export const updateBlock = async (blockId, blockData) => {
  try {
    const { data } = await protectedApi.put(`/blocks/${blockId}`, blockData);
    return data;
  } catch (err) {
    console.error('Update block error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to update block",
    };
  }
};

export const deleteBlock = async (blockId) => {
  try {
    const { data } = await protectedApi.delete(`/blocks/${blockId}`);
    return data;
  } catch (err) {
    console.error('Delete block error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to delete block",
    };
  }
};

export const reorderBlocks = async (pageId, blockOrders) => {
  try {
    const { data } = await protectedApi.patch(
      `/blocks/reorder/${pageId}`, 
      { blockOrders }
    );
    return data;
  } catch (err) {
    console.error('Reorder blocks error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to reorder blocks",
    };
  }
};

// -------------------- COLLABORATOR APIs (use protectedApi) --------------------

export const inviteCollaborator = async (pageId, email, role) => {
  try {
    const { data } = await protectedApi.post(
      `/collaborators/pages/${pageId}/collaborators`,
      { email, role }
    );
    return data;
  } catch (err) {
    console.error('Invite collaborator error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to invite collaborator",
    };
  }
};

export const getPageCollaborators = async (pageId) => {
  try {
    const { data } = await protectedApi.get(`/collaborators/pages/${pageId}/collaborators`);
    return data;
  } catch (err) {
    console.error('Get page collaborators error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch collaborators",
    };
  }
};

export const updateCollaboratorRole = async (collaboratorId, role) => {
  try {
    const { data } = await protectedApi.patch(
      `/collaborators/collaborators/${collaboratorId}/role`,
      { role }
    );
    return data;
  } catch (err) {
    console.error('Update collaborator role error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to update role",
    };
  }
};

export const removeCollaborator = async (collaboratorId) => {
  try {
    const { data } = await protectedApi.delete(`/collaborators/collaborators/${collaboratorId}`);
    return data;
  } catch (err) {
    console.error('Remove collaborator error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to remove collaborator",
    };
  }
};

// -------------------- INVITE APIs (use protectedApi) --------------------

export const acceptInvite = async (inviteToken) => {
  try {
    const { data } = await protectedApi.post(`/collaborators/invites/accept/${inviteToken}`, {});
    return data;
  } catch (err) {
    console.error('Accept invite error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to accept invitation",
    };
  }
};

export const rejectInvite = async (inviteToken) => {
  try {
    const { data } = await protectedApi.post(`/collaborators/invites/reject/${inviteToken}`, {});
    return data;
  } catch (err) {
    console.error('Reject invite error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to reject invitation",
    };
  }
};

// Get invite details by token
export const getInviteDetails = async (inviteToken) => {
  try {
    const { data } = await protectedApi.get(`/collaborators/invites/details/${inviteToken}`);
    return data;
  } catch (err) {
    console.error('Get invite details error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch invite details",
    };
  }
};

// Get pending invitations for current user
export const getPendingInvites = async () => {
  try {
    const { data } = await protectedApi.get(`/collaborators/invites/pending`);
    return data;
  } catch (err) {
    console.error('Get pending invites error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch pending invites",
    };
  }
};

// Get collaborated pages with role information
export const getCollaboratedPages = async () => {
  try {
    const { data } = await protectedApi.get(`/collaborators/collaborated-pages`);
    return data;
  } catch (err) {
    console.error('Get collaborated pages error:', err);
    return {
      success: false,
      error: err.response?.data?.error || "Failed to fetch collaborated pages",
    };
  }
};

export default protectedApi;