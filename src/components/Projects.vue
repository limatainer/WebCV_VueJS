<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Project interface
interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

// Intersection observer composable for animations
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
const selectedFilter = ref<string>('all')
const section = useIntersectionAnimation()

// Sample projects data
const projects = ref<Project[]>([
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, product management, and real-time inventory tracking.',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    technologies: ['Vue.js', 'Node.js', 'Firebase', 'Stripe', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task manager with real-time updates, team workspaces, and advanced filtering capabilities.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    technologies: ['React', 'TypeScript', 'Firebase', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'Beautiful weather application with forecasts, location search, and interactive maps using external APIs.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
    technologies: ['Vue.js', 'TypeScript', 'APIs', 'Chart.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false
  },
  {
    id: '4',
    title: 'Blog CMS',
    description: 'Content management system with markdown support, SEO optimization, and analytics dashboard.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false
  },
  {
    id: '5',
    title: 'Fitness Tracker',
    description: 'Mobile-responsive fitness app with workout logging, progress tracking, and personalized recommendations.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    technologies: ['React', 'Firebase', 'Chart.js', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: '6',
    title: 'Real Estate Portal',
    description: 'Property listing platform with advanced search filters, virtual tours, and contact management.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    technologies: ['Vue.js', 'Python', 'Azure', 'TailwindCSS'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: false
  }
])

// Get all unique technologies
const allTechnologies = computed(() => {
  const techSet = new Set<string>()
  projects.value.forEach(project => {
    project.technologies.forEach(tech => techSet.add(tech))
  })
  return Array.from(techSet).sort()
})

// Filter projects by technology
const filteredProjects = computed(() => {
  if (selectedFilter.value === 'all') {
    return projects.value
  }
  return projects.value.filter(project =>
    project.technologies.includes(selectedFilter.value)
  )
})

// Featured projects count
const featuredCount = computed(() =>
  projects.value.filter(p => p.featured).length
)
</script>

<template>
  <section
    id="projects"
    :ref="section.elementRef"
    class="min-h-screen py-20 px-4 md:px-8 bg-background transition-all duration-700 ease-out"
    :class="section.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg mb-4">
          <span class="text-2xl">💼</span>
          <span class="text-sm font-medium text-primary">Portfolio</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Featured <span class="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Projects</span>
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
          Showcasing {{ projects.length }} projects with {{ featuredCount }} featured works
        </p>
      </div>

      <!-- Filter Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          @click="selectedFilter = 'all'"
          class="px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
          :class="selectedFilter === 'all'
            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
            : 'bg-card text-muted-foreground hover:bg-card-hover hover:text-foreground border border-border'"
        >
          All Projects
          <span class="ml-2 text-xs opacity-75">({{ projects.length }})</span>
        </button>
        <button
          v-for="tech in allTechnologies"
          :key="tech"
          @click="selectedFilter = tech"
          class="px-5 py-2.5 rounded-lg font-medium transition-all duration-300"
          :class="selectedFilter === tech
            ? 'bg-primary text-primary-foreground shadow-lg scale-105'
            : 'bg-card text-muted-foreground hover:bg-card-hover hover:text-foreground border border-border'"
        >
          {{ tech }}
          <span class="ml-2 text-xs opacity-75">
            ({{ projects.filter(p => p.technologies.includes(tech)).length }})
          </span>
        </button>
      </div>

      <!-- Projects Grid -->
      <TransitionGroup
        name="projects"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <article
          v-for="project in filteredProjects"
          :key="project.id"
          class="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
        >
          <!-- Project Image -->
          <div class="relative h-56 overflow-hidden bg-muted">
            <img
              :src="project.image"
              :alt="project.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <!-- Featured Badge -->
            <div
              v-if="project.featured"
              class="absolute top-4 right-4 px-3 py-1.5 bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-bold rounded-full shadow-lg"
            >
              ⭐ Featured
            </div>

            <!-- Quick Action Buttons -->
            <div class="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="View live project"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-3 bg-foreground text-background rounded-full hover:scale-110 transition-transform shadow-lg"
                aria-label="View GitHub repository"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Project Content -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
              {{ project.title }}
            </h3>
            <p class="text-muted-foreground text-sm mb-4 line-clamp-3">
              {{ project.description }}
            </p>

            <!-- Technology Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors cursor-default"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Card Footer with Links -->
          <div class="px-6 pb-6 flex items-center gap-4 text-sm">
            <a
              v-if="project.liveUrl"
              :href="project.liveUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Live Demo
            </a>
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </article>
      </TransitionGroup>

      <!-- Empty State -->
      <div
        v-if="filteredProjects.length === 0"
        class="text-center py-20"
      >
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-foreground mb-2">No projects found</h3>
        <p class="text-muted-foreground mb-6">
          No projects match the selected technology filter.
        </p>
        <button
          @click="selectedFilter = 'all'"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          View All Projects
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Projects transition animations */
.projects-enter-active,
.projects-leave-active {
  transition: all 0.5s ease;
}

.projects-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.projects-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.projects-move {
  transition: transform 0.5s ease;
}
</style>
