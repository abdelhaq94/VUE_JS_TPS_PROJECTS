<script setup>
import { onMounted, ref, watch } from 'vue'
import PostCard from './PostCard.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const posts = ref([])
const tag = ref(route.query.tag || null)

// Function to fetch all posts and filter internally
async function loadPosts() {
  try {
    const res = await axios.get('http://localhost:3000/posts')
    let allPosts = res.data

    // If tag exists, filter client-side
    posts.value = tag.value
      ? allPosts.filter(post => post.tags.includes(tag.value))
      : allPosts

  } catch (err) {
    console.error(err)
  }
}

// Watch for route query changes
watch(
  () => route.query.tag,
  (newTag) => {
    tag.value = newTag || null
    loadPosts()
  },
  { immediate: true }
)

// Initial fetch
onMounted(loadPosts)
</script>

<template>
  <section class="bg-slate-50 dark:bg-slate-900 min-h-screen py-12 mt-10">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-10">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
          Latest Articles
          <span v-if="tag"> - #{{ tag }}</span>
        </h2>
      </div>

      <div class="space-y-6">
        <PostCard 
          v-for="postItem in posts" 
          :key="postItem.id" 
          :post="postItem" 
        />
      </div>

    </div>
  </section>
</template>
