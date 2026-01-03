import { createRouter, createWebHistory } from 'vue-router'

// Import your components
import PostList from '../components/PostListing.vue'
import PostRead from '../components/PostRead.vue'
import PostCreate from '../components/PostCreate.vue'
import PostEdit from '../components/PostEditt.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  
  routes: [
    {
      path: '/',
      name: 'home',
      component: PostList,
      // Pass props from query to component
      props: route => ({
        tag: route.query.tag || null
      })
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostRead,
      props: true // optional if you want to pass id as a prop
    },
    {
      path: '/create',
      name: "post-create",
      component: PostCreate,
    },
    {
      path: '/edit/:id',
      name: "post-edit",
      component: PostEdit,
      props: true
    }
  ]
})

export default router
