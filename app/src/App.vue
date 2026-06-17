<script setup lang="ts">
import AnimatedBackground from './components/AnimatedBackground.vue'
import { ref, onMounted, computed } from 'vue'

const videos = ref([])

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
</script>

<template>
  <header>
    <h1>Portfolio Ambre Rat</h1>
  </header>
  <main class="contenu">
    <AnimatedBackground />
      <div class="gauche">  
        <img v-motion-roll-bottom 
             class="photo-profil" 
             src="/app/public/Ambre.jpg" 
             alt="Photo de profil">
      </div>
      <div class="droite">
        <div class="titre-contenue-droite">
          <h2>Bienvenue sur mon portfolio!</h2>
        </div>
        <div class="contenu-droite">
        droite ici
        <div class="intro">
        <p>Bienvenue sur mon portfolio!</p>
        <button class="btn-filtre" @click="montrerShorts = !montrerShorts">{{ montrerShorts == true ? 'long' : 'short' }}</button>
        </div>
          <div class="video-container" :class="{ 'grille-shorts': montrerShorts }">
            <div v-for="video in Videofiltrer" :key="video.IdVideo" class="video-card" >
              <div class="video-wrapper" :class="{short: video.short}">
                <iframe
                  :src="lienEmbed(video.IdVideo)"
                  allow="autoplay; encrypted-media"
                  allowfullscreen
                  frameborder="0">
                </iframe>
                <div class="overlay" @click="playVideo(video.IdVideo)"></div>
              </div>
            </div>
          </div>
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
  justify-content: center;
  display: flex;
  width: 450px;
  position: sticky;
  top: 0;
  align-self: flex-start;
}

.photo-profil {
  margin-top: 20px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 3px 70px rgba(0, 0, 0, 0.3);
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

.overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
}

body {
  margin: 0;
}

header {
  background-color: #333;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

</style>
