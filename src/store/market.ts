import { defineStore } from "pinia";

const useMarketStore = defineStore("market", {
  state: () => {
    return {
      marketId: 0,
      count: 0,
    }
  },
  getters: {

  },
  actions: {

  },
  persist: {
    
  }
})

export default useMarketStore;