<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Experience interface
interface Experience {
  id: string
  company: string
  role: string
  duration: string
  startDate: string
  endDate: string
  location: string
  description: string
  achievements: string[]
  logo?: string
  logoEmoji?: string
  technologies: string[]
}

// Intersection observer composable for single element
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

// State
const section = useIntersectionAnimation()

// Visibility state for each experience card
const experienceVisibility = ref<boolean[]>([])

// Refs for experience cards
const experienceElements = ref<(HTMLElement | null)[]>([])

// Set ref for experience card
const setExperienceRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    experienceElements.value[index] = el
  }
}

// Sample experience data
const experiences = ref<Experience[]>([
  {
    id: '1',
    company: 'Tech Innovators Inc.',
    role: 'Senior Full-Stack Developer',
    duration: '2 years 4 months',
    startDate: 'Jan 2022',
    endDate: 'Present',
    location: 'Remote',
    description: 'Leading development of scalable web applications and mentoring junior developers in modern frameworks.',
    achievements: [
      'Architected and deployed 5+ production-ready applications serving 100K+ users',
      'Reduced application load time by 60% through performance optimization',
      'Mentored 8 junior developers in Vue.js and TypeScript best practices',
      'Implemented CI/CD pipelines reducing deployment time by 75%'
    ],
    logoEmoji: '🚀',
    technologies: ['Vue.js', 'Node.js', 'TypeScript', 'Firebase', 'Docker']
  },
  {
    id: '2',
    company: 'Digital Solutions Ltd.',
    role: 'Frontend Developer',
    duration: '1 year 8 months',
    startDate: 'May 2020',
    endDate: 'Dec 2021',
    location: 'Lagos, Nigeria',
    description: 'Developed responsive user interfaces and collaborated with cross-functional teams to deliver high-quality products.',
    achievements: [
      'Built reusable component library used across 10+ projects',
      'Improved mobile responsiveness increasing mobile traffic by 45%',
      'Collaborated with UX team to redesign flagship product',
      'Achieved 95+ Lighthouse performance scores consistently'
    ],
    logoEmoji: '💼',
    technologies: ['React', 'JavaScript', 'TailwindCSS', 'REST APIs']
  },
  {
    id: '3',
    company: 'SheCodes Africa',
    role: 'Web Development Mentor',
    duration: '1 year',
    startDate: 'Jan 2020',
    endDate: 'Dec 2020',
    location: 'Remote',
    description: 'Empowered aspiring female developers through training sessions and code reviews.',
    achievements: [
      'Trained 50+ women in web development fundamentals',
      'Conducted weekly live coding sessions and Q&A workshops',
      'Reviewed and provided feedback on 200+ student projects',
      'Developed curriculum content for HTML, CSS, and JavaScript courses'
    ],
    logoEmoji: '👩‍💻',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Git', 'VS Code']
  },
  {
    id: '4',
    company: 'Freelance',
    role: 'Web Developer',
    duration: '2 years',
    startDate: 'Jun 2018',
    endDate: 'Apr 2020',
    location: 'Remote',
    description: 'Delivered custom web solutions for small businesses and startups across various industries.',
    achievements: [
      'Successfully completed 25+ client projects with 100% satisfaction rate',
      'Specialized in e-commerce and business websites',
      'Managed entire project lifecycle from discovery to deployment',
      'Built long-term relationships with 15+ recurring clients'
    ],
    logoEmoji: '🌟',
    technologies: ['WordPress', 'PHP', 'JavaScript', 'MySQL', 'cPanel']
  }
])

// Initialize visibility array
experienceVisibility.value = new Array(experiences.value.length).fill(false)

// Set up intersection observers for experience cards
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = experienceElements.value.findIndex((el) => el === entry.target)
          if (index !== -1) {
            experienceVisibility.value[index] = true
          }
        }
      })
    },
    { threshold: 0.2 }
  )

  experienceElements.value.forEach((el) => {
    if (el) observer.observe(el)
  })
})
</script>

