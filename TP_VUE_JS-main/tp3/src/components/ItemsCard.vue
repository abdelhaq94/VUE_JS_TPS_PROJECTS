<script setup>
const props = defineProps({
  Item: Object,
})
</script>
<template>
    <div class="border rounded-lg p-4 shadow-md bg-white">
        <h2 class="text-xl font-semibold mb-2">{{ props.Item.name }}</h2>
        <p class="text-gray-600 mb-1">Category:{{ props.Item.category }} </p>
        <p class="text-gray-600 mb-1">Availability:{{ props.Item.availability }} </p>
        <p class="text-gray-800 font-bold">Price:{{  props.Item.price }} </p>
    </div>
</template>