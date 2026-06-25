<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function auScroll() {
  // afficher le bouton si on a scrollé plus de 300px
  visible.value = window.scrollY > 300
}

function remonter() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', auScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', auScroll)   // nettoyage : on retire l'écouteur
})
</script>

<template>
  <button v-if="visible" @click="remonter" class="bouton-haut" aria-label="Retour en haut">
    <i class="fa-solid fa-arrow-up"></i>
  </button>
</template>

<style scoped>

.bouton-haut {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: var(--on-accent);
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 0.25rem 1rem rgba(0,0,0,.25);
  z-index: 100;
  transition: transform 0.2s;
}
.bouton-haut:hover {
  transform: translateY(-0.2rem);
}
</style>