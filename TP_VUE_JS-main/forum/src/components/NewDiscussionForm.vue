<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user } = useAuth();

const title = ref('');
const category = ref(''); // Now an empty string for user input
const content = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!title.value || !category.value || !content.value) {
    alert("Please fill in all fields.");
    return;
  }

  isSubmitting.value = true;

  try {
    const docRef = await addDoc(collection(db, 'discussions'), {
      title: title.value,
      content: content.value,
      category: category.value.trim(), // Clean up whitespace
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email,
      createdAt: serverTimestamp()
    });

    router.push(`/discussion/${docRef.id}`);
    
  } catch (error) {
    console.error("Error creating discussion:", error);
    alert("Failed to create discussion. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Start a New Discussion</h1>
      <p class="text-gray-500 mt-2">Ask a question or share something interesting with the community.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Discussion Title</label>
          <input 
            v-model="title"
            type="text" 
            required
            placeholder="e.g., How do I secure Firestore rules?"
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 outline-none transition-colors border"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category / Tag</label>
          <input 
            v-model="category"
            type="text"
            required
            placeholder="e.g., Javascript, General, Exam Help..."
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 outline-none transition-colors border"
          />
          <p class="text-xs text-gray-500 mt-1">Type any category you like.</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea 
            v-model="content"
            rows="6" 
            required
            placeholder="Describe your question or topic in detail..."
            class="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 outline-none transition-colors border"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <router-link 
            to="/" 
            class="text-gray-600 font-medium hover:text-gray-900 px-4 py-2 transition"
          >
            Cancel
          </router-link>
          
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-70 flex items-center gap-2"
          >
            <span v-if="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSubmitting ? 'Posting...' : 'Create Discussion' }}
          </button>
        </div>

      </form>
    </div>

  </div>
</template>