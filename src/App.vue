<template>
  <div
    class="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"
  >
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
  </div>
</template>

<script setup>
import { Home, StepForward } from 'lucide-vue-next' // íconos bonitos

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Continue', path: '/continue', icon: StepForward },
]
</script>
