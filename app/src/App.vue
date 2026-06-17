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
      <div class="gauche">  
        <img class="photo-profil" 
             src="/app/public/Ambre.jpg" 
             alt="Photo de profil"
             @click="flip">
        <hr class="separateur">
        <div class="intro">
          <p class="accroche">Donner du rythme, du sens et du style à vos images.</p>
          <p>Monteuse indépendante, je m'adapte à tous vos formats avec une obsession : capter et garder l'attention.</p>
          <ul class="skills">
            <li>🎬 Montage & Rythme — Narration dynamique et transitions fluides.</li>
            <li>🔊 Sound Design — Audio immersif, mixage et traitement précis.</li>
            <li>✨ Motion Design — Habillage et animations sur-mesure.</li>
          </ul>
        </div>
        <div class="logiciels">
          <div class="logiciel" style="--a: 0deg"><img src="/ae.svg" alt="After Effects"></div>
          <div class="logiciel" style="--a: 120deg"><img src="/pr.svg" alt="Premiere Pro"></div>
          <div class="logiciel" style="--a: 240deg"><img src="/au.svg" alt="Audition"></div>
        </div>
        <hr class="separateur">
        <div class="socials">
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
      <div class="droite">
        <div class="titre-contenue-droite">
        <h2>Mes créations</h2>
        <div class="segment" :class="{ 'sur-videos': !montrerShorts }">
          <div class="indicateur"></div>
          <button class="opt" :class="{ actif: montrerShorts }" @click="montrerShorts = true">Shorts</button>
          <button class="opt" :class="{ actif: !montrerShorts }" @click="montrerShorts = false">Vidéos</button>
        </div>
      </div>
        <div class="contenu-droite">
        <hr class="separateur">
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

.intro {
  max-width: 340px;
  text-align: center;
  line-height: 1.6;
  color: #000000;
}

.accroche {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
}

.skills {
  list-style: none;
  padding: 0;
  text-align: left;
  font-size: 14px;
}

.skills li {
  margin-bottom: 10px;
}

.photo-profil {
  margin-top: 20px;
  width: 200px;
  height: 200px;
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
  display: flex;
  align-items: center;
  gap: 24px;
}

.segment {
  position: relative;
  display: inline-flex;
  padding: 4px;
  background: #f0f0f0;
  border-radius: 999px;
}

.indicateur {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: 90px;
  background: #6c5ce7;
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
  color: #666;
  transition: color 0.2s;
}

.opt.actif {
  color: white;
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

.socials {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.social {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.25s;
  text-decoration: none;
}

.social:hover {
  transform: translateY(-3px);
}

.social i {
  font-size: 24px;
}

.logiciels {
  position: relative;
  width: 200px;
  height: 200px;
  animation: orbite 14s linear infinite;
}

.logiciel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  margin: -30px;
  transform: rotate(var(--a)) translate(50px) rotate(calc(-1 * var(--a)));
}

.logiciel img {
  width: 100%;
  height: 100%;
  animation: orbite-inverse 14s linear infinite;
}

.logiciels:hover {
  animation-play-state: paused;
}

.logiciels:hover .logiciel img {
  animation-play-state: paused;
}

.logiciel img {
  transition: filter 0.3s;
}

.logiciel img:hover {
  filter:
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.95))
    drop-shadow(0 0 16px rgba(255, 195, 0, 0.8))
    drop-shadow(0 0 32px rgba(255, 170, 0, 0.6));
}

@keyframes orbite { to { transform: rotate(360deg); } }
@keyframes orbite-inverse { to { transform: rotate(-360deg); } }

.separateur {
  border: none;
  height: 2px;
  width: 80%;
  margin: 20px 0;
  background: linear-gradient(to right, transparent, rgba(108, 92, 231, 0.6), transparent);
}

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

</style>
