<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import VideoCard from './VideoCard.vue'
import AvisPreview from './AvisPreview.vue'
import AvisComplet from './AvisComplet.vue'

interface Video {
  IdVideo: string
  short: boolean
  description?: string
}

const videos = ref<Video[]>([])
const montrerShorts = ref(true)

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  const response = await fetch(`${apiUrl}/api/videos`)
  videos.value = await response.json()
})

const categories = computed(() => {
  const setCategories = new Set<string>()

  for (const video of videos.value) {
    if (!video.description) continue

    // Cherche un bloc qui commence par "_" jusqu'au premier espace ou saut de ligne
    const match = video.description.match(/_([^\s\n\r]+)/)
    if (match && match[1]) {
      // Sépare par les virgules (ex: "Gaming,économie" -> ["Gaming", "économie"])
      const tags = match[1].split(',')
      for (const tag of tags) {
        const propre = tag.trim()
        if (propre) {
          setCategories.add(propre)
        }
      }
    }
  }

  return Array.from(setCategories)
})

const Videofiltrer = computed(() =>
  videos.value.filter(video => montrerShorts.value ? video.short : !video.short)
)

const moitie = computed(() => Math.ceil(videos.value.filter(v => v.short).length / 2))
const slider1 = computed(() => videos.value.filter(v => v.short).slice(0, moitie.value))
const slider2 = computed(() => videos.value.filter(v => v.short).slice(moitie.value))

// vidéos longues réparties sur 3 lignes (carrousel)
const videosLongues = computed(() => videos.value.filter(v => !v.short))
const videoLigne1 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 0))
const videoLigne2 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 1))
const videoLigne3 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 2))

</script>

<template>
  <div class="droite">
    <div class="titre-contenue-droite">
      <h2>Mes créations</h2>
    </div>
    <div>
      <hr class="separateur separateur-haut">
      <div class="barre-filtres">
        <div class="segment" :class="{ 'sur-videos': !montrerShorts }">
          <div class="indicateur"></div>
          <button class="opt" :class="{ actif: montrerShorts }" @click="montrerShorts = true">Shorts</button>
          <button class="opt" :class="{ actif: !montrerShorts }" @click="montrerShorts = false">Vidéos</button>
        </div>

        <button class="btn-filtre">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span>Filtres</span>
        </button>
</div>

<AvisPreview />
      <Transition name="video" mode="out-in" appear>
        <!-- version desktop : grille normale -->
        <div class="version-desktop" :key="String(montrerShorts)">
          <div class="video-container" :class="{ 'grille-shorts': montrerShorts }">
            <VideoCard v-for="v in Videofiltrer" :key="v.IdVideo" :video="v" />
          </div>
        </div>
      </Transition>

        <div class="version-mobile">
        <template v-if="montrerShorts">
          <div class="double-carrousel">
            <div class="ligne-shorts">
              <VideoCard v-for="v in slider1" :key="v.IdVideo" :video="v" />
            </div>
            <div class="ligne-shorts">
              <VideoCard v-for="v in slider2" :key="v.IdVideo" :video="v" />
            </div>
          </div>
        </template>
        <template v-else>
          <!-- plus de 3 vidéos : carrousel sur 3 lignes -->
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

          <!-- 3 ou moins : empilement simple -->
          <div v-else class="video-container">
            <VideoCard v-for="v in videosLongues" :key="v.IdVideo" :video="v" />
          </div>
        </template>
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

.barre-filtres {
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* 3 colonnes : gauche(vide), centre, droite */
  align-items: center;
  width: 100%;
  margin: 1rem 0 1.5rem 0;
}

.segment {
  grid-column: 2; /* Force le sélecteur dans la colonne centrale */
  position: relative;
  display: flex;
  width: fit-content;
  margin: 0 auto;
  padding: 0.3125rem;
  background: var(--surface);
  border-radius: 62.4375rem;
}

.btn-filtre {
  justify-self: end; /* Se place au début de la zone droite, juste à côté du segment */
  margin-right: 10rem;   /* Ajuste cet espace si tu veux le rapprocher ou l'éloigner */
  
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 2.375rem;
  padding: 0 1.25rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 62.4375rem;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-filtre:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
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
  .separateur-haut {
    display: none;
  }
}

.double-carrousel {
  overflow-x: auto;                 /* LE scroll, une seule fois */
  scroll-snap-type: x mandatory;
  padding: 0.625rem;
}
.ligne-shorts {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.ligne-shorts .video-card {
  flex: 0 0 46%;
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
  flex: 0 0 90%;             /* 1 vidéo par écran + un bout du suivant */
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
