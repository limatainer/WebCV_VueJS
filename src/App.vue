<script setup lang="ts">
import Contact from './components/Contact.vue';
import Experience from './components/Experience.vue';
import Footer from './components/Footer.vue';
import Home from './components/Home.vue';
import Navigation from './components/Navigation.vue';
import Projects from './components/Projects.vue';
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <Navigation />
    <ThemeToggle />
    <Home msg="Welcome to your portfolio!" />
    <Projects />
    <Experience />
    <Contact />
    <Footer />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em var(--primary));
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em var(--accent));
}
</style>
