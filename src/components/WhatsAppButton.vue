<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

// WhatsApp configuration
const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348012345678' // Default number
const defaultMessage = "Hi! I visited your portfolio and would like to connect."

// WhatsApp URL
const whatsappUrl = computed(() => {
  const message = encodeURIComponent(defaultMessage)
  return `https://wa.me/${phoneNumber}?text=${message}`
})

// Tooltip visibility
const showTooltip = ref(false)

// Button visibility based on scroll (optional feature)
const isVisible = ref(true)
const lastScrollY = ref(0)

// Handle scroll to show/hide button (optional)
const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Always show button at top of page
  if (currentScrollY < 100) {
    isVisible.value = true
  } else {
    // Show when scrolling down, hide when scrolling up
    isVisible.value = currentScrollY < lastScrollY.value
  }

  lastScrollY.value = currentScrollY
}

// Optional: Enable scroll behavior
const enableScrollBehavior = false // Set to true to enable hide on scroll up

onMounted(() => {
  if (enableScrollBehavior) {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (enableScrollBehavior) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-0"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-0"
  >
    <div
      v-show="isVisible"
      class="whatsapp-button-container fixed z-50"
    >
      <!-- Tooltip -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-2"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-2"
      >
        <div
          v-show="showTooltip"
          class="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
        >
          Chat with me
          <!-- Tooltip Arrow -->
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-8 border-transparent border-l-foreground"></div>
        </div>
      </Transition>

      <!-- WhatsApp Button -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
        class="whatsapp-button flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-full shadow-2xl hover:shadow-whatsapp transition-all duration-300 hover:scale-110 relative group"
        aria-label="Chat on WhatsApp"
      >
        <!-- Pulse Animation Ring -->
        <span class="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-75"></span>

        <!-- WhatsApp Icon -->
        <svg
          class="w-8 h-8 md:w-9 md:h-9 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>

        <!-- Optional: Notification Badge (uncomment to show) -->
        <!-- <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span> -->
      </a>
    </div>
  </Transition>
</template>

<style scoped>
/* WhatsApp Brand Colors */
.bg-whatsapp {
  background-color: #25D366;
}

.bg-whatsapp-hover {
  background-color: #20BA5A;
}

.shadow-whatsapp {
  box-shadow: 0 0 30px rgba(37, 211, 102, 0.5);
}

/* Button Positioning */
.whatsapp-button-container {
  bottom: 30px;
  right: 30px;
}

/* Mobile Positioning - Adjusted to avoid navigation */
@media (max-width: 768px) {
  .whatsapp-button-container {
    bottom: 80px;
    right: 20px;
  }
}

/* Pulse Animation */
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Ensure button stays above other elements */
.whatsapp-button-container {
  z-index: 1000;
}

/* Smooth transitions */
.whatsapp-button {
  transition-property: transform, box-shadow, background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Active state */
.whatsapp-button:active {
  transform: scale(0.95);
}

/* Focus visible for accessibility */
.whatsapp-button:focus-visible {
  outline: 2px solid #25D366;
  outline-offset: 2px;
}
</style>
