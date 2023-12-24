import { defineStore } from 'pinia'
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
      tokens: null
    }
  },
  actions: {
    logout() {
      localStorage.clear();
      this.id = 0;
      this.email = "";
      this.first_name = "";
      this.last_name = "";
      this.tokens = null;
      axios.defaults.headers['Authorization'] = "";
    }
  }
})