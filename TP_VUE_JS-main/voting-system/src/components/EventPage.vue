<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust path to your firebase.js

const route = useRoute();
const router = useRouter();

// State
const event = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isVoting = ref(false);

// 1. Fetch Event Data based on URL ID
const fetchEvent = async () => {
  try {
    const docRef = doc(db, 'event', route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      const deadlineDate = data.deadline ? data.deadline.toDate() : new Date();
      const isExpired = new Date() > deadlineDate;

      event.value = {
        id: docSnap.id,
        title: data.title,
        subtitle: `Event #${docSnap.id.slice(0,6)} • Community Proposal`,
        author: "Community Organizer", 
        deadline: deadlineDate.toLocaleDateString(),
        isExpired: isExpired,
        image: data.img || "https://via.placeholder.com/1200x600",
        description: data.description || "<p>No description provided.</p>",
        yesVotesList: data.yesVotes || [],
        noVotesList: data.noVotes || [],
        minThreshold: 50 
      };
    } else {
      error.value = "Event not found.";
    }
  } catch (err) {
    console.error("Error fetching event:", err);
    error.value = "Failed to load event data.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEvent();
});

// 2. Computed Properties
const yesCount = computed(() => event.value?.yesVotesList.length || 0);
const noCount = computed(() => event.value?.noVotesList.length || 0);
const totalVoters = computed(() => yesCount.value + noCount.value);

const yesPercent = computed(() => {
  if (totalVoters.value === 0) return 0;
  return Math.round((yesCount.value / totalVoters.value) * 100);
});

const noPercent = computed(() => {
  if (totalVoters.value === 0) return 0;
  return 100 - yesPercent.value;
});

const handleVote = async (choice) => {
  console.log(`1. Attempting to vote: ${choice}`);

  // LOGIC FIX 1: Remove 'event.value.isExpired' check. 
  // If the date calculation was wrong, this was silently blocking you.
  if (isVoting.value) {
    console.log("Vote blocked: Already voting");
    return;
  }
  
  // LOGIC FIX 2: Ensure event data actually exists before trying to vote
  if (!event.value || !event.value.id) {
    console.error("Vote blocked: Event data is missing");
    return;
  }

  isVoting.value = true;

  try {
    const eventRef = doc(db, 'event', event.value.id);
    
    // Create the vote object
    const voteObject = {
      isYes: choice === 'yes',
      createdAt: Timestamp.now()
    };

    if (choice === 'yes') {
      await updateDoc(eventRef, {
        yesVotes: arrayUnion(voteObject)
      });
      
      // We check if yesVotesList exists before pushing, to prevent crashes
      if (!event.value.yesVotesList) event.value.yesVotesList = [];
      event.value.yesVotesList.push(voteObject);
      
    } else {
      await updateDoc(eventRef, {
        noVotes: arrayUnion(voteObject)
      });
      
      if (!event.value.noVotesList) event.value.noVotesList = [];
      event.value.noVotesList.push(voteObject);
    }

    console.log("Success: Vote recorded in Firestore");

  } catch (err) {
    console.error("Logic Error during voting:", err);
    alert(`Error: ${err.message}`);
  } finally {
    isVoting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
    
    <div class="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
        <button 
          @click="router.push('/')"
          class="flex items-center text-slate-500 hover:text-indigo-600 transition text-sm font-medium gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Events
        </button>
      </div>
    </div>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p class="text-slate-500">Loading event details...</p>
      </div>

      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p class="text-red-500">{{ error }}</p>
        <button @click="router.push('/')" class="mt-4 text-indigo-600 hover:underline">Return Home</button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div class="lg:col-span-8">
          
          <div class="mb-8">
            <div class="flex items-center gap-2 mb-3">
              <span 
                :class="event.isExpired ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'"
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              >
                {{ event.isExpired ? 'Closed' : 'Active Vote' }}
              </span>
              <span class="text-slate-400 text-sm font-medium">Ends on {{ event.deadline }}</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2">
              {{ event.title }}
            </h1>
            <p class="text-slate-500 text-lg">{{ event.subtitle }}</p>
          </div>

          <div class="rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-8 h-64 md:h-96">
            <img :src="event.image" class="w-full h-full object-cover" alt="Event Hero" />
          </div>

          <div class="flex items-center gap-4 mb-8 p-4 bg-white rounded-xl border border-slate-200">
            <div class="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl">🏛️</div>
            <div>
              <p class="text-xs text-slate-400 uppercase font-bold">Proposed By</p>
              <p class="font-bold text-slate-900">{{ event.author }}</p>
            </div>
          </div>

          <div class="prose prose-slate prose-lg max-w-none text-slate-600">
            <div v-html="event.description"></div>
          </div>

          <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div class="p-6 bg-slate-100 rounded-xl">
               <h3 class="font-bold text-slate-900 mb-1">Threshold</h3>
               <p class="text-sm text-slate-500">Requires {{ event.minThreshold }} votes to be considered valid.</p>
             </div>
             <div class="p-6 bg-slate-100 rounded-xl">
               <h3 class="font-bold text-slate-900 mb-1">Impact Level</h3>
               <p class="text-sm text-slate-500">High impact on local infrastructure budget.</p>
             </div>
          </div>

        </div>

        <div class="lg:col-span-4">
          <div class="sticky top-24 space-y-6">
            
            <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 overflow-hidden relative">
              
              <h3 class="text-xl font-bold text-slate-900 mb-6">Current Results</h3>

              <div class="flex items-end gap-1 mb-2">
                 <span class="text-6xl font-black text-emerald-500 tracking-tighter">{{ yesPercent }}%</span>
                 <span class="text-lg font-bold text-emerald-600 mb-2">Yes</span>
              </div>
              <p class="text-slate-400 text-sm mb-6">{{ yesCount }} votes out of {{ totalVoters }}</p>

              <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mb-2">
                <div class="bg-emerald-500 h-full transition-all duration-700" :style="{ width: `${yesPercent}%` }"></div>
                <div class="bg-rose-500 h-full transition-all duration-700" :style="{ width: `${noPercent}%` }"></div>
              </div>
              
              <div class="flex justify-between text-xs font-semibold text-slate-400 mb-8">
                 <span>Yes</span>
                 <span>No ({{ noPercent }}%)</span>
              </div>

              <div class="space-y-3">
                <button 
                  @click="handleVote('yes')"
                  class="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span v-if="isVoting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span v-else>👍 Vote Yes</span>
                </button>
                
                <button 
                  @click="handleVote('no')"
                  class="w-full py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-600 font-bold hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   Vote No
                </button>
              </div>

              <div class="mt-6 flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 flex-shrink-0">
                  <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                </svg>
                Votes are recorded anonymously.
              </div>

            </div>

            <div class="bg-indigo-600 rounded-xl p-6 text-white text-center shadow-lg shadow-indigo-200">
              <h4 class="font-bold text-lg mb-2">Invite Others</h4>
              <p class="text-indigo-100 text-sm mb-4">Higher turnout leads to better decisions.</p>
              <button class="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-full py-2 rounded-lg font-semibold text-sm transition">
                Copy Link
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}
:deep(ul) {
  margin-bottom: 1rem;
  list-style-type: disc;
  padding-left: 1.5rem;
}
</style>