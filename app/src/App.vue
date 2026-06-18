<script setup lang="ts">
import AnimatedBackground from './components/AnimatedBackground.vue'
import { ref, onMounted, computed } from 'vue'

const videos = ref([])
const chargees = ref(new Set())
const copie = ref(false)

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

function setClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    copie.value = true
    setTimeout(() => { copie.value = false }, 2000)
  }).catch(err => {
    console.error('Erreur lors de la copie : ', err)
  })
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
          <div class="intro">
            <p class="accroche">Donner du <span>rythme</span>, du <span>sens</span> et du <span>style</span> à vos images.</p>
            <p class="bio">Monteuse indépendante, je m'adapte à tous vos formats avec une obsession : capter et garder l'attention.</p>
          </div>
        </div>
       <div class="skills-orbite">
          <ul class="skills">
            <li>
              <div class="skill-titre"><i class="fa-solid fa-film"></i><strong>Montage & Rythme</strong></div>
              <span class="skill-desc">Narration dynamique et transitions fluides.</span>
            </li>
            <li>
              <div class="skill-titre"><i class="fa-solid fa-volume-high"></i><strong>Sound Design</strong></div>
              <span class="skill-desc">Audio immersif, mixage et traitement précis.</span>
            </li>
            <li>
              <div class="skill-titre"><i class="fa-solid fa-wand-magic-sparkles"></i><strong>Motion Design</strong></div>
              <span class="skill-desc">Habillage et animations sur-mesure.</span>
            </li>
          </ul>
          <div class="logiciels">
            <div class="logiciel" style="--a: 0deg"><img src="/ae.svg" alt="After Effects"></div>
            <div class="logiciel" style="--a: 120deg"><img src="/pr.svg" alt="Premiere Pro"></div>
            <div class="logiciel" style="--a: 240deg"><img src="/au.svg" alt="Audition"></div>
          </div>
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
        </div>
        <button @click="setClipboard('ambre.rat2007@gmail.com')" class="mail-chip">
          <i class="fa-regular fa-envelope mail-icone"></i>
          <span class="mail-adresse">ambre.rat2007@gmail.com</span>
          <span class="mail-copier" :class="{ copie: copie }">
            <i :class="copie ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
          </span>
        </button>
      </div>
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
  overflow-y: auto;
}

.gauche {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 450px;
  top: 0;
  align-self: flex-start;
  perspective: 800px;
  position: sticky;
}

.intro {
  max-width: 340px;
  text-align: center;
}

.accroche {
  font-size: 21px;
  font-weight: 600;
  font-style: normal;   /* on enlève l'italique pour un rendu plus net */
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.accroche span {
  color: #6c5ce7;        /* les mots-clés en violet */
}

.bio {
  font-size: 14px;
  color: #777;           /* bio plus discrète */
  line-height: 1.6;
  margin: 0;
}

.skills {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skills li {
  border-left: 3px solid #6c5ce7;   /* la barre d'accent */
  padding: 2px 0 2px 12px;          /* espace entre la barre et le texte */
  text-align: left;
}

.skill-titre {
  display: flex;       /* icône + titre sur la même ligne */
  align-items: center;
  gap: 8px;
}

.skill-titre i {
  color: #6c5ce7;
  font-size: 16px;
}

.skills strong {
  font-size: 14px;
  color: #1a1a1a;
}

.skill-desc {
  display: block;      /* passe à la ligne sous le titre */
  font-size: 13px;
  color: #777;
  line-height: 1.4;
  margin-top: 2px;
}

.skills-orbite {
  display: flex;
  align-items: center;
  gap: 16px;
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
  font-family: 'Poppins', sans-serif;
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
  transition: all 0.25s;
  text-decoration: none;
}

.mail-chip {
  display: inline-flex;     /* les 3 éléments en ligne */
  align-items: center;      /* alignés verticalement au centre */
  gap: 10px;                /* espace entre eux */
  padding: 8px 8px 8px 16px;
  background: #f0eefe;      /* violet très clair */
  border: 1px solid rgba(108, 92, 231, 0.2);
  border-radius: 999px;     /* coins ultra-arrondis = pilule */
  cursor: pointer;
  family: inherit;               /* hérite de la police du parent */
}

.mail-icone {
  color: #6c5ce7;
  font-size: 16px;
}

.mail-adresse {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.mail-copier {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;       /* cercle parfait */
  background: #6c5ce7;
  color: white;             /* l'icône hérite de cette couleur */
  font-size: 13px;
  cursor: pointer;
}

.mail-chip:hover {
  border-color: rgba(108, 92, 231, 0.5);
  transform: translateY(-2px);
}

.mail-copier:hover {
  transform: scale(1.08);   /* le bouton grossit un peu */
}

.mail-chip:active {
  transform: scale(0.98);
}

.mail-copier.copie {
  background: #00b894;
}

.social:hover {
  transform: translateY(-3px);
}

.social i {
  font-size: 24px;
}

.logiciels {
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
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
  margin: 20px auto;
  background: linear-gradient(to right, transparent, rgba(108, 92, 231, 0.6), transparent);
}

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

</style>
