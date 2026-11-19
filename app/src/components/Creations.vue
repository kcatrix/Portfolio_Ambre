<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import VideoCard from './VideoCard.vue'
import AvisPreview from './AvisPreview.vue'
import AvisComplet from './AvisComplet.vue'

interface Video {
  IdVideo: string
  short: boolean
  description?: string
}

const videos = ref<Video[]>([])
const montrerShorts = ref(false)

onMounted(async () => {
  const response = await fetch('/api/videos')
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

const menuFiltresOuvert = ref(false)

const filtresActifs = ref<string[]>([])

const toggleFiltre = (cat: string) => {
  filtresActifs.value = filtresActifs.value.includes(cat) ? [] : [cat]
}

// 1. ÉTAPE INTERMÉDIAIRE : On filtre toutes les vidéos selon les tags cochés
const videosApresTags = computed(() => {
  // Si aucun filtre n'est coché, on renvoie toutes les vidéos
  if (filtresActifs.value.length === 0) return videos.value

  return videos.value.filter(video => {
    if (!video.description) return false

    // On récupère les tags de la vidéo exactement comme on l'a fait pour extraire les catégories
    const match = video.description.match(/_([^\s\n\r]+)/)
    if (!match || !match[1]) return false
    
    const tagsVideo = match[1].split(',').map(t => t.trim())
    
    // On garde la vidéo si elle possède AU MOINS UN des tags sélectionnés par l'utilisateur (logique "OU")
    return filtresActifs.value.some(filtreActif => tagsVideo.includes(filtreActif))
  })
})

// Gère le clic sur le bouton "Filtres" principal
const gererClicFiltre = () => {
  if (filtresActifs.value.length > 0) {
    // S'il y a des filtres actifs, on les efface tous
    filtresActifs.value = []
    // Optionnel : on ferme le menu en même temps
    menuFiltresOuvert.value = false 
  } else {
    // Sinon (aucun filtre), on ouvre ou on ferme le menu normalement
    menuFiltresOuvert.value = !menuFiltresOuvert.value
  }
}

// 2. LA SUITE DU CODE SE BASE SUR "videosApresTags" AU LIEU DE "videos"

const Videofiltrer = computed(() =>
  videosApresTags.value.filter(video => montrerShorts.value ? video.short : !video.short)
)

const filtreActif = computed(() => filtresActifs.value.length > 0)

const shortsFiltres = computed(() => videosApresTags.value.filter(v => v.short))
const moitie = computed(() => {
  const total = shortsFiltres.value.length
  return total <= 2 ? total : Math.ceil(total / 2)
})
const slider1 = computed(() => shortsFiltres.value.slice(0, moitie.value))
const slider2 = computed(() => shortsFiltres.value.slice(moitie.value))

// vidéos longues réparties sur 3 lignes (carrousel)
const videosLongues = computed(() => videosApresTags.value.filter(v => !v.short))
const videoLigne1 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 0))
const videoLigne2 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 1))
const videoLigne3 = computed(() => videosLongues.value.filter((_, i) => i % 3 === 2))

// --- Indice de scroll des colonnes (vue filtrée côte à côte) ---
type Zone = 'shorts' | 'videos'
const zones: Record<Zone, HTMLElement | null> = { shorts: null, videos: null }
const resteEnBas = reactive<Record<Zone, boolean>>({ shorts: false, videos: false })

const majZone = (cle: Zone) => {
  const el = zones[cle]
  if (!el || getComputedStyle(el).overflowY === 'visible') { resteEnBas[cle] = false; return }
  resteEnBas[cle] = el.scrollTop + el.clientHeight < el.scrollHeight - 8
}

const observateur = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver(() => { majZone('shorts'); majZone('videos') })
  : null

const lierZone = (cle: Zone) => (el: unknown) => {
  const node = el as HTMLElement | null
  if (zones[cle] === node) return
  if (zones[cle]) observateur?.unobserve(zones[cle]!)
  zones[cle] = node
  if (node) { observateur?.observe(node); node.firstElementChild && observateur?.observe(node.firstElementChild) }
  majZone(cle)
}

const defiler = (cle: Zone) => {
  const el = zones[cle]
  if (el) el.scrollBy({ top: el.clientHeight * 0.85, behavior: 'smooth' })
}

onBeforeUnmount(() => observateur?.disconnect())

