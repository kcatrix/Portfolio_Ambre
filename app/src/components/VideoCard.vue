<script setup lang="ts">
const props = defineProps<{
  video: { IdVideo: string; short: boolean }
}>()

function lienEmbed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1`
}

function playVideo() {
  window.open(`https://www.youtube.com/watch?v=${props.video.IdVideo}`, '_blank')
}
</script>

<template>
  <div class="video-card">
    <div class="video-wrapper" :class="{ short: video.short }">
      <iframe
        :src="lienEmbed(video.IdVideo)"
        allow="autoplay; encrypted-media"
        allowfullscreen
        frameborder="0"
        loading="lazy">
      </iframe>
      <div class="overlay" @click="playVideo"></div>
    </div>
  </div>
</template>

<style scoped>
.video-card {
  transition: transform 0.3s;
}

.video-card:hover {
  transform: scale(1.05);
}

.video-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 0.5rem;
  overflow: hidden;
  animation: apparition 1.6s ease;
}

@keyframes apparition {
  from { opacity: 0; filter: blur(0.75rem); }
  to   { opacity: 1; filter: blur(0); }
}

.video-wrapper.short {
  /* Pas de max-width : le short remplit sa colonne 1fr -> il scale avec
     l'écran et l'espacement entre vidéos reste régulier (le gap de la grille). */
  aspect-ratio: 9 / 16;
}

.video-wrapper iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.overlay {
  position: absolute;
  inset: 0;
  cursor: pointer;
}
</style>
