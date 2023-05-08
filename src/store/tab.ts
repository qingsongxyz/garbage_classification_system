import { defineStore } from "pinia";
/**
 * 极验验证码相关 
 */

const useTab = defineStore("tab", {
    state: () => {
        return {
            tabs: [
                {
                    name: "欢迎",
                    title: "欢迎",
                    closable: false,
                    to: "/main/welcome",
                    isRouterActive: true,
                },
            ],
            tabName: "欢迎",
        }
    },
    getters: {

    },
    actions: {

    },
    persist: {

    }
})

export default useTab;