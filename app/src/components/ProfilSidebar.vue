<script setup lang="ts">
import { ref, onMounted } from 'vue'

const segments = [
  { t: 'Donner du ' },
  { t: 'rythme', kw: true },
  { t: ', du ' },
  { t: 'sens', kw: true },
  { t: ' et du ' },
  { t: 'style', kw: true, anime: true },
  { t: ' à vos images.' },
]

const lettresAffichees = ref(0)
const termine = ref(false)
const total = segments.reduce((n, s) => n + s.t.length, 0)

function texteVisible(index: number): string {
  let avant = 0
  for (let j = 0; j < index; j++) avant += segments[j].t.length
  const restant = lettresAffichees.value - avant
  if (restant <= 0) return ''
  return segments[index].t.slice(0, restant)
}

onMounted(() => {
  const timer = setInterval(() => {
    lettresAffichees.value++
    if (lettresAffichees.value >= total) {
      clearInterval(timer)
      termine.value = true
    }
  }, 45)
})

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
    [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }],
    { duration: 600, easing: 'ease' }
  )
}

function brillance(e: Event) {
  (e.currentTarget as HTMLElement).animate(
    [
      { backgroundPosition: '100% 0' },
      { backgroundPosition: '0% 0' }
    ],
    { duration: 800, easing: 'ease-in-out' }
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
      <p class="accroche">
        <template v-for="(seg, i) in segments" :key="i"><span
            v-if="seg.kw"
            :class="{ 'mot-anime': seg.anime }"
            @click="seg.anime && brillance($event)">{{ texteVisible(i) }}</span><template
            v-else>{{ texteVisible(i) }}</template></template><span v-if="!termine" class="curseur"></span>
      </p>
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
  width: 28.125rem;
  top: 0;
  align-self: flex-start;
  perspective: 50rem;
  position: sticky;
}

.intro {
  max-width: 21.25rem;
  text-align: center;
}

.accroche {
  font-size: 1.3125rem;
  font-weight: 600;
  font-style: normal;
  line-height: 1.4;
  color: var(--text-fort);
  margin: 0 0 0.75rem;
  min-height: 3.0em; 
}

.curseur::after {
  content: '|';
  color: var(--accent);
  font-weight: 400;
  animation: clignote 0.7s step-end infinite;
}
@keyframes clignote {
  50% { opacity: 0; }
}

@keyframes bio-apparition {
  from {opacity: 0}
  to {opacity: 1}
}

@keyframes apparition {
  from { opacity: 0; transform: translateY(1rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes apparition-lateral {
  from { opacity: 0; transform: translateX(-2rem); }
  to   { opacity: 1; transform: translateX(0); }
}

.accroche .mot-anime {
  display: inline-block;          /* indispensable (comme vu avant) */
  cursor: pointer;
  background: linear-gradient(
    120deg,
    var(--accent) 0%,
    var(--accent) 45%,
    rgba(255, 255, 255, 0.9) 50%, /* la bande de lumière */
    var(--accent) 55%,
    var(--accent) 100%
  );
  background-size: 250% 100%;     /* dégradé plus large que le mot = place pour glisser */
  background-position: 0% 0;      /* au repos, la bande est hors champ */
  -webkit-background-clip: text;  /* le dégradé est "découpé" à la forme des lettres */
  background-clip: text;
  color: transparent;             /* le texte devient transparent → on voit le dégradé */
  -webkit-text-fill-color: transparent;  /* pour Safari */
}

.mot-anime {
  cursor: pointer;
  display: inline-block;
}

.mot-anime:hover {
  transform: scale(1.05);
}

.accroche span {
  color: var(--accent);        /* les mots-clés à la couleur d'accent */
}

.bio {
  font-size: 0.875rem;
  color: var(--text-doux);     /* bio plus discrète */
  line-height: 1.6;
  margin: 0;
  opacity: 0;
  animation: bio-apparition 0.8s ease 2.5s forwards; 
}

.skills {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 15.625rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.skills li {
  border-left: 0.1875rem solid var(--accent);   /* la barre d'accent */
  padding: 0.125rem 0 0.125rem 0.75rem;          /* espace entre la barre et le texte */
  text-align: left;
  opacity: 0;                                    /* caché au départ */
  animation: apparition-lateral 1.6s ease forwards;      /* joue l'animation */
}

.skills li:nth-child(1) { animation-delay: 0.3s; }
.skills li:nth-child(2) { animation-delay: 0.5s; }
.skills li:nth-child(3) { animation-delay: 0.7s; }

.skill-titre {
  display: flex;       /* icône + titre sur la même ligne */
  align-items: center;
  gap: 0.5rem;
}

.skill-titre i {
  color: var(--accent);
  font-size: 1rem;
}

.skills strong {
  font-size: 0.875rem;
  color: var(--text-fort);
}

.skill-desc {
  display: block;      /* passe à la ligne sous le titre */
  font-size: 0.8125rem;
  color: var(--text-doux);
  line-height: 1.4;
  margin-top: 0.125rem;
}

.skills-orbite {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.photo-profil {
  margin-top: 1.25rem;
  width: 12.5rem;
  height: 12.5rem;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0.1875rem 4.375rem rgba(0, 0, 0, 0.3);
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
    filter: blur(1.25rem);
  }
  to {
    opacity: 1;
    filter: blur(0);
  }
}

.socials {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
}

.social {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s;
  text-decoration: none;
  color: var(--accent);
}

.social:hover {
  transform: translateY(-0.1875rem);
}

.social i {
  font-size: 1.5rem;
}

.mail-chip {
  display: inline-flex;     /* les 3 éléments en ligne */
  align-items: center;      /* alignés verticalement au centre */
  gap: 0.625rem;                /* espace entre eux */
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  background: rgba(var(--accent-rgb), 0.1);   /* accent très clair, s'adapte au fond */
  border: 0.0625rem solid rgba(var(--accent-rgb), 0.2);
  border-radius: 62.4375rem;     /* coins ultra-arrondis = pilule */
  cursor: pointer;
  font-family: inherit;     /* hérite de la police du parent */
  margin-top: 0.3125rem;
}

.socials { opacity: 0; animation: apparition 0.6s ease 0.9s forwards; }
.mail-chip { opacity: 0; animation: apparition 0.6s ease 1.1s forwards; }

.mail-icone {
  color: var(--accent);
  font-size: 1rem;
}

.mail-adresse {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-fort);
}

.mail-copier {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;       /* cercle parfait */
  background: var(--accent);
  color: var(--on-accent);  /* l'icône hérite de cette couleur */
  font-size: 0.8125rem;
  cursor: pointer;
}

.mail-chip:hover {
  border-color: rgba(var(--accent-rgb), 0.5);
  transform: translateY(-0.125rem);
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
  width: 9.375rem;
  height: 9.375rem;
  flex-shrink: 0;
  animation: orbite 14s linear infinite;
}

.logiciel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3.125rem;
  height: 3.125rem;
  margin: -1.875rem;
  transform: rotate(var(--a)) translate(3.125rem) rotate(calc(-1 * var(--a)));
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
    drop-shadow(0 0 0.375rem rgba(255, 215, 0, 0.95))
    drop-shadow(0 0 1rem rgba(255, 195, 0, 0.8))
    drop-shadow(0 0 2rem rgba(255, 170, 0, 0.6));
}

@keyframes orbite { to { transform: rotate(360deg); } }
@keyframes orbite-inverse { to { transform: rotate(-360deg); } }
</style>
