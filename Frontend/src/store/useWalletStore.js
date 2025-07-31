import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useWalletStore = create((set, get) => ({
    balance: 0,
    selectedMethod: "",
}));