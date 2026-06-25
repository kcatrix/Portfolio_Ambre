<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VideoCard from './VideoCard.vue'
import AvisPreview from './AvisPreview.vue'
import AvisComplet from './AvisComplet.vue'

interface Video {
  IdVideo: string
  short: boolean
}

const videos = ref<Video[]>([])
const montrerShorts = ref(true)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  const response = await fetch(`${apiUrl}/api/videos`)
  videos.value = await response.json()
})

const Videofiltrer = computed(() =>
  videos.value.filter(video => montrerShorts.value ? video.short : !video.short)
)
</script>

<template>
  <div class="droite">
    <div class="titre-contenue-droite">
      <h2>Mes créations</h2>
    </div>
    <div>
      <hr class="separateur">
      <div class="segment" :class="{ 'sur-videos': !montrerShorts }">
        <div class="indicateur"></div>
        <button class="opt" :class="{ actif: montrerShorts }" @click="montrerShorts = true">Shorts</button>
        <button class="opt" :class="{ actif: !montrerShorts }" @click="montrerShorts = false">Vidéos</button>
      </div>
        <AvisPreview />
      <Transition name="video" mode="out-in" appear>
        <div class="video-container" v-if="Videofiltrer.length" :class="{ 'grille-shorts': montrerShorts }" :key="String(montrerShorts)">
          <VideoCard v-for="video in Videofiltrer" :key="video.IdVideo" :video="video" />
        </div>
      </Transition>
      <div class="AvisComplet">
          <AvisComplet />
      </div>
    </div>
  </div>
</template>

<style scoped>
.droite {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;  
}

.titre-contenue-droite {
  text-align: center;
  padding: 0 1.25rem;
  font-size: 1.5rem;
}

.titre-contenue-droite h2{
  margin: 0.9375rem;
}

.droite .separateur {
  margin-top: 0.0625rem;
}

.segment {
  position: relative;
  display: flex;
  width: fit-content;
  margin: 0 auto;
  padding: 0.3125rem;
  background: var(--surface);
  border-radius: 62.4375rem;
}

.indicateur {
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0.25rem;
  width: 5.625rem;
  background: var(--accent);
  border-radius: 62.4375rem;
  transition: transform 0.28s cubic-bezier(.4, 0, .2, 1);
}

.segment.sur-videos .indicateur {
  transform: translateX(5.625rem);
}

.opt {
  position: relative;
  z-index: 1;
  width: 5.625rem;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-doux);
  transition: color 0.2s;
}

.opt.actif {
  color: var(--on-accent);
}

.video-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 0.625rem;
}

.video-container.grille-shorts {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 56.25rem) {
  .video-container {
    grid-template-columns: 1fr 1fr;
    }
  .video-container.grille-shorts {
    grid-template-columns: repeat(2, 1fr);
    }
}

.video-enter-active, .video-leave-active { transition: all 0.5s ease; }
.video-enter-from, .video-leave-to { opacity: 0; filter: blur(0.75rem); }

.AvisComplet{
  text-align: center;
}
.AvisComplet .separateur{
  margin-top: 1.7rem;
}
</style>
