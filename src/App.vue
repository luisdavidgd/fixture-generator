<template>
  <div
    class="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"
  >
    <div class="min-h-screen flex justify-center items-center">
      <div class="text-center">
        <div class="p-4">
          <nav class="mb-4">
            <ul class="flex">
              <li v-for="(route, index) in routes" :key="index" class="mr-6">
                <RouterLink
                  :to="route.path"
                  class="text-blue-400 hover:text-blue-800"
                >
                  {{ route.name }}
                </RouterLink>
              </li>
            </ul>
          </nav>

          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const routes = [
  { name: 'Generate Fixture', path: '/' },
  { name: 'Continue Fixture', path: '/continue' },
]
</script>
