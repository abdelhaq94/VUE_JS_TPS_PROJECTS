<script setup>
import {ref, onMounted } from 'vue';
import { RouterLink, useRoute} from 'vue-router';
import { useAdminStore } from '../stores/Auth';
import axios from 'axios';

const route = useRoute();
const jobIdpar = route.params.id;
const adminStore = useAdminStore();
const job = ref({
  id: null,
  title: '',
  type: 'Full-Time',
  description: '',
  location: '',
  salary: '',
  
  
  company: {
    name: '',
    description: ''
  },
  postedDate: null
});
const GetJob= async (id) => {
  if (!id) return;
    try {
      const res = await axios.get(`http://localhost:3001/jobs/${id}`);
      job.value = res.data;
    } catch (err) {
      console.log(err.message);
    }
}
const DelJob= async () => {
    try {
      const res = await axios.delete(`http://localhost:3001/jobs/${jobIdpar}`);
    } catch (err) {
      console.log(err.message);
    }
}
onMounted(() => {
  GetJob(jobIdpar);
});
</script>
<template>
  <div class="bg-gray-100 min-h-screen pt-8 pb-16">
    <div class="max-w-4xl mx-auto px-4">
      

      <div class="bg-white shadow-2xl rounded-xl overflow-hidden">
        
        <div class="p-6 md:p-8 bg-indigo-600 text-white flex justify-between items-start">
          <div>
            <span class="text-sm font-light uppercase tracking-wider opacity-90">{{ job.type }}</span>
            <h1 class="text-3xl md:text-4xl font-extrabold mt-1 leading-tight">{{ job.title }}</h1>
            <p class="text-lg font-medium mt-1"> {{ job.company.name }}</p>
          </div>
          <div class="text-right">
            <span 
              :class="job.type === 'Remote' ? 'bg-green-300 text-green-800' : 'bg-blue-300 text-blue-800'"
              class="px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap inline-block"
            >
              {{ job.type }}
            </span>
            <p class="text-sm mt-2 opacity-80">Posted: {{ job.postedDate }}</p>
          </div>
        </div>
        
        <div class="p-6 md:p-8">
          
          <h2 class="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Description</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ job.description }}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="p-4 bg-gray-50 rounded-lg border">
              <span class="text-sm text-gray-500 block">Location</span>
              <p class="text-lg font-medium text-orange-700 mt-1">📍 {{ job.location }}</p>
            </div>
            
            <div class="p-4 bg-gray-50 rounded-lg border">
              <span class="text-sm text-gray-500 block">Salary Range</span>
              <p class="text-xl font-bold text-green-700 mt-1">💰 {{ job.salary }}</p>
            </div>
          </div>
        </div>

        <div class=" flex gap-4 p-6 md:p-8 border-t border-gray-200">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Apply Now
          </button>
          <RouterLink :to="{ name: 'editJob', params: { id: job.id } }" v-if="adminStore.role==='Admin'" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors" >edit</RouterLink>
          <RouterLink to="/main"  @click.prevent="DelJob" v-if="adminStore.role==='Admin'" class="bg-red-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors" >delete</RouterLink>

        </div>
      </div>
    </div>
  </div>
</template>