<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VideoCard from './VideoCard.vue'

interface Video {
  IdVideo: string
  short: boolean
}

const videos = ref<Video[]>([])
const montrerShorts = ref(true)

onMounted(async () => {
  const response = await fetch('http://localhost:3000/api/videos')
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
      <Transition name="video" mode="out-in" appear>
        <div class="video-container" v-if="Videofiltrer.length" :class="{ 'grille-shorts': montrerShorts }" :key="String(montrerShorts)">
          <VideoCard v-for="video in Videofiltrer" :key="video.IdVideo" :video="video" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.droite {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.titre-contenue-droite {
  text-align: center;
  padding: 0 20px;
}

.droite .separateur {
  margin-top: 2px;
}

.segment {
  position: relative;
  display: flex;
  width: fit-content;
  margin: 0 auto;
  padding: 4px;
  background: var(--surface);
  border-radius: 999px;
}

.indicateur {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: 90px;
  background: var(--accent);
  border-radius: 999px;
  transition: transform 0.28s cubic-bezier(.4, 0, .2, 1);
}

.segment.sur-videos .indicateur {
  transform: translateX(90px);
}

.opt {
  position: relative;
  z-index: 1;
  width: 90px;
  padding: 8px 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
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
  gap: 20px;
  padding: 20px;
}

.video-container.grille-shorts {
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.video-enter-active, .video-leave-active { transition: all 0.5s ease; }
.video-enter-from, .video-leave-to { opacity: 0; filter: blur(12px); }
</style>
