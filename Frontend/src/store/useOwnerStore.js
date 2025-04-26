import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useOwnerStore = create((set, get) => ({
    myParkings: [],
    loading: false,

      getMyParkings: async () => {
        console.log("Fetching my parkings...");
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/parking/getMyParking");
            console.log("My parkings response:", res.data.myParking);
        set({ myParkings: res.data.myParking });
        } catch (error) {
            console.error("Error fetching my parkings:", error);
            toast.error("Failed to fetch my parkings");
        } finally {
            set({ loading: false });
        }
    },

}));