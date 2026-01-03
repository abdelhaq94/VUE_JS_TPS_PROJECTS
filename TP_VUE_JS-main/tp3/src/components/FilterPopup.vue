<script setup>
const props = defineProps({
  selectedCategories: Array,
  selectedAvailability: String
})
const emit = defineEmits(['close', 'update:categories', 'update:availability'])
function toggleCategory(cat) {
  let updated = [...props.selectedCategories]
  if (updated.includes(cat)) {
    updated = updated.filter(c => c !== cat)
  } else {
    updated.push(cat)
  }
  emit('update:categories', updated)
}

function setAvailability(status) {
  emit('update:availability', status)
}
function clearAllFilters() {
  emit('update:categories', [])
  emit('update:availability', "")
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white shadow-lg rounded-lg p-6 w-80 relative">
      <div class="mt-6 flex flex-col justify-end gap-2">
        <!-- Availability Section -->
      <div class="mb-6">
        <h3 class="text-md font-medium mb-2">Availability</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input type="radio"
             name="availability"
            :checked="selectedAvailability==='Available'"
             @change="setAvailability('Available')" />
            Available
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" 
            name="availability"
            :checked="selectedAvailability==='Not available'"
            @change="setAvailability('Not available')"/>
            Not Available
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" 
            name="availability"
            :checked="selectedAvailability===''"
            @change="setAvailability('')"/>
            Show All
          </label>
        </div>
      </div>

      <!-- Category Section -->
      <div class="mb-6">
        <h3 class="text-md font-medium mb-2">Category</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input
          type="checkbox"
          value="Suspension"
          :checked="selectedCategories.includes('Suspension')"
          @change="toggleCategory('Suspension')"
        />
        Suspension
          </label>
          <label class="flex items-center gap-2">
            <input
          type="checkbox"
          value="Furniture"
          :checked="selectedCategories.includes('Filtration')"
          @change="toggleCategory('Filtration')"
        /> Filtration
          </label>
        </div>
      </div>
      <button
          class="bg-blue-400 px-4 py-2 rounded hover:bg-blue-500"
          @click="clearAllFilters()"
        >
          Reset filters
        </button>
        <button
          @click="emit('close')"
          class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

