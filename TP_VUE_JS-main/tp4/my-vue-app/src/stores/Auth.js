import { defineStore } from 'pinia'

export const useAdminStore = defineStore('Auth', {
  state: () => ({
    role:'Admin'
  }),
  actions: {
    Makeuser() {
      this.role='User'
    },
    Makeadmin() {
      this.role='Admin'
    }
  }
})
