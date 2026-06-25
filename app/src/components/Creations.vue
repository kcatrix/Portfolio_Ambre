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
const videosLongues = computed(() => videos.value.filter(v => !v.short))

const tiers = computed(() => Math.ceil(videos.value.filter(v => !v.short).length / 3))
const videoLigne1 = computed(() => videos.value.filter(v => !v.short).slice(0, tiers.value))
const videoLigne2 = computed(() => videos.value.filter(v => !v.short).slice(tiers.value, tiers.value * 2))
const videoLigne3 = computed(() => videos.value.filter(v => !v.short).slice(tiers.value * 2))

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
        <!-- version desktop : grille normale -->
        <div class="version-desktop">
          <div class="video-container grille-shorts">
            <VideoCard v-for="v in Videofiltrer" :key="v.IdVideo" :video="v" />
          </div>
        </div>
      </Transition>

        <div class="version-mobile">
        <template v-if="montrerShorts">
          <div class="carrousel-shorts">
            <VideoCard v-for="v in Videofiltrer" :key="v.IdVideo" :video="v" />
          </div>
        </template>
        <div v-else>
  <!-- plus de 3 vidéos : triple carrousel -->
        <div v-if="videosLongues.length > 3" class="triple-carrousel">
          <div class="ligne-videos">
            <VideoCard v-for="v in videoLigne1" :key="v.IdVideo" :video="v" />
          </div>
          <div class="ligne-videos">
            <VideoCard v-for="v in videoLigne2" :key="v.IdVideo" :video="v" />
          </div>
          <div class="ligne-videos">
            <VideoCard v-for="v in videoLigne3" :key="v.IdVideo" :video="v" />
          </div>
        </div>

        <!-- 3 ou moins : simple empilement -->
        <div v-else class="video-container">
          <VideoCard v-for="v in videosLongues" :key="v.IdVideo" :video="v" />
        </div>
      </div>
      </div>
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

.version-mobile { display: none; }   /* caché par défaut (desktop) */

@media (max-width: 56.25rem) {
  .video-container {
    grid-template-columns: 1fr;
    }
  .video-container.grille-shorts {
    grid-template-columns: repeat(2, 1fr);
    }
  .version-desktop { display: none; }   /* sur mobile : cache la grille */
  .version-mobile { display: block; }   /* montre les carrousels */
}

.carrousel-shorts {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0.625rem;
}
.carrousel-shorts .video-card {
  flex: 0 0 31%;             /* 3 shorts visibles à l'écran */
  scroll-snap-align: start;
}

.triple-carrousel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0.625rem;
}
.ligne-videos {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.ligne-videos .video-card {
  flex: 0 0 90%;              /* 1 vidéo par écran (90% + un bout du suivant) */
  scroll-snap-align: start;
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