<template>
  <section
    id="experience"
    :ref="section.elementRef"
    class="min-h-screen py-20 px-4 md:px-8 bg-muted/30 transition-all duration-700 ease-out"
    :class="section.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <div class="max-w-6xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg mb-4">
          <span class="text-2xl">💼</span>
          <span class="text-sm font-medium text-accent">Career Journey</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Professional <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Experience</span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          {{ experiences.length }} positions spanning {{ experiences.reduce((sum, exp) => {
            const years = parseFloat(exp.duration.match(/(\d+\.?\d*)\s*year/)?.[1] || '0')
            const months = parseFloat(exp.duration.match(/(\d+)\s*month/)?.[1] || '0')
            return sum + years + (months / 12)
          }, 0).toFixed(1) }}+ years of professional growth
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Timeline Line (vertical center line) -->
        <div class="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-accent to-primary/20"></div>

        <!-- Timeline Line (left side for mobile) -->
        <div class="lg:hidden absolute left-8 md:left-12 top-0 w-0.5 h-full bg-gradient-to-b from-primary via-accent to-primary/20"></div>

        <!-- Experience Items -->
        <div class="space-y-12 lg:space-y-24">
          <article
            v-for="(experience, index) in experiences"
            :key="experience.id"
            :ref="(el) => setExperienceRef(el as HTMLElement, index)"
            class="relative transition-all duration-700 ease-out"
            :class="experienceVisibility[index] ? 'opacity-100 translate-x-0' : index % 2 === 0 ? 'opacity-0 -translate-x-8' : 'opacity-0 translate-x-8'"
          >
            <!-- Desktop Layout: Alternating left-right -->
            <div class="hidden lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <!-- Left Side (even indices) -->
              <div v-if="index % 2 === 0" class="text-right pr-12">
                <div class="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/50 group">
                  <!-- Company Header -->
                  <div class="flex items-start justify-end gap-4 mb-4">
                    <div class="text-right">
                      <h3 class="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {{ experience.role }}
                      </h3>
                      <p class="text-lg text-primary font-semibold mt-1">{{ experience.company }}</p>
                      <p class="text-sm text-muted-foreground mt-1">{{ experience.location }}</p>
                    </div>
                    <div class="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {{ experience.logoEmoji }}
                    </div>
                  </div>

                  <!-- Duration Badge -->
                  <div class="flex justify-end mb-4">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg">
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm font-medium text-accent">{{ experience.startDate }} - {{ experience.endDate }}</span>
                      <span class="text-xs text-muted-foreground">({{ experience.duration }})</span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-muted-foreground mb-6">{{ experience.description }}</p>

                  <!-- Achievements -->
                  <div class="mb-6">
                    <h4 class="text-sm font-semibold text-foreground mb-3 flex items-center justify-end gap-2">
                      <span>Key Achievements</span>
                      <span class="text-primary">🏆</span>
                    </h4>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                      <li v-for="(achievement, idx) in experience.achievements" :key="idx" class="flex items-start justify-end gap-2">
                        <span class="text-right">{{ achievement }}</span>
                        <span class="text-primary flex-shrink-0">✓</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Technologies -->
                  <div class="flex flex-wrap gap-2 justify-end">
                    <span
                      v-for="tech in experience.technologies"
                      :key="tech"
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Timeline Node (center) -->
              <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-10 group-hover:scale-125 transition-transform">
                <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
              </div>

              <!-- Right Side (odd indices) -->
              <div v-if="index % 2 !== 0" class="pl-12">
                <div class="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/50 group">
                  <!-- Company Header -->
                  <div class="flex items-start gap-4 mb-4">
                    <div class="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {{ experience.logoEmoji }}
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {{ experience.role }}
                      </h3>
                      <p class="text-lg text-primary font-semibold mt-1">{{ experience.company }}</p>
                      <p class="text-sm text-muted-foreground mt-1">{{ experience.location }}</p>
                    </div>
                  </div>

                  <!-- Duration Badge -->
                  <div class="mb-4">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-lg">
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm font-medium text-accent">{{ experience.startDate }} - {{ experience.endDate }}</span>
                      <span class="text-xs text-muted-foreground">({{ experience.duration }})</span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-muted-foreground mb-6">{{ experience.description }}</p>

                  <!-- Achievements -->
                  <div class="mb-6">
                    <h4 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span class="text-primary">🏆</span>
                      <span>Key Achievements</span>
                    </h4>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                      <li v-for="(achievement, idx) in experience.achievements" :key="idx" class="flex items-start gap-2">
                        <span class="text-primary flex-shrink-0">✓</span>
                        <span>{{ achievement }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Technologies -->
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tech in experience.technologies"
                      :key="tech"
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Spacer for opposite side -->
              <div v-if="index % 2 === 0"></div>
              <div v-else></div>
            </div>

            <!-- Mobile/Tablet Layout: All items on right side -->
            <div class="lg:hidden flex gap-6 md:gap-8">
              <!-- Timeline Node (left) -->
              <div class="flex flex-col items-center flex-shrink-0">
                <div class="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full border-4 border-background shadow-lg flex items-center justify-center relative z-10">
                  <span class="text-xl md:text-2xl">{{ experience.logoEmoji }}</span>
                  <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              <!-- Content Card (right) -->
              <div class="flex-1 pb-8">
                <div class="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-primary/50 group">
                  <!-- Company Header -->
                  <div class="mb-4">
                    <h3 class="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {{ experience.role }}
                    </h3>
                    <p class="text-base md:text-lg text-primary font-semibold mt-1">{{ experience.company }}</p>
                    <p class="text-sm text-muted-foreground mt-1">{{ experience.location }}</p>
                  </div>

                  <!-- Duration Badge -->
                  <div class="mb-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="text-xs md:text-sm font-medium text-accent">{{ experience.startDate }} - {{ experience.endDate }}</span>
                      <span class="text-xs text-muted-foreground">({{ experience.duration }})</span>
                    </div>
                  </div>

                  <!-- Description -->
                  <p class="text-sm md:text-base text-muted-foreground mb-4">{{ experience.description }}</p>

                  <!-- Achievements -->
                  <div class="mb-4">
                    <h4 class="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span class="text-primary">🏆</span>
                      <span>Key Achievements</span>
                    </h4>
                    <ul class="space-y-2 text-sm text-muted-foreground">
                      <li v-for="(achievement, idx) in experience.achievements" :key="idx" class="flex items-start gap-2">
                        <span class="text-primary flex-shrink-0">✓</span>
                        <span>{{ achievement }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Technologies -->
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tech in experience.technologies"
                      :key="tech"
                      class="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                    >
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Download Resume CTA -->
      <div class="text-center mt-16">
        <a
          href="#"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Full Resume
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
