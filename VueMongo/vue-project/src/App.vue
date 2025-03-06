<script setup>
import Navbar from './components/Navbar.vue'
import { RouterView } from 'vue-router'
import './assets/styles.css'
</script>

<template>
  <div>
    <Navbar />
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>

