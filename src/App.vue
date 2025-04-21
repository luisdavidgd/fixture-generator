<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Top nav (hidden on mobile) -->
    <div class="p-4 sm:block hidden">
      <nav class="mb-4">
        <ul class="flex justify-center gap-6">
          <li v-for="(routeItem, index) in routes" :key="index">
            <RouterLink
              :to="routeItem.path"
              :class="[
                'hover:text-white',
                isActive(routeItem.path)
                  ? 'text-white font-bold'
                  : 'text-blue-400',
              ]"
            >
              {{ routeItem.name }}
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
          v-for="(routeItem, index) in routes"
          :key="index"
          :to="routeItem.path"
          :class="[
            'flex flex-col items-center text-sm hover:text-blue-600',
            isActive(routeItem.path) ? 'text-white font-bold' : 'text-blue-400',
          ]"
        >
          <component :is="routeItem.icon" class="w-6 h-6 mb-1" />
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, StepForward, CircleHelp } from 'lucide-vue-next'

const route = useRoute()

const routes = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Continue', path: '/continue', icon: StepForward },
  { name: 'How to Use', path: '/how-to-use', icon: CircleHelp },
]

const isActive = (path) => route.path === path
</script>
