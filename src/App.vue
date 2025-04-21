<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Top nav (hidden on mobile) -->
    <div class="p-4 sm:block hidden">
      <nav class="mb-4">
        <ul class="flex justify-center gap-6">
          <li v-for="(route, index) in routes" :key="index">
            <RouterLink
              :to="route.path"
              class="text-blue-400 hover:text-blue-800"
            >
              {{ route.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex justify-center items-center">
      <div class="text-center w-full">
        <RouterView />
      </div>
    </div>

    <!-- Bottom nav (visible only on mobile) -->
    <div
      class="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
    >
      <nav class="flex justify-around py-2">
        <RouterLink
          v-for="(route, index) in routes"
          :key="index"
          :to="route.path"
          class="flex flex-col items-center text-sm text-blue-400 hover:text-blue-600"
        >
          <component :is="route.icon" class="w-6 h-6 mb-1" />
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { Home, StepForward, CircleHelp } from 'lucide-vue-next'

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Continue', path: '/continue', icon: StepForward },
  { name: 'How to Use', path: '/how-to-use', icon: CircleHelp },
]
</script>
