const API_URL = 'http://localhost:5000/api';

// ==================== PAGE APIs ====================

// Create a new page
export const createPage = async (pageData, token) => {
  try {
    const res = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pageData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get all pages with optional filters
export const getUserPages = async (token, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.favorite) queryParams.append('favorite', params.favorite);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}/pages?${queryString}` : `${API_URL}/pages`;

    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get favorite pages only
export const getFavoritePages = async (token) => {
  try {
    const res = await fetch(`${API_URL}/pages/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get trash pages
export const getTrashPages = async (token) => {
  try {
    const res = await fetch(`${API_URL}/pages/trash`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get single page with blocks
export const getPage = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Update page metadata
export const updatePage = async (pageId, pageData, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(pageData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Toggle favorite status
export const toggleFavorite = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}/favorite`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Duplicate page
export const duplicatePage = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}/duplicate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Soft delete page (move to trash)
export const deletePage = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Restore page from trash
export const restorePage = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}/restore`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Permanently delete page
export const permanentDeletePage = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/pages/${pageId}/permanent`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ==================== BLOCK APIs ====================

// Create a new block
export const createBlock = async (blockData, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blockData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Get all blocks for a page
export const getPageBlocks = async (pageId, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks/page/${pageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Update a single block
export const updateBlock = async (blockId, blockData, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks/${blockId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blockData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Bulk update blocks (for reordering)
export const bulkUpdateBlocks = async (pageId, blocks, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks/bulk/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pageId, blocks })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Soft delete a block
export const deleteBlock = async (blockId, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks/${blockId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Permanently delete a block
export const permanentDeleteBlock = async (blockId, token) => {
  try {
    const res = await fetch(`${API_URL}/blocks/${blockId}/permanent`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ==================== HELPER FUNCTIONS ====================

// Export API_URL for direct use if needed
export { API_URL };

// Error handler wrapper
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  };
};