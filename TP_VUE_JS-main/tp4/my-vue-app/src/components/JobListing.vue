<script setup>
import JobCard from './JobCard.vue';
import { onMounted, onUnmounted, reactive , ref } from 'vue';
import { useAdminStore } from '../stores/Auth.js';
import axios from 'axios';


const adminStore = useAdminStore();
const state = reactive({
  jobs:[],
});
const JobTypes = ref([]);
onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:3001/jobs");
    console.log('dddddd');
    state.jobs = res.data
  } catch (err) {
    error.value = err.message
  }
});
</script>

<template>
  
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-grey-300 mb-6 text-center">
        Browse Jobs
      </h2>
      <div  class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobCard
          v-for="job in state.jobs"
          :key="job.id"
          :job="job"
          :Editable="adminStore.role==='Admin'"
        />
      </div>
    </div>
  </section>
</template>