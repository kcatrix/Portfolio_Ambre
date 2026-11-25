<script setup lang="ts">

import { ref, reactive, onMounted, onBeforeUnmount, nextTick} from 'vue'

onMounted(async () => {
  const response = await fetch('/api/avis')
  avis.value = await response.json()
  await nextTick()

  mesurerMessages()
  document.fonts?.ready.then(mesurerMessages)   // la police change la hauteur du texte
  window.addEventListener('resize', mesurerMessages)

  const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    } else {
      entry.target.classList.remove('visible')
    }
  })
}, {
  threshold: 0,                          
})

  document.querySelectorAll('.cards').forEach(card => observer.observe(card))
})

interface Avis {
  id: number
  pseudo: string
  note: number
  message: string
  url: string
  chaine_nom: string | null
  chaine_logo: string | null
  chaine_abonnes: string | null
  tiktok_abonnes: string | null
}

const avis = ref<Avis[]>([])

function vraieChaine(info: Avis): boolean {
  return !!info.chaine_logo && info.chaine_nom !== 'Undefined'
}

// Logo du réseau selon le lien laissé dans l'avis
const reseaux = [
  { domaines: ['youtube.com', 'youtu.be'], icone: 'fa-brands fa-youtube', couleur: '#ff0000', nom: 'YouTube', unavatar: 'youtube' },
  { domaines: ['tiktok.com'], icone: 'fa-brands fa-tiktok', couleur: '#000000', nom: 'TikTok', unavatar: 'tiktok' },
  { domaines: ['x.com', 'twitter.com'], icone: 'fa-brands fa-x-twitter', couleur: 'var(--text-fort)', nom: 'X', unavatar: 'x' },
  { domaines: ['instagram.com'], icone: 'fa-brands fa-instagram', couleur: '#e1306c', nom: 'Instagram', unavatar: 'instagram' },
  { domaines: ['twitch.tv'], icone: 'fa-brands fa-twitch', couleur: '#9146ff', nom: 'Twitch', unavatar: 'twitch' },
]

function reseau(url: string) {
  let hote = ''
  try { hote = new URL(url).hostname.toLowerCase() } catch { hote = url.toLowerCase() }
  const trouve = reseaux.find(r => r.domaines.some(d => hote === d || hote.endsWith('.' + d)))
  return trouve ?? { icone: 'fa-solid fa-link', couleur: 'var(--accent)', nom: 'Lien', unavatar: null }
}

// Photo : logo de la chaîne YouTube si on l'a, sinon la photo du compte du lien (via unavatar.io)
const photosKO = reactive(new Set<number>())

function pseudoDuLien(url: string): string | null {
  try {
    const segment = new URL(url).pathname.split('/').filter(Boolean)[0]
    if (!segment) return null
    const pseudo = decodeURIComponent(segment).replace(/^@/, '')
    return /^[\w.-]+$/.test(pseudo) ? pseudo : null
  } catch {
    return null
  }
}

function photoAvis(info: Avis): string | null {
  if (vraieChaine(info)) return info.chaine_logo
  if (photosKO.has(info.id)) return null
  const service = reseau(info.url).unavatar
  // YouTube : seulement les liens /@pseudo (pas /watch, /channel…)
  if (service === 'youtube' && !/\/@/.test(info.url)) return null
  const pseudo = pseudoDuLien(info.url)
  return service && pseudo ? `https://unavatar.io/${service}/${encodeURIComponent(pseudo)}?fallback=false` : null
}

function photoEnErreur(info: Avis) {
  if (vraieChaine(info)) info.chaine_logo = null
  else photosKO.add(info.id)
}

// Lisibilité : texte replié à 5 lignes, « Lire la suite » seulement s'il dépasse
const ouverts = reactive(new Set<number>())
const tronques = reactive(new Set<number>())
const messages = new Map<number, HTMLElement>()

const lierMessage = (id: number) => (el: unknown) => {
  if (el) messages.set(id, el as HTMLElement)
  else messages.delete(id)
}

function mesurerMessages() {
  messages.forEach((el, id) => {
    if (ouverts.has(id)) return
    if (el.scrollHeight > el.clientHeight + 1) tronques.add(id)
    else tronques.delete(id)
  })
}

function basculer(id: number) {
  if (ouverts.has(id)) ouverts.delete(id)
  else ouverts.add(id)
}

onBeforeUnmount(() => window.removeEventListener('resize', mesurerMessages))

// Un ancien avis importé en SQL garde des apostrophes doublées (J''ai) : on les corrige à l'affichage
const texteAvis = (message: string) => message.replace(/''/g, "'")

function formatAbonnes(n: string | null): string {
  if (!n) return ''
  const num = Number(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1_000) return Math.round(num / 1_000) + 'k'
  return String(num)
}

</script>

