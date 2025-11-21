<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import { saveContactMessage, type ContactFormData } from '../services/firebaseService'

// Toast notification
const toast = useToast()

// Intersection observer for animations
const useIntersectionAnimation = (threshold = 0.1) => {
  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    if (!elementRef.value) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) isVisible.value = true
      },
      { threshold }
    )
    observer.observe(elementRef.value)
  })

  return { isVisible, elementRef }
}

const section = useIntersectionAnimation()

// Form validation schema using Yup
const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  subject: yup
    .string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must not exceed 100 characters'),
  message: yup
    .string()
    .required('Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must not exceed 1000 characters')
})

// Form setup
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema
})

// Form fields
const { value: name } = useField<string>('name')
const { value: email } = useField<string>('email')
const { value: subject } = useField<string>('subject')
const { value: message } = useField<string>('message')

// Loading state
const isSubmitting = ref(false)

// Character counts
const messageCharCount = computed(() => message.value?.length || 0)
const subjectCharCount = computed(() => subject.value?.length || 0)

// Contact info
const contactInfo = [
  {
    icon: 'email',
    title: 'Email',
    value: 'contact@example.com',
    link: 'mailto:contact@example.com'
  },
  {
    icon: 'phone',
    title: 'Phone',
    value: '+234 801 234 5678',
    link: 'tel:+2348012345678'
  },
  {
    icon: 'location',
    title: 'Location',
    value: 'Lagos, Nigeria',
    link: 'https://maps.google.com'
  }
]

// Form submission
const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true

  try {
    const formData: ContactFormData = {
      name: values.name,
      email: values.email,
      subject: values.subject,
      message: values.message
    }

    await saveContactMessage(formData)

    // Show success toast
    toast.success('Message sent successfully! I\'ll get back to you soon.', {
      timeout: 5000,
      position: 'top-right'
    })

    // Reset form
    resetForm()
  } catch (error) {
    console.error('Form submission error:', error)
    toast.error('Failed to send message. Please try again later.', {
      timeout: 5000,
      position: 'top-right'
    })
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <section
    id="contact"
    :ref="section.elementRef"
    class="min-h-screen py-20 px-4 md:px-8 bg-background transition-all duration-700 ease-out"
    :class="section.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg mb-4">
          <span class="text-2xl">📧</span>
          <span class="text-sm font-medium text-accent">Get In Touch</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Let's <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Connect</span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a project in mind or just want to chat? Drop me a message and I'll get back to you as soon as possible.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Contact Info Cards -->
        <div class="lg:col-span-1 space-y-6">
          <div
            v-for="info in contactInfo"
            :key="info.title"
            class="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg v-if="info.icon === 'email'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="info.icon === 'phone'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <svg v-else-if="info.icon === 'location'" class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-foreground mb-1">{{ info.title }}</h3>
                <a
                  :href="info.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {{ info.value }}
                </a>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
            <h3 class="text-lg font-bold text-foreground mb-3">Response Time</h3>
            <div class="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Usually within 24 hours</span>
            </div>
            <p class="text-xs text-muted-foreground">
              I aim to respond to all inquiries within one business day. For urgent matters, please call directly.
            </p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <form @submit="onSubmit" class="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <!-- Name Field -->
            <div class="mb-6">
              <label for="name" class="block text-sm font-semibold text-foreground mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                placeholder="John Doe"
                class="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                :class="errors.name ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <p v-if="errors.name" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.name }}
              </p>
            </div>

            <!-- Email Field -->
            <div class="mb-6">
              <label for="email" class="block text-sm font-semibold text-foreground mb-2">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="john@example.com"
                class="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                :class="errors.email ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <p v-if="errors.email" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ errors.email }}
              </p>
            </div>

            <!-- Subject Field -->
            <div class="mb-6">
              <label for="subject" class="block text-sm font-semibold text-foreground mb-2">
                Subject <span class="text-red-500">*</span>
              </label>
              <input
                id="subject"
                v-model="subject"
                type="text"
                placeholder="Project Inquiry"
                class="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                :class="errors.subject ? 'border-red-500 focus:ring-red-500' : ''"
              />
              <div class="flex items-center justify-between mt-2">
                <p v-if="errors.subject" class="text-sm text-red-500 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.subject }}
                </p>
                <p v-else class="text-xs text-muted-foreground">
                  {{ subjectCharCount }}/100
                </p>
              </div>
            </div>

            <!-- Message Field -->
            <div class="mb-6">
              <label for="message" class="block text-sm font-semibold text-foreground mb-2">
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="message"
                rows="6"
                placeholder="Tell me about your project or inquiry..."
                class="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground resize-none"
                :class="errors.message ? 'border-red-500 focus:ring-red-500' : ''"
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <p v-if="errors.message" class="text-sm text-red-500 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ errors.message }}
                </p>
                <p
                  v-else
                  class="text-xs transition-colors"
                  :class="messageCharCount > 1000 ? 'text-red-500' : messageCharCount > 900 ? 'text-yellow-500' : 'text-muted-foreground'"
                >
                  {{ messageCharCount }}/1000
                </p>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-6 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else>Sending...</span>

              <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>

            <!-- Privacy Notice -->
            <p class="mt-4 text-xs text-center text-muted-foreground">
              Your information is secure and will only be used to respond to your inquiry.
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Prevent textarea resize handle */
textarea {
  resize: vertical;
  min-height: 150px;
}
</style>