</script>

<template>
  <div class="droite">
    <div class="titre-contenue-droite">
      <h2>Mes créations</h2>
    </div>
    <div>
      <hr class="separateur separateur-haut">
      <div class="barre-filtres">
        <Transition name="bascule" mode="out-in">
          <div v-if="!filtreActif" key="segment" class="segment" :class="{ 'sur-shorts': montrerShorts }">
            <div class="indicateur"></div>
            <button class="opt" :class="{ actif: !montrerShorts }" @click="montrerShorts = false">Vidéos</button>
            <button class="opt" :class="{ actif: montrerShorts }" @click="montrerShorts = true">Shorts</button>
          </div>
          <div v-else key="resume" class="resume-filtre">
            <span class="resume-tag">#{{ filtresActifs[0] }}</span>
            <span class="resume-compte">{{ videosApresTags.length }} création{{ videosApresTags.length > 1 ? 's' : '' }}</span>
          </div>
        </Transition>

        <button class="btn-filtre" :class="{ 'btn-rouge': filtresActifs.length > 0 }" @click="gererClicFiltre">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span >{{ filtresActifs.length > 0 ? 'Effacer filtres' : 'Filtres' }}</span>
        </button>
      </div>
      <div class="panneau-wrapper" :class="{ 'ouvert': menuFiltresOuvert }">
        <div class="panneau-inner">
          <div class="panneau-pastilles">
            <button 
              v-for="cat in categories" 
              :key="cat" 
              class="pastille"
              :class="{ active: filtresActifs.includes(cat) }"
              @click="toggleFiltre(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
<AvisPreview />
      <Transition name="video" mode="out-in" appear>
        <!-- filtre actif : shorts + vidéos du tag, en sections (desktop et mobile) -->
        <div v-if="filtreActif" class="vue-filtree" :class="{ 'cote-a-cote': shortsFiltres.length && videosLongues.length }" :key="'filtre-' + filtresActifs[0]">
          <!-- entête unique (desktop, shorts + vidéos) -->
          <header v-if="shortsFiltres.length && videosLongues.length" class="entete-unique">
            <span class="entete-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/></svg>
              <h3>Shorts</h3>
              <span class="compteur">{{ shortsFiltres.length }}</span>
            </span>
            <span class="trait trait-double"></span>
            <span class="entete-label">
              <span class="compteur">{{ videosLongues.length }}</span>
              <h3>Vidéos</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/></svg>
            </span>
          </header>
          <section v-if="shortsFiltres.length" class="section-filtre col-shorts">
            <header class="entete-section">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/></svg>
              <h3>Shorts</h3>
              <span class="compteur">{{ shortsFiltres.length }}</span>
              <span class="trait"></span>
            </header>
            <div class="video-container grille-shorts zone-scroll" :class="{ 'a-suivre': resteEnBas.shorts, fixe: shortsFiltres.length <= 2 }" :ref="lierZone('shorts')" @scroll.passive="majZone('shorts')">
              <VideoCard v-for="v in shortsFiltres" :key="v.IdVideo" :video="v" />
            </div>
            <Transition name="indice">
              <button v-if="resteEnBas.shorts" class="indice-scroll" @click="defiler('shorts')">
                Plus de shorts
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </Transition>
          </section>

          <section v-if="videosLongues.length" class="section-filtre col-videos">
            <header class="entete-section">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="m10 9.5 4.5 2.5-4.5 2.5z"/></svg>
              <h3>Vidéos</h3>
              <span class="compteur">{{ videosLongues.length }}</span>
              <span class="trait"></span>
            </header>
            <div class="video-container zone-scroll" :class="{ 'a-suivre': resteEnBas.videos, fixe: videosLongues.length <= 2 }" :ref="lierZone('videos')" @scroll.passive="majZone('videos')">
              <VideoCard v-for="v in videosLongues" :key="v.IdVideo" :video="v" />
            </div>
            <Transition name="indice">
              <button v-if="resteEnBas.videos" class="indice-scroll" @click="defiler('videos')">
                Plus de vidéos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </Transition>
          </section>

          <p v-if="!videosApresTags.length" class="vide-filtre">
            Aucune création pour ce filtre pour le moment.
          </p>
        </div>

        <!-- version desktop : grille normale -->
        <div v-else class="version-desktop" :key="String(montrerShorts)">
          <div class="video-container" :class="{ 'grille-shorts': montrerShorts }">
            <VideoCard v-for="v in Videofiltrer" :key="v.IdVideo" :video="v" />
          </div>
        </div>
      </Transition>

        <div class="version-mobile" v-if="!filtreActif">
        <template v-if="montrerShorts">
          <div class="double-carrousel">
          <div class="ligne-shorts">
            <VideoCard v-for="v in slider1" :key="v.IdVideo" :video="v" />
          </div>
          <div class="ligne-shorts" v-if="slider2.length > 0">
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
  margin: 1rem 0 0.5rem 0;
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

