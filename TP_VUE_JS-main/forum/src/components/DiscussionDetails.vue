<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../firebaseConfig';
import { useAuth } from '../composables/useAuth';
import { 
  doc, getDoc, collection, query, where, orderBy, 
  addDoc, deleteDoc, updateDoc, increment, onSnapshot, serverTimestamp 
} from 'firebase/firestore';

import NavBar from './NavBar.vue';

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const discussion = ref(null);
const responses = ref([]);
const newReply = ref("");
const isLoading = ref(true);
const isSubmitting = ref(false);

const discussionId = route.params.id;

// 1. Fetch Discussion & Listen for Real-time Responses
onMounted(async () => {
  try {
    // A. Fetch the Main Discussion
    const docSnap = await getDoc(doc(db, 'discussions', discussionId));
    if (docSnap.exists()) {
      discussion.value = { id: docSnap.id, ...docSnap.data() };
    } else {
      router.push('/'); // Redirect if not found
      return;
    }

    // B. Listen for Responses (Real-time)
    const q = query(
      collection(db, 'responses'), 
      where('discussionId', '==', discussionId),
      orderBy('createdAt', 'asc')
    );
    
    onSnapshot(q, (snapshot) => {
      responses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      isLoading.value = false;
    });

  } catch (error) {
    console.error("Error loading discussion:", error);
    isLoading.value = false;
  }
});

// 2. Add Reply
const submitReply = async () => {
  if (!newReply.value.trim()) return;
  isSubmitting.value = true;

  try {
    await addDoc(collection(db, 'responses'), {
      discussionId: discussionId,
      content: newReply.value,
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email,
      reportCount: 0, // Initialize report count
      createdAt: serverTimestamp()
    });
    newReply.value = ""; // Clear input
  } catch (err) {
    alert("Failed to send reply: " + err.message);
  } finally {
    isSubmitting.value = false;
  }
};

// 3. Delete Reply
const deleteReply = async (replyId) => {
  if (confirm("Are you sure you want to delete this message?")) {
    try {
      await deleteDoc(doc(db, 'responses', replyId));
    } catch (err) {
      alert("Error deleting: " + err.message);
    }
  }
};

// 4. Report Reply
const reportReply = async (reply) => {
  if (confirm("Flag this content as inappropriate?")) {
    try {
      const replyRef = doc(db, 'responses', reply.id);
      await updateDoc(replyRef, {
        reportCount: increment(1)
      });
      alert("Report submitted. Thank you for keeping the community safe.");
    } catch (err) {
      console.error(err);
    }
  }
};

// 5. Permission Check Logic
const canDelete = (reply) => {
  if (!user.value) return false;
  // User owns the reply OR User owns the main discussion
  return user.value.uid === reply.authorId || user.value.uid === discussion.value.authorId;
};
</script>

<template>
    <NavBar/>
  <div class="max-w-4xl mx-auto px-4 py-8">
    
    <router-link to="/" class="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
      <span class="mr-2">←</span> Back to Discussions
    </router-link>

    <div v-if="isLoading" class="text-center py-12">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div class="p-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
              {{ discussion.category }}
            </span>
            <span class="text-gray-400 text-sm">
              {{ discussion.createdAt?.toDate().toLocaleDateString() }}
            </span>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ discussion.title }}</h1>
          
          <div class="prose max-w-none text-gray-700 leading-relaxed mb-8">
            {{ discussion.content }}
          </div>

          <div class="flex items-center border-t border-gray-100 pt-6">
            <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
              {{ discussion.authorName?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ discussion.authorName }}</p>
              <p class="text-xs text-gray-500">Original Poster</p>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💬 Responses</span>
        <span class="bg-gray-200 text-gray-700 text-sm py-0.5 px-2 rounded-full">{{ responses.length }}</span>
      </h3>

      <div class="space-y-4 mb-8">
        <div 
          v-for="reply in responses" 
          :key="reply.id"
          class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative group"
        >
          <div v-if="reply.reportCount > 0" class="absolute top-4 right-12 text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded">
             ⚠ {{ reply.reportCount }} Flags
          </div>

          <div class="absolute top-4 right-4 flex gap-2">
            
            <button 
              @click="reportReply(reply)"
              class="text-gray-300 hover:text-orange-500 transition" 
              title="Report content"
            >
              🚩
            </button>

            <button 
              v-if="canDelete(reply)"
              @click="deleteReply(reply.id)"
              class="text-gray-300 hover:text-red-600 transition"
              title="Delete message"
            >
              🗑
            </button>
          </div>

          <div class="flex items-start gap-4">
             <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
              {{ reply.authorName?.charAt(0).toUpperCase() }}
            </div>
            
            <div class="flex-grow">
              <div class="flex items-baseline justify-between mb-1">
                <span class="font-semibold text-sm text-gray-900 mr-2">{{ reply.authorName }}</span>
                <span class="text-xs text-gray-400">
                  {{ reply.createdAt?.toDate().toLocaleDateString() }}
                </span>
              </div>
              
              <div v-if="reply.reportCount > 5" class="bg-gray-50 p-2 rounded text-gray-500 italic text-sm">
                [Content hidden due to community reports]
              </div>
              <p v-else class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {{ reply.content }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="user" class="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">Join the conversation</label>
        <textarea 
          v-model="newReply"
          rows="3" 
          class="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 mb-3 outline-none"
          placeholder="Write your response here..."
        ></textarea>
        <div class="flex justify-end">
          <button 
            @click="submitReply"
            :disabled="isSubmitting || !newReply"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {{ isSubmitting ? 'Posting...' : 'Post Reply' }}
          </button>
        </div>
      </div>

      <div v-else class="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
        <p class="text-blue-800 mb-3 font-medium">Log in to join the discussion.</p>
        <router-link to="/login" class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
          Log In
        </router-link>
      </div>

    </div>
  </div>
</template>