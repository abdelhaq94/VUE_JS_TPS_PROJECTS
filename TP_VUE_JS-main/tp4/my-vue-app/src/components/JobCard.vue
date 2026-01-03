<script setup>
import { defineProps, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

defineProps({
  job: {
    type: Object,    
    required: true 
  },
  Editable: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ job.type }}</div>
        <h3 class="text-xl font-bold">{{ job.title }}</h3>
      </div>

      <div class="mb-5">
        <div>
          {{ job.description }}
        </div>
      </div>

      <h3 class="text-blue-500 mb-2">{{ job.salary }} / Year</h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-orange-700"></i>
          {{ job.location }}
        </div>
      </div>
      <div class="flex gap-4 ">
          <RouterLink :to="{ name: 'editJob', params: { id: job.id } }" v-if="Editable" class="bg-blue-400 p-2 pl-4 pr-4 rounded-xl" >edit</RouterLink>
          <RouterLink :to="{ name: 'viewjob', params: { id: job.id } }" class="bg-blue-400 p-2 pl-4 pr-4 rounded-xl" >view</RouterLink>
        </div>
    </div>
  </div>
</template>