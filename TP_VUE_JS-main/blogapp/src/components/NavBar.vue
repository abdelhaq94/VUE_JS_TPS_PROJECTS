<script>

</script>
<template>
    <nav class="bg-white dark:bg-slate-800 shadow-sm fixed w-full z-50 top-0 left-0 border-b border-slate-200 dark:border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            
            <div class="flex-shrink-0 flex items-center">
                <router-link to="/" class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    Blog<span class="text-slate-900 dark:text-white">UI</span>
                </router-link>
            </div>

            <div class="hidden md:flex items-center space-x-8">
                <router-link to="/" class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200">
                    Home
                </router-link>
                
                <router-link to="/create" class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Post
                </router-link>
            </div>

            <div class="md:hidden flex items-center">
                <button class="text-slate-600 dark:text-slate-300 hover:text-indigo-600">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</nav>
</template>