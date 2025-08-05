import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from 'socket.io-client';

const BASE_URL = "http://localhost:5000";

export const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],

    connectSocket: (authUser) => {
        if(!authUser || get().socket?.connected) return;

        console.log("Connecting socket for user:", authUser);

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.userId,
            },
        });
        socket.connect();

        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds});
        });

        setTimeout(() => {
            console.log("All online Users are: ", get().onlineUsers);
        }, 2000);
    },

    disConnectSocket: () => {
        if(get().socket?.connected) {
            console.log("disconnecting the user with socketId: ", socket._id);
            get().socket.disconnect();
        }
    },
}));