.segment.sur-shorts .indicateur {
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

  /* --- Bouton Effacer en Rouge --- */
  .btn-filtre.btn-rouge {
    background: rgba(239, 68, 68, 0.1);      /* Fond rouge très léger */
    border-color: rgba(239, 68, 68, 0.3);    /* Bordure rouge un peu plus visible */
    color: #ef4444;                          /* Texte rouge */
  }

  .btn-filtre.btn-rouge:hover {
    background: rgba(239, 68, 68, 0.2);      /* S'assombrit légèrement au survol */
    border-color: rgba(239, 68, 68, 0.5);
  }

@media (max-width: 56.25rem) {
  /* --- Ajout pour centrer les boutons sur mobile --- */
  .barre-filtres {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
  
  .segment {
    grid-column: 2; /* Reste toujours au centre */
  }

  /* On rend le bouton compact et on l'approche du centre */
  .btn-filtre {
    grid-column: 3;
    justify-self: start; /* On le colle à gauche de sa zone (donc près du centre) */
    margin-right: 0;     /* On annule la marge du desktop */
    margin-left: 1.75rem;/* Petit espace entre le sélecteur et le bouton */
    padding: 0;
    width: 2.375rem;     /* Largeur fixe pour faire un carré/rond */
    justify-content: center;
  }

  /* On cache le texte, on ne garde que le SVG */
  .btn-filtre span {
    display: none;
  }

  /* ------------------------------------------------ */

  .video-container {
    grid-template-columns: 1fr;
  }
  .video-container.grille-shorts {
    grid-template-columns: repeat(2, 1fr);
  }
  .version-desktop { display: none; }
  .version-mobile { display: block; }
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


/* --- Vue filtrée : résumé à la place du sélecteur Shorts/Vidéos --- */
.resume-filtre {
  grid-column: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  height: 2.875rem;
  padding: 0 0.375rem 0 0.375rem;
  background: var(--surface);
  border-radius: 62.4375rem;
}
.resume-tag {
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: var(--on-accent);
  border-radius: 62.4375rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.resume-compte {
  padding-right: 0.875rem;
  color: var(--text-doux);
  font-size: 0.875rem;
}

.bascule-enter-active, .bascule-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.bascule-enter-from, .bascule-leave-to { opacity: 0; transform: scale(0.94); }

.section-filtre {
  margin-top: 1.25rem;
}
.entete-section {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.625rem;
  color: var(--accent);
}
.entete-section h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-fort);
}
.compteur {
  min-width: 1.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 62.4375rem;
  background: rgba(var(--accent-rgb), 0.15);
  color: var(--accent);
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
}
.trait {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.5), transparent);
}
/* --- Filtre avec shorts ET vidéos : deux colonnes scrollables --- */
.vue-filtree.cote-a-cote {
  display: grid;
  grid-template-columns: 2fr 1.54fr;
  gap: 1.5rem;
  margin-top: 1.25rem;
}
.cote-a-cote .section-filtre { margin-top: 0; min-width: 0; position: relative; }
.cote-a-cote .entete-section { display: none; }
.indice-scroll { display: none; }

/* Entête unique : Shorts ——————— Vidéos */
.entete-unique {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0 0.625rem;
  margin-bottom: -0.75rem;
  color: var(--accent);
}
.entete-unique h3 { margin: 0; font-size: 1.125rem; color: var(--text-fort); }
.entete-label { display: inline-flex; align-items: center; gap: 0.625rem; }
.trait-double {
  background: linear-gradient(90deg, rgba(var(--accent-rgb), 0.5), rgba(var(--accent-rgb), 0.15) 50%, rgba(var(--accent-rgb), 0.5));
}

