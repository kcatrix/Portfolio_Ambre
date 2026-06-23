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
<div v-if="avis.length > 0">
	<hr class="separateur">
	<h2 class="titre">Ils me font Confiance</h2>
	<div class="grille-avis">
	<a v-for="(info, i) in avis" :key="`${info.id}-${i}`"
		:href="info.url" target="_blank" class="cards">

		<!-- en-tête : la chaîne -->
		<div class="card-entete">
		<img v-if="info.chaine_logo" :src="info.chaine_logo" :alt="info.pseudo" class="avis-logo">
		<div v-else class="avis-logo avatar-vide">{{ info.pseudo.charAt(0).toUpperCase() }}</div>
		<div class="card-ident">
			<span class="avis-nom">{{ info.pseudo }}</span>
			<span v-if="info.chaine_abonnes" class="avis-abonnes">{{ formatAbonnes(info.chaine_abonnes) }} abonnés</span>
		</div>
		<i class="fa-brands fa-youtube yt-icon"></i>
		</div>

		<span class="avis-etoiles">{{ '★'.repeat(info.note) }}{{ '☆'.repeat(5 - info.note) }}</span>
		<p class="avis-message">{{ info.message }}</p>
	</a>
	</div>
</div>
</template>

<style scoped>

.grille-avis {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  padding: 0.625rem;
}

.cards {
  text-decoration: none;     /* 👈 pas de soulignement */
  color: inherit;            /* 👈 garde tes couleurs de texte */
  cursor: pointer;           /* 👈 curseur main sur toute la carte */
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: var(--surface);
  border: 0.0625rem solid rgba(var(--accent-rgb), 0.12);
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 0.5rem 1.25rem rgba(0,0,0,.08);
  transition: transform .2s, border-color .2s, box-shadow .2s;
}

.cards:hover {
  transform: translateY(-0.25rem);
  border-color: rgba(var(--accent-rgb), 0.4);
  box-shadow: 0 0.9rem 2rem rgba(var(--accent-rgb), 0.16);
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
}

.avis-nom {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-fort);
}

.avis-abonnes {
  font-size: 0.8rem;
  color: var(--text-doux);
}

.yt-icon {
  margin-left: auto;
  color: #ff0000;
  font-size: 1.3rem;
}

.avis-etoiles {
  color: #f5b50a;
  font-size: 1.05rem;
  letter-spacing: 1px;
  text-align: left;
}

.avis-message {
  font-size: 0.95rem;
  color: var(--text-doux);
  line-height: 1.5;
  margin: 0;
  text-align: left;
  max-height: 8rem; 
  overflow-y: auto;
}

</style>
