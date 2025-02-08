import {create} from 'zustand';
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';

const BASE_URL = "http:localhost:5000";

export const useAuthStore = create((get, set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
        } catch (error) {
            console.log("error in checkAuth", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        console.log(data);
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post(`/auth/register`, {name:data.fullName, email: data.email, password: data.password});
            // set({authUser: res.data});
            toast.success("Account created successfully, verify your email");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },

    login: async (data) => {
        console.log(data);
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post(`/auth/login`, {email: data.email, password: data.password});
            console.log(res);
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn: false});
        }
    }
}))