/* Indice de scroll : fondu en bas + bouton qui rebondit */
.cote-a-cote .zone-scroll.a-suivre {
  -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 72%, transparent 100%);
}
.cote-a-cote .indice-scroll {
  position: absolute;
  left: 50%;
  bottom: 0.75rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 62.4375rem;
  background: rgba(var(--accent-rgb), 0.9);
  color: var(--on-accent);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  transform: translateX(-50%);
  animation: rebond 1.8s ease-in-out infinite;
}
.cote-a-cote .indice-scroll:hover { background: var(--accent); }
@keyframes rebond {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 0.3rem); }
}
.indice-enter-active, .indice-leave-active { transition: opacity 0.25s ease; }
.cote-a-cote .indice-scroll.indice-leave-active { animation: none; }
.indice-enter-from, .indice-leave-to { opacity: 0; }

/* La colonne shorts fixe la hauteur : exactement une rangée de shorts visible */
.cote-a-cote .col-shorts { container-type: inline-size; }
.cote-a-cote .col-shorts .zone-scroll {
  grid-template-columns: repeat(2, 1fr);
  height: calc((100cqw - 1.25rem - 1.25rem) / 2 * 16 / 9 + 1.25rem);
}

/* La colonne vidéos s'aligne sur cette hauteur sans l'agrandir */
.cote-a-cote .col-videos { position: relative; }
.cote-a-cote .col-videos .zone-scroll {
  position: absolute;
  inset: 0;
  grid-template-columns: 1fr;
  align-content: start;
}

.cote-a-cote .zone-scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
  scroll-snap-type: y mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--accent) rgba(var(--accent-rgb), 0.12);
  border-radius: 0.75rem;
}
/* Rien à faire défiler : pas de scroll, le zoom au survol peut déborder */
.cote-a-cote .zone-scroll.fixe { overflow: visible; }
/* Zoom réduit dans les colonnes scrollables : il reste dans la marge interne */
.cote-a-cote .zone-scroll:not(.fixe) :deep(.video-card:hover) { transform: scale(1.03); }
.cote-a-cote .zone-scroll :deep(.video-card) { scroll-snap-align: start; scroll-margin-top: 0.625rem; }

@media (max-width: 56.25rem) {
  .vue-filtree.cote-a-cote { display: block; }
  .entete-unique, .cote-a-cote .indice-scroll { display: none; }
  .cote-a-cote .entete-section { display: flex; }
  .cote-a-cote .zone-scroll.a-suivre { -webkit-mask-image: none; mask-image: none; }
  .cote-a-cote .section-filtre { margin-top: 1.25rem; }
  .cote-a-cote .col-shorts .zone-scroll,
  .cote-a-cote .col-videos .zone-scroll {
    position: static;
    height: auto;
    overflow: visible;
  }
}

.vide-filtre {
  text-align: center;
  color: var(--text-doux);
  padding: 2rem 0;
}

.video-enter-active, .video-leave-active { transition: all 0.5s ease; }
.video-enter-from, .video-leave-to { opacity: 0; filter: blur(0.75rem); }

.AvisComplet{
  text-align: center;
}
.AvisComplet .separateur{
  margin-top: 1.7rem;
}

.panneau-pastilles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1.25rem 1rem 1.25rem;
}

.pastille {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-doux);
  padding: 0.4rem 1rem;
  border-radius: 62.4375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pastille:hover { 
  background: rgba(255, 255, 255, 0.1); 
}

.pastille.active {
  background: var(--accent);
  color: var(--on-accent);
  border-color: var(--accent);
}

/* --- Animation de hauteur fluide --- */
.panneau-wrapper {
  display: grid;
  grid-template-rows: 0fr; /* Par défaut, la hauteur est écrasée à 0 */
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.panneau-wrapper.ouvert {
  grid-template-rows: 1fr; /* Quand c'est ouvert, ça prend la hauteur de son contenu */
}

.panneau-inner {
  overflow: hidden; /* Empêche le contenu de déborder pendant que ça glisse */
  min-height: 0;
}

/* On garde le style des pastilles, mais on ajoute un fondu à l'intérieur de l'ouverture */
.panneau-pastilles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.50rem 1.25rem 1rem 1.25rem;
  
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.panneau-wrapper.ouvert .panneau-pastilles {
  opacity: 1;
  transform: translateY(0);
}
</style>
