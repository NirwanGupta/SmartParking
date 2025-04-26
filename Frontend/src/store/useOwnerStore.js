import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useOwnerStore = create((set, get) => ({
    myParkings: [],
    loading: false,
    allParkings: [],

    getAllParking: async () => {
        console.log("Fetching all parking slots...");
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/parking/getAllParking");
            console.log("All parking slots response:", res.data);
            set({allParkings: res.data});
        } catch (error) {
            console.error("Error fetching all parking slots:", error);
            toast.error("Failed to fetch parking slots");
        } finally {
            set({ loading: false });
        }  
    },

    getMyParkings: async () => {
        console.log("Fetching my parkings...");
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/parking/getMyParking");
            console.log("My parkings response:", res.data.myParking);
            set({ myParkings: res.data.myParking });
            return res.data.myParking; // Return the fetched data
        } catch (error) {
            console.error("Error fetching my parkings:", error);
            toast.error("Failed to fetch my parkings");
        } finally {
            set({ loading: false });
        }
    },

    getSingleParking: async (id) => {
        console.log("Fetching single parking slot with ID:", id);
        set({ loading: true });
        try {
            const locationId = id;
            const res = await axiosInstance.get(`/parking/getSingleParking?locationId=${locationId}`);
            console.log("Single parking slot response:", res.data.currentParking);
            return res.data.currentParking;
        } catch (error) {
            console.error("Error fetching single parking slot:", error);
            toast.error("Failed to fetch parking slot details");
        } finally {
            set({ loading: false });
        }
    },
}));