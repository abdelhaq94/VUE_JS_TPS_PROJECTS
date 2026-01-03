<script setup>
import FilterPopup from './FilterPopup.vue'
import ItemsList from './ItemsList.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { watch } from 'vue'

const Items =ref(
  [
  {
    "id": 1,
    "name": "12V Battery",
    "price": 120,
    "category": "Electricity",
    "availability": "Available"
  },
  {
    "id": 2,
    "name": "Oil Filter",
    "price": 15,
    "category": "Filtration",
    "availability": "Available"
  },
  {
    "id": 3,
    "name": "Spark Plugs (x4)",
    "price": 35,
    "category": "Engine",
    "availability": "Not available"
  },
  {
    "id": 4,
    "name": "Brake Discs (x2)",
    "price": 80,
    "category": "Braking",
    "availability": "Available"
  },
  {
    "id": 5,
    "name": "Timing Belt",
    "price": 90,
    "category": "Engine",
    "availability": "Not available"
  },
  {
    "id": 6,
    "name": "Water Pump",
    "price": 70,
    "category": "Cooling",
    "availability": "Available"
  },
  {
    "id": 7,
    "name": "Rear Shock Absorbers (x2)",
    "price": 150,
    "category": "Suspension",
    "availability": "Not available"
  },
  {
    "id": 8,
    "name": "Air Filter",
    "price": 20,
    "category": "Filtration",
    "availability": "Available"
  },
  {
    "id": 9,
    "name": "ABS Sensor",
    "price": 50,
    "category": "Safety",
    "availability": "Available"
  },
  {
    "id": 10,
    "name": "Cooling Radiator",
    "price": 130,
    "category": "Cooling",
    "availability": "Not available"
  },
  {
    "id": 11,
    "name": "Alternator",
    "price": 200,
    "category": "Electricity",
    "availability": "Available"
  },
  {
    "id": 12,
    "name": "Starter Motor",
    "price": 180,
    "category": "Electricity",
    "availability": "Not available"
  },
  {
    "id": 13,
    "name": "Clutch Kit",
    "price": 220,
    "category": "Transmission",
    "availability": "Available"
  },
  {
    "id": 14,
    "name": "Fuel Injector",
    "price": 110,
    "category": "Engine",
    "availability": "Not available"
  },
  {
    "id": 15,
    "name": "Fuel Pump",
    "price": 90,
    "category": "Fuel System",
    "availability": "Available"
  },
  {
    "id": 16,
    "name": "Tire Pressure Sensor (TPMS)",
    "price": 45,
    "category": "Safety",
    "availability": "Not available"
  },
  {
    "id": 17,
    "name": "Exterior Mirror",
    "price": 60,
    "category": "Bodywork",
    "availability": "Available"
  },
  {
    "id": 18,
    "name": "Complete Exhaust",
    "price": 250,
    "category": "Exhaust",
    "availability": "Available"
  },
  {
    "id": 19,
    "name": "EGR Valve",
    "price": 140,
    "category": "Engine",
    "availability": "Not available"
  },
  {
    "id": 20,
    "name": "Turbocharger",
    "price": 400,
    "category": "Engine",
    "availability": "Available"
  },
  {
    "id": 21,
    "name": "Cylinder Head Gasket",
    "price": 75,
    "category": "Engine",
    "availability": "Not available"
  },
  {
    "id": 22,
    "name": "Steering Box",
    "price": 300,
    "category": "Steering",
    "availability": "Available"
  },
  {
    "id": 23,
    "name": "Suspension Bushing",
    "price": 35,
    "category": "Suspension",
    "availability": "Not available"
  },
  {
    "id": 24,
    "name": "Drive Shaft",
    "price": 160,
    "category": "Transmission",
    "availability": "Available"
  },
  {
    "id": 25,
    "name": "Crankshaft Position Sensor",
    "price": 50,
    "category": "Engine",
    "availability": "Not available"
  }
]

);
const FilteredItems =ref(Items.value);
const showFilter = ref(false)
const CategoryFilter = ref([])
const AvailabilityFilter = ref('')
const SortFilter = ref('')
const SearchFilter = ref('')


function updateCategories(newCategories) {
    CategoryFilter.value = newCategories
}

function updateAvailability(newAvailability) {
    AvailabilityFilter.value = newAvailability
}

function filterItems(items, CategoryFilter, AvailabilityFilter, SearchFilter, SortFilter) {
  // Clone array to avoid mutating original
  let filtered = [...items]

  // 🟦 1. Filter by Category
  if (Array.isArray(CategoryFilter) && CategoryFilter.length > 0) {
    filtered = filtered.filter(item => CategoryFilter.includes(item.category))
  }

  // 🟩 2. Filter by Availability
  if (AvailabilityFilter && AvailabilityFilter.trim() !== '') {
    filtered = filtered.filter(item => item.availability === AvailabilityFilter)
  }

  // 🟨 3. Filter by Search (case-insensitive, name match)
  if (SearchFilter && SearchFilter.trim() !== '') {
    const lowerSearch = SearchFilter.toLowerCase()
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(lowerSearch)
    )
  }

  // 🟧 4. Sort by Price (ascending/descending)
  if (SortFilter && SortFilter.trim() !== '') {
    filtered.sort((a, b) => {
      const priceA = Number(a.price) || 0
      const priceB = Number(b.price) || 0

      if (SortFilter === 'Ascending') {
        return priceA - priceB
      } else if (SortFilter === 'Descending') {
        return priceB - priceA
      }
      return 0
    })
  }

  return filtered
}

watch(
  [CategoryFilter, AvailabilityFilter, SearchFilter, SortFilter, Items],
  () => {
    // You don’t need new/old values, just trigger logic
    if (Items.value) {
      FilteredItems.value = filterItems(
        Items.value,
        CategoryFilter.value,
        AvailabilityFilter.value,
        SearchFilter.value,
        SortFilter.value
      )
    }
  },
  { deep: true } // optional, only if your filters are arrays/objects that change internally
)

</script>





<template>
    <div
    :class="{ 'blur-sm pointer-events-none': showFilter }"
    >
    <div
  class="flex flex-wrap justify-end items-center gap-4 p-4"
>
  <!-- Sorting (radio buttons) -->
  <div class="flex items-center gap-6 flex-wrap">
    <div class="flex items-center gap-4">
      <label class="flex items-center gap-2">
        <input
          type="radio"
          name="sortOrder"
          value="Ascending"
          v-model="SortFilter"
        />
        Ascending
      </label>

      <label class="flex items-center gap-2">
        <input
          type="radio"
          name="sortOrder"
          value="Descending"
          v-model="SortFilter"
        />
        Descending
      </label>
    </div>
  </div>

  <!-- Filter button -->
  <button
    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
    @click="showFilter = true"
  >
    Filter
  </button>

  <!-- Search input -->
  <div class="relative w-full sm:w-auto">
    <input
      type="text"
      v-model="SearchFilter"
      placeholder="Search..."
      class="pl-10 pr-3 py-1 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</div>
     <ItemsList :FilteredItems="FilteredItems"/>
    </div>
        <FilterPopup
      v-if="showFilter"
      :selectedCategories="CategoryFilter"
      :selectedAvailability="AvailabilityFilter"
      @update:categories="updateCategories"
      @update:availability="updateAvailability"
      @close="showFilter = false"
    />
    
</template>