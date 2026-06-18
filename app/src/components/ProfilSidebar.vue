<script setup lang="ts">
import { ref } from 'vue'

const copie = ref(false)

function setClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    copie.value = true
    setTimeout(() => { copie.value = false }, 2000)
  }).catch(err => {
    console.error('Erreur lors de la copie : ', err)
  })
}

function flip(e: Event) {
  (e.currentTarget as HTMLElement).animate(
    [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(360deg)' }],
    { duration: 600, easing: 'ease' }
  )
}
</script>

<template>
  <div class="gauche">
    <img class="photo-profil"
         src="/Ambre.jpg"
         alt="Photo de profil"
         @click="flip">
    <hr class="separateur">
    <div class="intro">
      <p class="accroche">Donner du <span>rythme</span>, du <span>sens</span> et du <span>style</span> à vos images.</p>
      <p class="bio">Monteuse indépendante, je m'adapte à tous vos formats avec une obsession : capter et garder l'attention.</p>
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
</template>

<style scoped>
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
  color: var(--text-fort);
  margin: 0 0 12px;
}

.accroche span {
  color: var(--accent);        /* les mots-clés à la couleur d'accent */
}

.bio {
  font-size: 14px;
  color: var(--text-doux);     /* bio plus discrète */
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
  border-left: 3px solid var(--accent);   /* la barre d'accent */
  padding: 2px 0 2px 12px;          /* espace entre la barre et le texte */
  text-align: left;
}

.skill-titre {
  display: flex;       /* icône + titre sur la même ligne */
  align-items: center;
  gap: 8px;
}

.skill-titre i {
  color: var(--accent);
  font-size: 16px;
}

.skills strong {
  font-size: 14px;
  color: var(--text-fort);
}

.skill-desc {
  display: block;      /* passe à la ligne sous le titre */
  font-size: 13px;
  color: var(--text-doux);
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

.photo-profil:hover {
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

.social:hover {
  transform: translateY(-3px);
}

.social i {
  font-size: 24px;
}

.mail-chip {
  display: inline-flex;     /* les 3 éléments en ligne */
  align-items: center;      /* alignés verticalement au centre */
  gap: 10px;                /* espace entre eux */
  padding: 8px 8px 8px 16px;
  background: rgba(var(--accent-rgb), 0.1);   /* accent très clair, s'adapte au fond */
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  border-radius: 999px;     /* coins ultra-arrondis = pilule */
  cursor: pointer;
  font-family: inherit;     /* hérite de la police du parent */
}

.mail-icone {
  color: var(--accent);
  font-size: 16px;
}

.mail-adresse {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-fort);
}

.mail-copier {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;       /* cercle parfait */
  background: var(--accent);
  color: var(--on-accent);  /* l'icône hérite de cette couleur */
  font-size: 13px;
  cursor: pointer;
}

.mail-chip:hover {
  border-color: rgba(var(--accent-rgb), 0.5);
  transform: translateY(-2px);
}

.mail-copier:hover {
  transform: scale(1.08);   /* le bouton grossit un peu */
}

.mail-chip:active {
  transform: scale(0.98);
}

.mail-copier.copie {
  background: var(--succes);
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
  transition: filter 0.3s;
}

.logiciels:hover {
  animation-play-state: paused;
}

.logiciels:hover .logiciel img {
  animation-play-state: paused;
}

.logiciel img:hover {
  filter:
    drop-shadow(0 0 6px rgba(255, 215, 0, 0.95))
    drop-shadow(0 0 16px rgba(255, 195, 0, 0.8))
    drop-shadow(0 0 32px rgba(255, 170, 0, 0.6));
}

@keyframes orbite { to { transform: rotate(360deg); } }
@keyframes orbite-inverse { to { transform: rotate(-360deg); } }
</style>
