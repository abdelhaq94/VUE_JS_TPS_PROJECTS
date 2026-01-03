<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');
  } catch (error) {
    console.error("Logout error:", error);
  }
};
</script>

<template>
  <nav class="bg-white border-b border-gray-100 py-4 shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 flex justify-between items-center">
      
      <router-link to="/" class="text-xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
        <span>Ensa Discussion</span>
      </router-link>

      <div class="flex items-center space-x-6 text-sm font-medium">
        
        <router-link to="/" class="text-gray-500 hover:text-black transition">
          Explore
        </router-link>

        <template v-if="user">
          <router-link to="/create" class="text-gray-500 hover:text-black transition">
            Create Discussion
          </router-link>
          
          <router-link to="/profile" class="text-gray-500 hover:text-black transition">
            Profile
          </router-link>

          <button @click="handleLogout" class="text-red-500 hover:text-red-700 transition font-semibold">
            Logout
          </button>
        </template>

        <template v-else>
          <router-link to="/login" class="text-gray-500 hover:text-black transition">
            Log In
          </router-link>
          <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
            Sign Up
          </router-link>
        </template>

      </div>
    </div>
  </nav>
</template>