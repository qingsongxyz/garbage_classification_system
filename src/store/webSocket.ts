import { defineStore } from "pinia";
import * as stompjs from "stompjs";

const useWebSocketStore = defineStore("webSocket", {
    state: () => {
        return {
            ws: <stompjs.Client>{},
        }
    },
    getters: {

    },
    actions: {

    },
    persist: false
})

export default useWebSocketStore;