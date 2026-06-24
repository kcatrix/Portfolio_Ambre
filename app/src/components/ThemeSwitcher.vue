<script setup lang="ts">
import { ref, watch } from 'vue'

/* --- Couleurs d'accent ---
   Pour ajouter une couleur : ajoute une entrée ici ET le bloc
   [data-theme="..."] correspondant dans src/themes.css. */
const themes = [
  { id: 'violet',   nom: 'Violet',   couleur: '#6c5ce7' },
  { id: 'indigo',   nom: 'Indigo',   couleur: '#4f46e5' },
  { id: 'ocean',    nom: 'Océan',    couleur: '#0984e3' },
  { id: 'cyan',     nom: 'Cyan',     couleur: '#00b8d4' },
  { id: 'emeraude', nom: 'Émeraude', couleur: '#00b894' },
  { id: 'lime',     nom: 'Lime',     couleur: '#7cb342' },
  { id: 'ambre',    nom: 'Ambre',    couleur: '#f39c12' },
  { id: 'corail',   nom: 'Corail',   couleur: '#e17055' },
  { id: 'rouge',    nom: 'Rouge',    couleur: '#e74c3c' },
  { id: 'rose',     nom: 'Rose',     couleur: '#e84393' },
]

/* --- Fonds ---
   Pour ajouter un fond : ajoute une entrée ici ET le bloc
   [data-bg="..."] correspondant dans src/themes.css.
   `couleur` = aperçu affiché sur la pastille (= la valeur de --bg). */
const backgrounds = [
  { id: 'clair',   nom: 'Clair',   couleur: '#ffffff' },
  { id: 'creme',   nom: 'Crème',   couleur: '#faf6ef' },
  { id: 'brume',   nom: 'Brume',   couleur: '#eef2f7' },
  { id: 'sombre',  nom: 'Sombre',  couleur: '#15151c' },
  { id: 'ardoise', nom: 'Ardoise', couleur: '#1b2430' },
]

const themeActif = ref(localStorage.getItem('theme') || 'violet')
const bgActif = ref(localStorage.getItem('bg') || 'sombre')

watch(themeActif, (id) => {
  document.documentElement.setAttribute('data-theme', id)
  localStorage.setItem('theme', id)
}, { immediate: true })

watch(bgActif, (id) => {
  document.documentElement.setAttribute('data-bg', id)
  localStorage.setItem('bg', id)
}, { immediate: true })
</script>

<template>
  <div class="theme-switcher">
    <button class="trigger" aria-label="Changer le thème" aria-haspopup="true">
      <i class="fa-solid fa-palette"></i>
    </button>
    <div class="panel">
      <div class="switch-row">
        <span class="switch-label">Couleur</span>
        <div class="dots">
          <button
            v-for="t in themes"
            :key="t.id"
            class="dot"
            :class="{ actif: themeActif === t.id }"
            :style="{ background: t.couleur }"
            :title="t.nom"
            :aria-label="`Couleur ${t.nom}`"
            @click="themeActif = t.id">
          </button>
        </div>
      </div>
      <div class="switch-row">
        <span class="switch-label">Fond</span>
        <div class="dots">
          <button
            v-for="b in backgrounds"
            :key="b.id"
            class="dot"
            :class="{ actif: bgActif === b.id }"
            :style="{ background: b.couleur }"
            :title="b.nom"
            :aria-label="`Fond ${b.nom}`"
            @click="bgActif = b.id">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  /* zone de survol un peu plus large que le bouton pour déclencher tôt */
  padding-bottom: 0.75rem;
}

/* Le bouton compact, toujours visible */
.trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: var(--on-accent);
  font-size: 1.125rem;
  cursor: pointer;
  box-shadow: 0 0.125rem 0.75rem rgba(0, 0, 0, 0.18);
  transition: transform 0.2s, background 0.3s ease;
}

.theme-switcher:hover .trigger,
.theme-switcher:focus-within .trigger {
  transform: rotate(20deg) scale(1.05);
}

/* Le panneau déployable */
.panel {
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: rgba(var(--panel-rgb), 0.85);
  backdrop-filter: blur(0.5rem);
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1.125rem rgba(0, 0, 0, 0.2);

  /* état replié */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-0.5rem) scale(0.96);
  transform-origin: top right;
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease, visibility 0.22s;
}

.theme-switcher:hover .panel,
.theme-switcher:focus-within .panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.switch-label {
  width: 3.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025rem;
  color: var(--text-doux);
}

.dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 1.375rem;
  height: 1.375rem;
  padding: 0;
  border: 0.125rem solid transparent;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 0.0625rem rgba(128, 128, 128, 0.25); /* contour léger pour le blanc */
  transition: transform 0.2s, border-color 0.2s;
}

.dot:hover {
  transform: scale(1.15);
}

.dot.actif {
  border-color: var(--accent);
  transform: scale(1.1);
}
</style>
