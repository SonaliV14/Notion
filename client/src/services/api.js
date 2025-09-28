import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const signup = async (formData) => {
  try {
    const { data } = await api.post("/auth/signup", formData);
    return data; 
  } catch (err) {
    return { success: false, error: err.response?.data?.error || "Signup failed" };
  }
};

export const login = async (formData) => {
  try {
    const { data } = await api.post("/auth/login", formData);
    return data; 
  } catch (err) {
    return { success: false, error: err.response?.data?.error || "Login failed" };
  }
};

export const googleLogin = async (credential) => {
  try {
    const { data } = await api.post("/auth/google-login", { tokenId: credential });
    return data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || "Google login failed" };
  }
};
