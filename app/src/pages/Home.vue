<script setup lang="ts">
import ProfilSidebar from '../components/ProfilSidebar.vue'
import Creations from '../components/Creations.vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import BullesFond from '../components/BullesFond.vue'
</script>

<template>
  <BullesFond />
  <ThemeSwitcher />
  <main class="contenu">
    <ProfilSidebar />
    <Creations />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: var(--bg-gradient);
  background-attachment: fixed;   /* le dégradé reste fixe quand le contenu défile */
  color: var(--text-fort);
  transition: background 0.3s ease, color 0.3s ease;
}

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

.contenu {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* Séparateur partagé par les deux colonnes — laissé global volontairement. */
.separateur {
  border: none;
  height: 0.125rem;
  width: 80%;
  margin: 1.25rem auto;
  background: linear-gradient(to right, transparent, rgba(var(--accent-rgb), 0.6), transparent);
}

@media (max-width: 56.25rem) {
  .contenu{
    flex-direction: column;
    overflow-y: visible;
  }
  #app {
    height: auto;
  }
}
</style>
