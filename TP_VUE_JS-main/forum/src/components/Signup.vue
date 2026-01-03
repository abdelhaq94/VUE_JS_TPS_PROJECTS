<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const { signup } = useAuth();
const router = useRouter();

const handleRegister = async () => {
  errorMsg.value = '';
  isLoading.value = true;

  try {
    await signup(email.value, password.value, name.value);
    router.push('/');
  } catch (err) {
    errorMsg.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Join the Sensa community today
        </p>
      </div>

      <div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r">
        <p class="font-medium">Registration Failed</p>
        <p>{{ errorMsg }}</p>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleRegister">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            v-model="name" 
            type="text" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder="Ahmed Student" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder="student@ensa.ac.ma" 
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder="Min. 6 characters" 
          />
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors mt-6"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Already have an account? 
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
            Log in instead
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>