import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000"; // Fixed missing "//"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    images: [],
    isUpdatingProfile: false,

    checkAuth: async () => {
        set({isCheckingAuth: true});
        try {
            const res = await axiosInstance.get("/auth/check");
            console.log("Auth check response:", res.data);
            set({authUser: res.data.user});
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        console.log("Signup data:", data);
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post(`/auth/register`, {
                name: data.fullName,
                email: data.email,
                password: data.password,
            });
            console.log("Signup response:", res.data);
            toast.success("Account created successfully, verify your email");
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        console.log("Login attempt with:", data);
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post(`/auth/login`, {
                email: data.email,
                password: data.password,
            });
            console.log("Login response:", res.data);

            // Ensure Zustand updates correctly
            set((state) => ({
                ...state,
                authUser: res.data.user,
            }));

            toast.success("Logged in successfully");

            // Debug if authUser is updated properly
            setTimeout(() => {
                console.log("Updated authUser in Zustand:", get().authUser);
            }, 100);
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Login failed");
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async() => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            console.log("Logout response:", res.data);
            set({authUser: null});
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    forgotPassword: async (data) => {
        console.log("Forgot password request:", data);
        try {
            const res = await axiosInstance.post(`/auth/forgotPassword`, {
                email: data.email,
            });
            console.log("Forgot password response:", res.data);
            toast.success("Reset password email sent successfully");
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error(error.response?.data?.message || "Request failed");
        }
    },

    getImagesForHomeCarousel: async () => {
        try {
            const res = await axiosInstance.get("/home/getPosters");
            console.log("Carousel images response:", res.data);
            set({images: res.data.posters});
            return res.data;
        } catch (error) {
            console.error("Carousel images error:", error);
        }
    },

    updateProfile: async (data) => {
        console.log("Update profile data:", data);
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.patch(`/auth/updateUser`, data);
            console.log("Update profile response:", res.data);
            set({ authUser: res.data.user });
            console.log(res.data.user);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    uploadImage: async (data) => {
        console.log("Image upload data:", data);
        try {
            const res = await axiosInstance.post(`/auth/uploadImage`, data);
            console.log("Image upload response:", res.data);
            toast.success("Image uploaded successfully");
            set({authUser: res.data.user});
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error(error.response?.data?.message || "Upload failed");
        }
    }
}));
