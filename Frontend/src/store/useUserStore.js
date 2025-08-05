import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
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
            return res.data;
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
        console.log("Fetching single parking with ID:", id);
        set({ loading: true });
        try {
            const locationId = id;
            const res = await axiosInstance.get(`/parking/getSingleParking?locationId=${locationId}`);
            console.log("Single parking response:", res.data.currentParking);
            return res.data.currentParking;
        } catch (error) {
            console.error("Error fetching single parking slot:", error);
            toast.error("Failed to fetch parking slot details");
        } finally {
            set({ loading: false });
        }
    },

    ownerAddFloor: async (data) => {
        console.log("Adding new floor with data:", data);
        set({ loading: true });
        try {
            const res = await axiosInstance.post(`/parking/addFloor?locationId=${data.locationId}`, data);
            console.log("Add floor response:", res.data);
            toast.success("Floor added successfully");
            return res.data;
        } catch (error) {
            console.error("Error adding floor:", error);
            toast.error("Failed to add floor");
        } finally {
            set({ loading: false });
        }
    },
    
    deleteFloor: async (data) => {
        console.log("Deleting floor with data:", data);
        set({ loading: true });
        try {
            const res = await axiosInstance.delete(`/parking/deleteFloor?locationId=${data.locationId}&name=${data.name}`);
            console.log("Delete floor response:", res.data);
            toast.success("Floor deleted successfully");
            return res.data.floors;
        } catch (error) {
            console.error("Error deleting floor:", error);
            toast.error("Failed to delete floor");
        } finally {
            set({ loading: false });
        }
    },

    updateBuildingInfo: async (data) => {
        console.log("saving details, ", data);
        set({ loading: true });
        try {
            const res = await axiosInstance.patch(`/parking/updateParking?locationId=${data.locationId}`, data);
            console.log("Update building info response:", res.data);
            toast.success("Building info updated successfully");
            return res.data;
        } catch (error) {
            console.error("Error updating building info:", error);
            toast.error("Failed to update building info");
        } finally {
            set({ loading: false });
        }
    },
}));