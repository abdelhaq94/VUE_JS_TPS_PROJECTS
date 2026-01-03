import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import LoginPage from '../components/LoginPage.vue'
import SignupPage from '../components/SignupPage.vue'
import EventPage from '../components/EventPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SignupPage
  },
  {
    path: '/login',
    name: 'Login',
    component:LoginPage
  },
  {
    path: '/events',
    name: 'About',
    component:HomePage 
  },
  {
    path:"/event/:id",
    name:"EventDetails",
    component:EventPage
  },
  {
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