<template>
<div v-if="avis.length > 0" id="section-avis">
	<hr class="separateur">
	<h2 class="titre">Ils me font <span>confiance</span></h2>
	<div class="grille-avis">
	<article v-for="(info, i) in avis" :key="`${info.id}-${i}`" class="cards"
   :style="{ '--delay': Math.min(i * 90) + 'ms' }">

		<!-- en-tête : la chaîne, lien vers le profil -->
		<a :href="info.url" target="_blank" rel="noopener" class="card-entete">
		<img v-if="photoAvis(info)" :src="photoAvis(info)!" :alt="info.pseudo" class="avis-logo"
			referrerpolicy="no-referrer" loading="lazy" @error="photoEnErreur(info)">
		<div v-else class="avis-logo avatar-vide">{{ info.pseudo.charAt(0).toUpperCase() }}</div>
      <div class="card-ident">
			<span class="avis-nom">{{ info.pseudo }}</span>
			<span v-if="vraieChaine(info) && info.chaine_abonnes" class="avis-abonnes">
        <i class="fa-brands fa-youtube" aria-hidden="true"></i> {{ formatAbonnes(info.chaine_abonnes) }} abonnés
      </span>
			<span v-if="info.tiktok_abonnes" class="avis-abonnes">
        <i class="fa-brands fa-tiktok" aria-hidden="true"></i> {{ formatAbonnes(info.tiktok_abonnes) }} abonnés
      </span>
		</div>
		<i class="yt-icon"
    :class="reseau(info.url).icone"
    :style="{ color: reseau(info.url).couleur }"
    :title="reseau(info.url).nom"
    aria-hidden="true"></i>
		</a>

		<span class="avis-etoiles">{{ '★'.repeat(info.note) }}{{ '☆'.repeat(5 - info.note) }}</span>
		<p class="avis-message" :class="{ ouvert: ouverts.has(info.id) }" :ref="lierMessage(info.id)">{{ texteAvis(info.message) }}</p>
		<button v-if="tronques.has(info.id) || ouverts.has(info.id)" type="button" class="avis-suite"
			:aria-expanded="ouverts.has(info.id)" @click="basculer(info.id)">
			{{ ouverts.has(info.id) ? 'Réduire' : 'Lire la suite' }}
			<i class="fa-solid" :class="ouverts.has(info.id) ? 'fa-chevron-up' : 'fa-chevron-down'" aria-hidden="true"></i>
		</button>
	</article>
	</div>
</div>
</template>

<style scoped>

.titre span {
  color: var(--accent);
}


/* 3 avis par ligne ; la dernière ligne incomplète reste centrée */
.grille-avis {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  padding: 0.625rem;
}

.cards {
  flex: 0 1 calc((100% - 2 * 1.25rem) / 3);
  min-width: 0;
  box-sizing: border-box;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: var(--surface);
  border: 0.0625rem solid rgba(var(--accent-rgb), 0.12);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 0.5rem 1.25rem rgba(0,0,0,.08);
  opacity: 0;
  transform: translateY(1.5rem) scale(0.96);
    transition: opacity .5s ease var(--delay),
              transform .5s cubic-bezier(.22,1,.36,1) var(--delay),
              border-color .2s, box-shadow .2s;
}

.cards.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.cards:hover {
  transform: translateY(-0.25rem);
  border-color: rgba(var(--accent-rgb), 0.4);
  box-shadow: 0 0.9rem 2rem rgba(var(--accent-rgb), 0.16);
  transition: transform .2s ease, border-color .2s, box-shadow .2s;
}

/* en-tête : la chaîne */
.card-entete {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.avatar-vide {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--accent-rgb), 0.15);
  color: var(--accent);
  font-weight: 700;
  font-size: 1.3rem;
}
.avis-logo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 0.125rem solid rgba(var(--accent-rgb), 0.3);
}

.card-ident {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;   /* sinon le pseudo hérite du centrage de la section */
}

.card-entete:hover .avis-nom {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}

.avis-nom {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-fort);
}

.avis-abonnes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-doux);
}

.avis-abonnes i {
  flex: 0 0 1.25rem;
  text-align: center;
}

.yt-icon {
  margin-left: auto;  /* garde le positionnement */
  font-size: 1.3rem;     /* garde la taille */
}

.avis-etoiles {
  color: #f5b50a;
  font-size: 1.05rem;
  letter-spacing: 1px;
  text-align: left;
}

/* Texte plus grand et plus clair, replié à 5 lignes (plus de scroll caché dans la carte) */
.avis-message {
  font-size: 1rem;
  color: color-mix(in srgb, var(--text-fort) 80%, var(--surface));
  line-height: 1.65;
  margin: 0;
  text-align: left;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  overflow: hidden;
}

.avis-message.ouvert {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
}

.avis-suite {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: -0.25rem;
  padding: 0;
  border: 0;
  background: none;
  color: color-mix(in srgb, var(--accent) 60%, white);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.avis-suite:hover {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}

.avis-suite i {
  font-size: 0.7rem;
}

/* Colonne de contenu plus étroite : 2 par ligne, puis 1 sur petit écran */
@media (max-width: 81.25rem) {
  .cards { flex-basis: calc((100% - 1.25rem) / 2); }
}
@media (max-width: 40rem) {
  .cards { flex-basis: 100%; }
}

</style>
