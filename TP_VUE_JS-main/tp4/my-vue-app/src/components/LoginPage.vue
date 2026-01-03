<script setup>
import { useAdminStore } from '../stores/Auth.js'
const auth=useAdminStore()


</script>
<template>
    <div class="w-1/3 mx-auto mt-50 p-12 rounded-[30px] border-1 bg-gray-50 flex gap-15 justify-center items-center">
        <RouterLink class="p-4 pl-6 pr-6 bg-blue-200 rounded-[20px] cursor-pointer" to="/main/" @click="auth.Makeadmin()">Admin</RouterLink>
        <RouterLink class="p-4 pl-6 pr-6 bg-blue-200 rounded-[20px] cursor-pointer" to="/main/" @click="auth.Makeuser()">User</RouterLink>
    </div>
</template>