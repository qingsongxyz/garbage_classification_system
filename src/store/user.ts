import Role from "@/type/roleList";
import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: () => {
    return {
      id: 0,
      username: "",
      roleList: <Role[]>[],
      image: "",
      access_token: "",
      refresh_token: "",
    }
  },
  getters: {

  },
  actions: {

  },
  persist: {
    
  }
})

export default useUserStore;