import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useParkingStore = create((set) => ({
  isSubmitting: false,

  bookParkingSlot: async (data) => {
    console.log("Booking data:", data);
    set({ isSubmitting: true });

    try {
      const res = await axiosInstance.post(`/parking/book/?locationId=${data.locationId}`, {
        locationId: data.selectedBuilding_id,
        floor: data.floor-1,
        slot: data.slotNumber,
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

  getCoordinates: async (address) => {
    if (!address) {
      throw new Error("Address is required");
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), long: parseFloat(lon) };
      } else {
        throw new Error("No results found for address: " + address);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      throw error;
    }
  },

  

}));
