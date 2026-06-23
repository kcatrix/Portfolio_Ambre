<script setup lang="ts">
// Pas de logique : tout est en CSS. Composant purement décoratif.
</script>

<template>
  <div class="bulles" aria-hidden="true">
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
</div>
</template>

<style scoped>
.bulles {
  position: fixed;
  inset: 0;                 /* couvre tout l'écran */
  overflow: hidden;
  pointer-events: none;     /* ne bloque jamais les clics */
  z-index: -1;              /* reste dans le fond, derrière tous les composants */
}

.bulles span {
  position: absolute;
  bottom: -10vh;            /* part sous l'écran */
  border-radius: 50%;
  background: rgba(var(--accent-rgb), 0.08);   /* suit ta couleur d'accent */
  animation: monter linear infinite;
}

@keyframes monter {
  0%   { transform: translateY(0)      scale(1);   opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-110vh) scale(1.3); opacity: 0; }
}

.bulles span:nth-child(1)  { left: 8%;  width: 2.5rem; height: 2.5rem; animation-duration: 20s; animation-delay: 0s; }
.bulles span:nth-child(2)  { left: 20%; width: 1.2rem; height: 1.2rem; animation-duration: 16s; animation-delay: 3s; }
.bulles span:nth-child(3)  { left: 33%; width: 3.5rem; height: 3.5rem; animation-duration: 26s; animation-delay: 1s; }
.bulles span:nth-child(4)  { left: 45%; width: 1.6rem; height: 1.6rem; animation-duration: 18s; animation-delay: 5s; }
.bulles span:nth-child(5)  { left: 58%; width: 2rem;   height: 2rem;   animation-duration: 22s; animation-delay: 2s; }
.bulles span:nth-child(6)  { left: 67%; width: 1rem;   height: 1rem;   animation-duration: 15s; animation-delay: 4s; }
.bulles span:nth-child(7)  { left: 76%; width: 3rem;   height: 3rem;   animation-duration: 28s; animation-delay: 0s; }
.bulles span:nth-child(8)  { left: 85%; width: 1.4rem; height: 1.4rem; animation-duration: 17s; animation-delay: 6s; }
.bulles span:nth-child(9)  { left: 92%; width: 2.2rem; height: 2.2rem; animation-duration: 24s; animation-delay: 2s; }
.bulles span:nth-child(10) { left: 14%; width: 1.1rem; height: 1.1rem; animation-duration: 19s; animation-delay: 7s; }
.bulles span:nth-child(11) { left: 50%; width: 1rem;   height: 1rem;   animation-duration: 21s; animation-delay: 8s; }
.bulles span:nth-child(12) { left: 70%; width: 1.8rem; height: 1.8rem; animation-duration: 23s; animation-delay: 3s; }
.bulles span:nth-child(13) { left: 4%;  width: 1.5rem; height: 1.5rem; animation-duration: 25s; animation-delay: 1s; }
.bulles span:nth-child(14) { left: 27%; width: 0.9rem; height: 0.9rem; animation-duration: 14s; animation-delay: 6s; }
.bulles span:nth-child(15) { left: 39%; width: 2.3rem; height: 2.3rem; animation-duration: 27s; animation-delay: 4s; }
.bulles span:nth-child(16) { left: 53%; width: 1.3rem; height: 1.3rem; animation-duration: 19s; animation-delay: 9s; }
.bulles span:nth-child(17) { left: 63%; width: 2.7rem; height: 2.7rem; animation-duration: 30s; animation-delay: 2s; }
.bulles span:nth-child(18) { left: 80%; width: 1.1rem; height: 1.1rem; animation-duration: 16s; animation-delay: 5s; }
.bulles span:nth-child(19) { left: 88%; width: 1.9rem; height: 1.9rem; animation-duration: 23s; animation-delay: 7s; }
.bulles span:nth-child(20) { left: 97%; width: 1.3rem; height: 1.3rem; animation-duration: 21s; animation-delay: 3s; }
</style>