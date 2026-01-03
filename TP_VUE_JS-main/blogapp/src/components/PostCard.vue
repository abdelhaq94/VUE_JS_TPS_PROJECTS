<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200">
    
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
      <div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
          <router-link to="/">
            <span class="absolute inset-0"></span> {{ post.title }}
          </router-link>
        </h3>
        
        <div class="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
          <time>{{ post.date }}</time>
          <span>&bull;</span>
          <span>{{ post.readTime }}</span>
        </div>
      </div>
      
      <span class="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10">
        {{ post.category }}
      </span>
    </div>

    <p class="text-slate-600 dark:text-slate-300 text-base mb-6 leading-relaxed">
      {{ post.excerpt }}
    </p>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 relative z-10">
      
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="(tag, index) in post.tags" 
          :key="index"
          class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        >
          #{{ tag }}
        </span>
      </div>
      <div class="flex gap-4 items-center">
    <!-- Read Article -->
    <router-link 
      :to="`/post/${post.id}`"
      class="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
    >
      Read Article
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 transition-transform group-hover:translate-x-1">
        <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
      </svg>
    </router-link>

    <!-- Edit Article -->
    <router-link
      :to="`/edit/${post.id}`"
      class="inline-flex items-center gap-1 text-sm font-semibold text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
    >
      Edit
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M4 20h4.768l9.264-9.264-4.768-4.768L4 20z" />
      </svg>
    </router-link>
  </div>

    </div>
  </article>
</template>