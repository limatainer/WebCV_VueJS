<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{ msg: string }>()
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

const useTypingAnimation = (words: string[], typingSpeed = 100, deletingSpeed = 50) => {
  const currentText = ref('')
  const wordIndex = ref(0)
  const charIndex = ref(0)
  const isDeleting = ref(false)

  const animate = () => {
    const currentWord = words[wordIndex.value]
    if (!currentWord) return
    
    if (isDeleting.value) {
      currentText.value = currentWord.substring(0, charIndex.value - 1)
      charIndex.value--
      
      if (charIndex.value === 0) {
        isDeleting.value = false
        wordIndex.value = (wordIndex.value + 1) % words.length
        setTimeout(animate, 500)
        return
      }
    } else {
      currentText.value = currentWord.substring(0, charIndex.value + 1)
      charIndex.value++
      
      if (charIndex.value === currentWord.length) {
        isDeleting.value = true
        setTimeout(animate, 2000)
        return
      }
    }
    
    setTimeout(animate, isDeleting.value ? deletingSpeed : typingSpeed)
  }

  onMounted(() => animate())

  return { currentText }
}

// State
const hero = useIntersectionAnimation()
const about = useIntersectionAnimation()
const skills = useIntersectionAnimation()
const cta = useIntersectionAnimation()

const roles = ['Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast', 'Continuous Learner']
const { currentText: currentRole } = useTypingAnimation(roles)

const skillCategories = [
  { title: 'Frontend', icon: '🎨', skills: ['Vue.js', 'React', 'TypeScript', 'TailwindCSS', 'Next.js'] },
  { title: 'Backend', icon: '⚙️', skills: ['Node.js', 'Firebase', 'Azure', 'Python', 'APIs'] },
  { title: 'Tools', icon: '🛠️', skills: ['Git', 'Vite', 'Yarn', 'VS Code', 'Google Apps Script'] }
]

const stats = [
  { label: 'Years Experience', value: '5+', icon: '📅' },
  { label: 'Projects Completed', value: '50+', icon: '🚀' },
  { label: 'Technologies', value: '20+', icon: '💻' },
  { label: 'Coffee Consumed', value: '∞', icon: '☕' }
]
</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section
      :ref="hero.elementRef"
      class="min-h-screen flex items-center relative overflow-hidden px-4 md:px-8 py-16 transition-all duration-700 ease-out"
      :class="hero.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <div class="max-w-7xl mx-auto w-full relative z-10">
        <div class="max-w-4xl">
          <!-- Greeting Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg mb-6 shadow-sm">
            <span class="text-2xl animate-wave">👋</span>
            <span class="text-sm font-medium text-muted-foreground">Hello, I'm</span>
          </div>
          
          <!-- Hero Title -->
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
            {{ msg }}
          </h1>
          
          <!-- Dynamic Subtitle -->
          <div class="text-2xl md:text-4xl mb-6">
            <span class="text-foreground">A </span>
            <span class="text-primary font-semibold">{{ currentRole }}</span>
            <span class="text-accent animate-pulse">|</span>
          </div>
          
          <!-- Description -->
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Building modern, scalable web applications with clean code and exceptional user experiences.
            Passionate about Vue.js, TypeScript, and cloud technologies.
          </p>
          
          <!-- CTA Buttons -->
          <div class="flex flex-wrap gap-4">
            <button class="group px-7 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
              <span>View My Work</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button class="px-7 py-3.5 bg-secondary text-secondary-foreground rounded-lg font-semibold shadow-md hover:bg-accent hover:text-accent-foreground hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
              <span>Get in Touch</span>
              <span>✉</span>
            </button>
          </div>
        </div>
        
        <!-- Floating Cards -->
        <div class="hidden lg:block absolute inset-0 pointer-events-none">
          <div class="absolute top-[15%] right-[10%] bg-card border border-border rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 animate-float opacity-90">
            <span class="text-2xl">💻</span>
            <span class="font-semibold text-sm">Clean Code</span>
          </div>
          <div class="absolute top-[50%] right-[5%] bg-card border border-border rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 animate-float-delayed opacity-90">
            <span class="text-2xl">🚀</span>
            <span class="font-semibold text-sm">Fast Performance</span>
          </div>
          <div class="absolute bottom-[20%] right-[15%] bg-card border border-border rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 animate-float-more-delayed opacity-90">
            <span class="text-2xl">🎯</span>
            <span class="font-semibold text-sm">Best Practices</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-muted border-t border-b border-border px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="text-center p-8 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-primary transition-all duration-300 animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="text-4xl mb-2">{{ stat.icon }}</div>
            <div class="text-4xl font-bold text-primary mb-1">{{ stat.value }}</div>
            <div class="text-sm text-muted-foreground font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section
      :ref="about.elementRef"
      class="py-24 px-4 transition-all duration-700 ease-out"
      :class="about.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-12">
          <span class="text-primary">Who</span> I Am
        </h2>
        
        <div class="space-y-6">
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed">
            I'm a passionate developer from <strong class="text-foreground font-semibold">Nigeria</strong>, dedicated to creating exceptional 
            digital experiences. With expertise in modern web technologies, I transform ideas into 
            elegant, performant applications that make a difference.
          </p>
          
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed">
            My journey in software development has taught me that great code isn't just about 
            functionality—it's about <strong class="text-foreground font-semibold">clarity</strong>, <strong class="text-foreground font-semibold">maintainability</strong>, 
            and <strong class="text-foreground font-semibold">user experience</strong>. I believe in continuous learning and staying 
            ahead of the curve with the latest technologies and best practices.
          </p>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section
      :ref="skills.elementRef"
      class="py-24 px-4 bg-muted transition-all duration-700 ease-out"
      :class="skills.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-bold text-center mb-12">
          <span class="text-primary">Tech</span> Stack
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(category, index) in skillCategories" 
            :key="index"
            class="bg-card border border-border rounded-lg p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary transition-all duration-300 animate-fade-in-up"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl">{{ category.icon }}</span>
              <h3 class="text-2xl font-bold">{{ category.title }}</h3>
            </div>
            
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="(skill, skillIndex) in category.skills" 
                :key="skillIndex"
                class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300 cursor-default"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      :ref="cta.elementRef"
      class="py-24 px-4 transition-all duration-700 ease-out"
      :class="cta.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <div class="max-w-3xl mx-auto">
        <div class="text-center p-12 md:p-16 bg-card border border-border rounded-lg shadow-xl">
          <h2 class="text-3xl md:text-5xl font-bold mb-4 bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h2>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            Ready to bring your ideas to life? Let's collaborate and create 
            something extraordinary together.
          </p>
          <button class="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 mx-auto">
            <span>Start a Conversation</span>
            <span class="animate-pulse">💬</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-wave {
  animation: wave 2.5s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 7s ease-in-out infinite 1s;
}

.animate-float-more-delayed {
  animation: float 8s ease-in-out infinite 2s;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}
</style>
