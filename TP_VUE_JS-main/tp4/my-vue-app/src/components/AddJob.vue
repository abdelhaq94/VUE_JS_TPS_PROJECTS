<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
import { ref, onMounted } from 'vue';
import axios from 'axios';

const jobData = ref({
  title: '',
  type: '',
  description: '',
  location: '',
  salary: ''
});
const submitForm = async () => {
    try {
      await axios.post('http://localhost:3001/jobs', jobData.value);
      alert('Job created successfully!');
      // Reset form
      jobData.value = {
        title: '',
        type: '',
        description: '',
        location: '',
        salary: ''
      };
    }
   catch (err) {
    console.log(err.message);
    alert('An error occurred while submitting the form.');
  }
};
</script>
<template>
  <div class="bg-gray-50 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">

      <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-8">
         Add New Job Listing
      </h2>

      <form 
        @submit.prevent="submitForm" 
        class="bg-white shadow-2xl rounded-xl p-6 md:p-10"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              id="title"
              type="text"
              v-model="jobData.title"
              required
              placeholder="e.g., Senior Frontend Developer"
              class="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          <div>
            <label for="type" class="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              id="type"
              v-model="jobData.type"
              required
              class="border border-gray-300 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Remote">Remote</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
        
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            v-model="jobData.description"
            rows="6"
            required
            placeholder="Outline the role responsibilities, requirements, and benefits..."
            class="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              id="location"
              type="text"
              v-model="jobData.location"
              required
              placeholder="e.g., San Francisco, CA or Remote"
              class="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>

          <div>
            <label for="salary" class="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
            <input
              id="salary"
              type="text"
              v-model="jobData.salary"
              required
              placeholder="e.g., $100k - $120k"
              class="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </div>
        </div>

        <button
          type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-150 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Post Job Listing
        </button>
      </form>
    </div>
  </div>
</template>