<script setup lang="ts">

import { ref, onMounted} from 'vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  const response = await fetch(`${apiUrl}/api/avis`)
  avis.value = await response.json()
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
}

const avis = ref<Avis[]>([])

function formatAbonnes(n: string | null): string {
  if (!n) return ''
  const num = Number(n)
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1_000) return Math.round(num / 1_000) + 'k'
  return String(num)
}

</script>

<template>
	<h2 class="titre">Ils me font confiance</h2>
	<div class="grille-avis">
	<div v-for="(info, i) in avis" :key="`${info.id}-${i}`" class="cards">

		<!-- partie gauche : l'avis -->
		<div class="avis-texte">
		<span class="pseudo">{{ info.pseudo }}</span>
		<span class="avis-etoiles">{{ '★'.repeat(info.note) }}{{ '☆'.repeat(5 - info.note) }}</span>
		<p class="avis-message">{{ info.message }}</p>
		</div>

		<!-- partie droite : la chaîne (seulement si on a le logo) -->
		<a v-if="info.chaine_logo" :href="info.url" target="_blank" class="avis-chaine">
		<img :src="info.chaine_logo" :alt="info.pseudo ?? ''" class="avis-logo">
		<span class="avis-nom">{{ info.pseudo }}</span>
		<span class="avis-abonnes">{{ formatAbonnes(info.chaine_abonnes) }} abonnés</span>
		</a>
	</div>
	</div>
</template>

<style scoped>

.cards {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  background: var(--surface);
  border: 0.0625rem solid rgba(var(--accent-rgb), 0.15);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 0.5rem 1.25rem rgba(0,0,0,.12);
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.cards:hover {
  transform: translateY(-0.25rem);
  border-color: rgba(var(--accent-rgb), 0.4);
  box-shadow: 0 0.75rem 1.75rem rgba(var(--accent-rgb), 0.18);
}

.avis-texte {
  display: flex;
  flex-direction: column;
  background: none;      /* on retire le fond/ombre individuel */
  box-shadow: none;
  padding: 0;
}

.grille-avis {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
  padding: 0.625rem;
}

.avis-chaine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

/* partie avis (gauche) */
.pseudo        { font-size: 1.1rem; font-weight: 700; color: var(--text-fort); }
.avis-etoiles  { color: #f5b50a; font-size: 1.1rem; margin: .4rem 0; }
.avis-message  { font-size: .95rem; color: var(--text-doux); line-height: 1.4; }

/* partie chaîne (droite) */
.avis-logo {
  width: 110px;          /* 150 → 110, plus raisonnable */
  height: 110px;
  border-radius: 50%;
  border: 0.1875rem solid rgba(var(--accent-rgb), 0.35);
  box-shadow: 0 0.5rem 1.25rem rgba(0,0,0,.25);
  object-fit: cover;
  transition: border-color 0.2s, transform 0.2s;
}
.avis-chaine:hover .avis-logo {
  border-color: var(--accent);
  transform: scale(1.04);
}
.avis-nom      { font-size: 1.15rem; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; color: var(--text-fort); }
.avis-abonnes  { font-size: .9rem; font-weight: 600; color: var(--text-doux); }
</style>