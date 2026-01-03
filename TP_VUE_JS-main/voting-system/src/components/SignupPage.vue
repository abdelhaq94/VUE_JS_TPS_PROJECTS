<script setup>
import { ref } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig' // Ensure this path matches your file structure
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleSignup = async () => {
  errorMessage.value = ''

  // 1. Client-side Validation
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match."
    return
  }
  
  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters."
    return
  }

  isLoading.value = true

  try {
    // 2. Firebase Registration Logic
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    
    console.log('Account Created:', userCredential.user)
    alert('Account created successfully!')
    
    // Redirect to dashboard or login
    router.push('/events')

  } catch (error) {
    // 3. Error Handling
    console.error(error.code)
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage.value = 'This email is already registered.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Invalid email address.'
        break
      case 'auth/weak-password':
        errorMessage.value = 'Password should be at least 6 characters.'
        break
      default:
        errorMessage.value = 'Failed to create account. Please try again.'

    }
  } finally {
    isLoading.value = false
    router.push('/events')

  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Already have an account?
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </a>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        
        <form class="space-y-6" @submit.prevent="handleSignup">
          
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-400 p-4">
            <div class="flex">
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input 
                id="email" 
                type="email" 
                v-model="email" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1">
              <input 
                id="password" 
                type="password" 
                v-model="password" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1">
              <input 
                id="confirm-password" 
                type="password" 
                v-model="confirmPassword" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>