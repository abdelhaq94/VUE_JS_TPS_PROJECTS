<script setup>
import ItemsCard from './ItemsCard.vue'
const props = defineProps({
  FilteredItems: Array,
}) 
</script>
<template>
    <ul class=" w-[90%] mx-auto flex flex-wrap justify-center md:justify-start gap-4">
        <ItemsCard v-for="item in props.FilteredItems" key="item.id" :Item="item" class="bg-blue-200 p-4 rounded-md text-center
             basis-[250px] max-w-[250px] flex-shrink-0"/>
    </ul>
</template>