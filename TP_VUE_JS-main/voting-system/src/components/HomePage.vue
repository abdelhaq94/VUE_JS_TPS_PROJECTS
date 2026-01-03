<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig' // Make sure this path points to your firebase.js file 
const events = ref([]);
const isLoading = ref(true);

// Fetch Logic
const fetchEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'event'));
    
    events.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Calculate Status based on deadline (optional logic)
      const now = new Date();
      const deadline = data.deadline ? data.deadline.toDate() : new Date();
      const status = now > deadline ? 'Closed' : 'Active';

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        // Map DB 'img' field to UI 'image' prop
        image: data.img || 'https://via.placeholder.com/400x300', 
        // Count the length of the arrays to get the number of votes
        votesYes: data.yesVotes ? data.yesVotes.length : 0,
        votesNo: data.noVotes ? data.noVotes.length : 0,
        status: status
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch on mount
onMounted(() => {
  fetchEvents();
});

// Helper to calculate percentage for the progress bar
const getYesPercentage = (yes, no) => {
  const total = yes + no;
  if (total === 0) return 50; // Default center if no votes
  return Math.round((yes / total) * 100);
};

// Format numbers
const formatNumber = (num) => new Intl.NumberFormat().format(num);
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans">
    
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
            <span class="text-xl font-bold tracking-tight text-slate-900">VoteFlow</span>
          </div>
          <button class="text-sm font-medium text-slate-500 hover:text-indigo-600 transition">
            Login / Sign Up
          </button>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <div class="mb-10 text-center sm:text-left">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
          Active Events
        </h1>
        <p class="text-lg text-slate-500 max-w-2xl">
          Participate in the community. Cast your vote on the latest events and watch the results update in real-time.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="mt-4 text-slate-500">Loading events...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div 
          v-for="event in events" 
          :key="event.id"
          class="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden"
        >
          <div class="h-48 overflow-hidden relative">
            <img 
              :src="event.image" 
              :alt="event.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-indigo-700 shadow-sm">
              {{ event.status }}
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
              {{ event.title }}
            </h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
              {{ event.description }}
            </p>

            <div class="mt-auto">
              <div class="flex justify-between text-xs font-semibold mb-2 uppercase tracking-wider">
                <span class="text-emerald-600">Yes ({{ formatNumber(event.votesYes) }})</span>
                <span class="text-rose-600">No ({{ formatNumber(event.votesNo) }})</span>
              </div>
              
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  class="bg-emerald-500 h-full transition-all duration-1000 ease-out"
                  :style="{ width: `${getYesPercentage(event.votesYes, event.votesNo)}%` }"
                ></div>
                <div 
                  class="bg-rose-500 h-full transition-all duration-1000 ease-out flex-1"
                ></div>
              </div>
              
              <div class="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
                <span>{{ getYesPercentage(event.votesYes, event.votesNo) }}%</span>
                <span>{{ 100 - getYesPercentage(event.votesYes, event.votesNo) }}%</span>
              </div>
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
            <RouterLink 
              :to="`/event/${event.id}`"
              class="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition text-center flex items-center justify-center"
            >
              View Details
            </RouterLink>
            <button class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition">
              Vote Now
            </button>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>