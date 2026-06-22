<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  video: { IdVideo: string; short: boolean }
}>()

const chargee = ref(false)

function lienEmbed(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1`
}

function playVideo() {
  window.open(`https://www.youtube.com/watch?v=${props.video.IdVideo}`, '_blank')
}
</script>

<template>
  <div class="video-card">
    <div class="video-wrapper" :class="{ short: video.short, chargement: !chargee }">
      <iframe
        :src="lienEmbed(video.IdVideo)"
        allow="autoplay; encrypted-media"
        allowfullscreen
        frameborder="0"
        @load="chargee = true">
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
  transition: opacity 1.6s ease, filter 1.6s ease;
}

.video-wrapper.chargement {
  opacity: 0;
  filter: blur(0.75rem);
}

.video-wrapper.short {
  aspect-ratio: 9 / 16;
  max-width: 15.625rem;
  margin: 0 auto;
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
