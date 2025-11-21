<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  updateTheme()
})

function toggleTheme() {
  isDark.value = !isDark.value
  updateTheme()
}

function updateTheme() {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <span v-if="isDark" class="icon">🌙</span>
    <span v-else class="icon">☀️</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  z-index: 1000;
}

.theme-toggle:hover {
  background: var(--accent);
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.icon {
  font-size: 1.5rem;
  line-height: 1;
}
</style>
