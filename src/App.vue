<template>
  <div class="p-4">
    <nav class="mb-4">
      <RouterLink to="/" class="mr-4">Generate Fixture</RouterLink>
      <RouterLink to="/continue">Continue Fixture</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>
