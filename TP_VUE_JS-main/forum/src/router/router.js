import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebaseConfig';

// Import your views
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Signup.vue';
import DiscussionDetail from '../components/DiscussionDetails.vue';
import NewDiscussionForm from '../components/NewDiscussionForm.vue';
import NotFound from '../components/NotFound.vue';

// Note: Ensure these files exist in your views folder, or the app will error.
// You can create empty .vue files for them for now.
//import NewDiscussionForm from '../views/NewDiscussionForm.vue';
//import UserProfile from '../views/UserProfile.vue'; 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Only for logged OUT users
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/discussion/:id',
    name: 'DiscussionDetail',
    component: DiscussionDetail,
    props: true
  },
  {
    path:"/create",
    name: "NewDiscussionForm",
    component: NewDiscussionForm,
    meta: { requiresAuth: true } // Only for logged IN users
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard (Protects routes)
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  
  // Check current auth state
  // Note: On hard refresh, auth.currentUser might be null briefly. 
  // In a production app, you might wait for onAuthStateChanged here.
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (requiresGuest && currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;