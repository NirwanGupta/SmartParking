import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useParkingStore = create((set) => ({
  isSubmitting: false,

  bookParkingSlot: async (data) => {
    console.log("Booking data:", data);
    set({ isSubmitting: true });

    try {
      const res = await axiosInstance.post("/parking/book", {
        locationId: data.selectedBuilding_id,
        floor: data.floorNumber,
        slotNumber: data.slotNumber,
        registrationNumber: data.registrationNumber,
        duration: data.duration,
        paymentStatus: data.paymentStatus,
      });
      console.log("Booking response:", res.data);
      toast.success("Parking slot booked successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again."
      );
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
