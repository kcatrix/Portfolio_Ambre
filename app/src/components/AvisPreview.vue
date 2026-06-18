<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const avis = ref([])

onMounted(async () => {
  const response = await fetch(`${apiUrl}/api/avis`)
  avis.value = await response.json()
})

const avisDouble = computed(() => [... avis.value, ... avis.value])

function premierePhrase(texte: string) {
  const match = texte.match(/^.*?[.!?]/)
  if (match) return match[0]
  return texte.length > 60 ? texte.slice(0, 60) + '…' : texte
}

function étoile(note: number) {
  return '★'.repeat(note) + '☆'.repeat(5 - note)
}
</script>

<template>
  <div class="avis">
	<div class="avis-container">
	  <div v-for="(info, i) in avisDouble" :key="`${info.id}-${i}`" class="tick-item">
      <span class="tick-pseudo">{{ info.pseudo }}</span>
      <span class="tick-etoiles">{{ étoile(info.note) }}</span>
      <span class="tick-msg">{{ premierePhrase(info.message) }}</span>
      <span class="tick-sep">●</span>
    </div>
  </div>
  </div>
</template>

<style>

.avis {
  margin: 10px 20px;
  white-space: nowrap;
  overflow: hidden;
}

.avis-container {
	display: inline-flex;
  width: max-content;
	gap: 16px;
  animation: defiler 25s linear infinite;
}

@keyframes defiler {
  from { transform: translateX(-50%);}
  to   {  transform: translateX(0); }
}
.tick-item {
  display: inline-flex;   /* les 4 morceaux alignés sur une ligne */
  align-items: center;
  gap: 8px;               /* petit espace entre pseudo / étoiles / message / séparateur */
  font-size: 15px;
}

.tick-msg {
  color: var(--text-doux);   /* gris discret */
}

.tick-pseudo {
  font-weight: 600;       /* gras */
  color: var(--text-fort);
}

.tick-etoiles {
  color: #f5b50a;         /* doré façon Amazon */
  font-size: 13px;
  letter-spacing: 1px;    /* aère un peu les étoiles */
}

.tick-sep {
  color: var(--accent);     /* couleur d'accent du thème */
  font-size: 18px;         /* un petit point */
}

</style>