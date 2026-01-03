<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
//import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const { login } = useAuth();
//const router = useRouter();

const handleLogin = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  
  try {
    await login(email.value, password.value);
    //router.push('/'); // Redirect to Home/Explore after success
  } catch (err) {
    // Simple error mapping for better UX
    if(err.code === 'auth/invalid-credential') {
      errorMsg.value = "Invalid email or password.";
    } else {
      errorMsg.value = err.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to access Sensa Discussion
        </p>
      </div>

      <div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r">
        <p class="font-medium">Login Failed</p>
        <p>{{ errorMsg }}</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              id="email-address" 
              name="email" 
              type="email" 
              v-model="email" 
              required 
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="you@ensa.ac.ma" 
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              v-model="password" 
              required 
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Sign up now
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>