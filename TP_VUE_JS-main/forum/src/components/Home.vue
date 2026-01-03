<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Import router tools
import { useFirestore } from '../composables/useFirestore';
import NavBar from './NavBar.vue';

const { getDiscussions } = useFirestore();
const route = useRoute();
const router = useRouter();

const discussions = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");

// 1. Function to Fetch Data based on URL
const fetchData = async () => {
  isLoading.value = true;
  const categoryFromUrl = route.query.category || null; // Read from URL
  
  try {
    // Pass the category to your composable
    discussions.value = await getDiscussions(categoryFromUrl);
  } finally {
    isLoading.value = false;
  }
};

// 2. Initial Load
onMounted(() => {
  fetchData();
});

// 3. Watch for URL changes (e.g. clicking a category)
watch(() => route.query.category, () => {
  fetchData();
});

// 4. Helper to select a category (updates URL)
const selectCategory = (cat) => {
  if (cat === 'All') {
    router.push({ path: '/' }); // Remove query param
  } else {
    router.push({ path: '/', query: { category: cat } }); // Add query param
  }
};

// Helper for Search Filtering (Client-side)
const filteredDiscussions = ref([]);
watch([discussions, searchQuery], () => {
  if (!searchQuery.value) {
    filteredDiscussions.value = discussions.value;
  } else {
    const q = searchQuery.value.toLowerCase();
    filteredDiscussions.value = discussions.value.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.content.toLowerCase().includes(q)
    );
  }
}, { immediate: true });

const getCategoryColor = (cat) => {
  // Simple hash to give consistent colors to random strings if you want, 
  // or just default blue.
  return 'bg-blue-100 text-blue-800'; 
};
</script>

<template>
    <NavBar />
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="mb-8 text-center max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
        <span v-if="route.query.category" class="text-blue-600">{{ route.query.category }}</span>
        <span v-else>All</span> 
        Discussions
      </h1>
      
      <div class="relative mb-6">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search topics..." 
          class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <button @click="selectCategory('All')" class="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">All</button>
        <button @click="selectCategory('Vue.js')" class="px-3 py-1 text-sm rounded-full bg-green-50 hover:bg-green-100 text-green-700">Vue.js</button>
        <button @click="selectCategory('Firebase')" class="px-3 py-1 text-sm rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-700">Firebase</button>
        <button @click="selectCategory('General')" class="px-3 py-1 text-sm rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700">General</button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="filteredDiscussions.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <p class="text-gray-500">No discussions found.</p>
      <button v-if="route.query.category" @click="selectCategory('All')" class="mt-2 text-blue-600 font-medium hover:underline">Clear Filter</button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div 
        v-for="topic in filteredDiscussions" 
        :key="topic.id"
        class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
      >
        <div class="flex justify-between items-start mb-4">
          <button 
            @click.stop="selectCategory(topic.category)"
            :class="`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide hover:opacity-80 transition ${getCategoryColor(topic.category)}`"
          >
            {{ topic.category }}
          </button>
          
          <span class="text-xs text-gray-400 font-medium">
            {{ topic.createdAt?.toDate().toLocaleDateString() }}
          </span>
        </div>

        <div class="flex-grow">
          <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            <router-link :to="`/discussion/${topic.id}`">
              {{ topic.title }}
            </router-link>
          </h3>
          <p class="text-gray-600 text-sm line-clamp-3">
            {{ topic.content }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
              {{ topic.authorName?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm font-medium text-gray-700 truncate max-w-[100px]">
              {{ topic.authorName }}
            </span>
          </div>
          
          <router-link :to="`/discussion/${topic.id}`" class="text-blue-600 text-sm font-semibold hover:underline">
            Read →
          </router-link>
        </div>

      </div>
    </div>

  </div>
</template>