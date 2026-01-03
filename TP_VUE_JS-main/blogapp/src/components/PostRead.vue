<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
const route = useRoute()
const postId = route.params.id;
const post = ref(
  {
  id: 0,
  title: "Loading...",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  date: "",
  readTime: "",
  tags: [],
  author: {
    name: "",
    role: "",
    avatar: ""
  }
});
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/posts/${postId}`);
    post.value = response.data
    console.log(post)
  } catch (err) {
    console.error(err)
  }
});
   
</script>

<template>
  <article class="bg-white dark:bg-slate-900 min-h-screen pb-20 mt-16">
    
    <header class="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      
      <router-link to="/" class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Blog
      </router-link>

      <div class="flex items-center justify-center gap-4 text-sm mb-6">
        <span class="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          {{ post.category }}
        </span>
        <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span class="text-slate-500 dark:text-slate-400">{{ post.date }}</span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
        {{ post.title }}
      </h1>

      <div class="flex items-center justify-center">
        <img :src="post.author.avatar" :alt="post.author.name" class="h-12 w-12 rounded-full ring-2 ring-white dark:ring-slate-800">
        <div class="ml-4 text-left">
          <p class="text-base font-semibold text-slate-900 dark:text-white">{{ post.author.name }}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">{{ post.author.role }}</p>
        </div>
      </div>
    </header>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div class="aspect-w-16 aspect-h-9 relative rounded-2xl overflow-hidden shadow-lg">
        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover">
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="
        prose prose-slate prose-lg dark:prose-invert 
        mx-auto 
        first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 dark:first-letter:text-white first-letter:mr-3 first-letter:float-left
      ">
        <slot>
          <p class="lead text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            This is the lead paragraph. It's usually slightly larger to hook the reader. Replace this with your actual post content using the Vue slot.
          </p>
          
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">Introduction</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6 leading-7">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <blockquote class="border-l-4 border-indigo-500 pl-4 italic text-slate-700 dark:text-slate-300 my-8 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-r">
            "Design is not just what it looks like and feels like. Design is how it works."
          </blockquote>

          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">The Solution</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-6 leading-7">
             Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </slot>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">Tags:</span>
        
        <router-link
          v-for="(tag, index) in post.tags"
          :key="index"
          :to="{ name: 'home', query: { tag: tag } }"
          class="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          #{{ tag }}
        </router-link>
        </div>

      <router-link
    :to="`/edit/${post.id}`"
    class=" mt-3 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
  >
    Edit
  </router-link>

    </div>
  </article>
</template>