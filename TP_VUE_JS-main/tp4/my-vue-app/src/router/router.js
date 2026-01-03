import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import MainPage from '../components/MainPage.vue'
import HomePage from '../components/HomePage.vue'
import EditJob from '../components/EditJob.vue'
import ViewJob from '../components/ViewJob.vue'
import AddJob from '../components/AddJob.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component:LoginPage
    },
    {
      name: 'main',
      path: '/main',    
      component:MainPage,
      children:[
        {
            path: '',
            name: 'homepage',
            component: HomePage
          },
        {
            path: 'addJob',
            name: ' addJob',
            component: AddJob
          },
        { path:'editJob/:id', 
          name:'editJob',
          component:EditJob

        },
      {
        path:'viewjob/:id',
        name:'viewjob',
        component:ViewJob
      }]
    },
  ]
})

export default router