<script setup lang="ts">
import AnimatedBackground from './components/AnimatedBackground.vue'
import { ref, onMounted, computed } from 'vue'

const videos = ref([])
const chargees = ref(new Set())

onMounted(async () => {
  const response = await fetch('http://localhost:3000/api/videos')
  videos.value = await response.json()
})

function lienEmbed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1`
}

function playVideo(IdVideo: string) {
  const url = `https://www.youtube.com/watch?v=${IdVideo}`
  window.open(url, '_blank')
}

const montrerShorts = ref(true)

const Videofiltrer = computed(() => {
  if (montrerShorts.value == true)
    return videos.value.filter(video => video.short)
  else
  {
    return videos.value.filter(video => !video.short)
  }
})

function flip(e: Event) {
  (e.currentTarget as HTMLElement).animate(
    [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }],
    { duration: 600, easing: 'ease' }
  )
}
</script>

<template>
  <main class="contenu">
    <AnimatedBackground />
      <div class="gauche">
        <div class="orbite-zone">
          <img class="photo-profil"
               src="/app/public/Ambre.jpg"
               alt="Photo de profil"
               @click="flip">
          <div class="orbite">
            <a href="https://x.com/Sorc_Montage?s=20" target="_blank" rel="noopener" class="social">
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a href="https://www.youtube.com/@SorcMontage" target="_blank" rel="noopener" class="social">
              <i class="fa-brands fa-youtube"></i>
            </a>
            <a href="https://www.instagram.com/sorc.montage/" target="_blank" rel="noopener" class="social">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://discord.gg/INVITATION" target="_blank" rel="noopener" class="social">
              <i class="fa-brands fa-discord"></i>
            </a>
            <a href="mailto:ambre.rat2007@gmail.com" class="social">
              <i class="fa-regular fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="droite">
        <div class="titre-contenue-droite">
          <h2>Bienvenue sur mon portfolio!</h2>
        </div>
        <div class="contenu-droite">
        <div class="intro">
        <button class="btn-filtre" @click="montrerShorts = !montrerShorts">{{ montrerShorts == true ? 'long' : 'short' }}</button>
        </div>
        <Transition name="video" mode="out-in" appear>
          <div class="video-container" v-if="Videofiltrer.length" :class="{ 'grille-shorts': montrerShorts }" :key="montrerShorts">
            <div v-for="video in Videofiltrer" :key="video.IdVideo" class="video-card" >
              <div class="video-wrapper" :class="{short: video.short, chargement: !chargees.has(video.IdVideo)}">
                <iframe
                  :src="lienEmbed(video.IdVideo)"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                  frameborder="0"
                  @load="chargees.add(video.IdVideo)">
                </iframe>
                <div class="overlay" @click="playVideo(video.IdVideo)"></div>
              </div>
            </div>
          </div>
        </Transition>
        </div>
      </div>
  </main>
</template>

<style>

.contenu {
  display: flex;
  flex: 1;
  min-height: 0;
}

.gauche {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 450px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  perspective: 800px;
}

.photo-profil {
  margin-top: 20px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 3px 70px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
  animation: photo-flou 3s ease both;
  cursor: pointer;
}

.photo-profil:hover{
  transform: scale(1.05);
}

@keyframes photo-flou {
  from {
    opacity: 0;
    filter: blur(20px);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

.contenue {
  background-color: yellow;
  padding: 10px;
  overflow-y: auto;
}

.titre-contenue-droite {
}
.droite {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.contenu-droite {
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

.video-card {
  transition: transform 0.3s;
}

.video-card:hover {
  transform: scale(1.05);
}

.video-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 1.6s ease, filter 1.6s ease;
}

.video-wrapper.chargement {
  opacity: 0;
  filter: blur(12px);
}

.video-wrapper.short {
  aspect-ratio: 9 / 16;
  max-width: 250px;
  margin: 0 auto;
}

.video-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.video-enter-active, .video-leave-active { transition: all 0.5s ease; }
.video-enter-from, .video-leave-to { opacity: 0; filter: blur(12px); }

.overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
}

body {
  margin: 0;
}

h1 {
  color: white;
}

.btn-filtre {
  padding: 10px 24px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

/* --- Logos en orbite autour de la photo --- */
.orbite-zone {
  position: relative;
  width: 400px;
  height: 400px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* L'anneau qui tourne en continu */
.orbite {
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: orbite-tourner 22s linear infinite;
}

@keyframes orbite-tourner {
  to { transform: rotate(360deg); }
}

@keyframes orbite-contre {
  to { transform: rotate(-360deg); }
}

.social {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  margin: -22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
  pointer-events: auto;
}

/* Chaque logo placé sur le cercle (rayon 175px), sans inclinaison */
.social:nth-child(1) { transform: rotate(0deg)   translateY(-175px) rotate(0deg); }
.social:nth-child(2) { transform: rotate(72deg)  translateY(-175px) rotate(-72deg); }
.social:nth-child(3) { transform: rotate(144deg) translateY(-175px) rotate(-144deg); }
.social:nth-child(4) { transform: rotate(216deg) translateY(-175px) rotate(-216deg); }
.social:nth-child(5) { transform: rotate(288deg) translateY(-175px) rotate(-288deg); }

/* L'icône contre-tourne pour rester bien droite */
.social i {
  font-size: 24px;
  animation: orbite-contre 22s linear infinite;
}

.social i:hover {
  color: #fff;
}

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

</style>
