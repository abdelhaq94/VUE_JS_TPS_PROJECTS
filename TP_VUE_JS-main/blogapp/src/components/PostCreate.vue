<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

const post = reactive({
  id: '0', // will be overwritten
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image: '',
  category: '',
  date: new Date().toLocaleDateString(),
  readTime: '5 min read',
  tags: [],
  author: {
    name: '',
    role: '',
    avatar: ''
  }
});

const tagsInput = ref('');
const postsList = ref([]);

// Load existing posts to calculate next ID
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/posts');
    postsList.value = response.data;
  } catch (err) {
    console.error('Failed to fetch posts for ID generation:', err);
  }
});

const submitPost = async () => {
  // Convert comma-separated tags to array
  post.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

  // Auto-generate string ID
  const maxId = postsList.value.reduce((max, p) => {
    const numId = Number(p.id);
    return !isNaN(numId) && numId > max ? numId : max;
  }, 0);
  post.id = String(maxId + 1);

  try {
    const response = await axios.post('http://localhost:3000/posts', post);
    console.log('Post created:', response.data);
    alert('Post created successfully!');
    
    // Reset form
    Object.keys(post).forEach(key => {
      if (key === 'author') {
        post.author.name = '';
        post.author.role = '';
        post.author.avatar = '';
      } else if (key === 'tags') {
        post.tags = [];
      } else if (key === 'date') {
        post.date = new Date().toLocaleDateString();
      } else if (key === 'id') {
        post.id = '0';
      } else {
        post[key] = '';
      }
    });
    tagsInput.value = '';

    // Update posts list for next ID
    postsList.value.push(response.data);
  } catch (err) {
    console.error(err);
    alert('Failed to create post.');
  }
};
</script>
<template>
  <section class="bg-slate-50 dark:bg-slate-900 min-h-screen py-12">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">Create New Post</h2>

      <form @submit.prevent="submitPost" class="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
        
        <!-- Title -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Title</label>
          <input 
            v-model="post.title" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Enter post title"
            required
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Slug</label>
          <input 
            v-model="post.slug" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Enter post slug"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Category</label>
          <input 
            v-model="post.category" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Enter post category"
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Content</label>
          <textarea 
            v-model="post.content" 
            rows="8" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Write your post content"
            required
          ></textarea>
        </div>

        <!-- Image URL -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Image URL</label>
          <input 
            v-model="post.image" 
            type="url" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Tags (comma separated)</label>
          <input 
            v-model="tagsInput" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Design, UI, UX"
          />
        </div>

        <!-- Author -->
        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Author Name</label>
          <input 
            v-model="post.author.name" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Author Name"
          />
        </div>

        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Author Role</label>
          <input 
            v-model="post.author.role" 
            type="text" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="Author Role"
          />
        </div>

        <div>
          <label class="block text-slate-700 dark:text-slate-300 font-medium mb-2">Author Avatar URL</label>
          <input 
            v-model="post.author.avatar" 
            type="url" 
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
        >
          Create Post
        </button>

      </form>
    </div>
  </section>
</template>

