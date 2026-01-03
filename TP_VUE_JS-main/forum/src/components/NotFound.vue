<script setup>
// Simple 404 / Coming Soon page
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div class="bg-blue-50 text-blue-600 text-5xl font-bold rounded-full w-24 h-24 flex items-center justify-center mb-6">
      🚧
    </div>
    
    <h1 class="text-4xl font-bold text-gray-900 mb-2">Coming Soon</h1>
    <p class="text-gray-600 text-lg max-w-md mb-8">
      We couldn't find the page you were looking for. It might be under construction or doesn't exist.
    </p>

    <router-link 
      to="/" 
      class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
    >
      Go Back Home
    </router-link>
  </div>
</template>