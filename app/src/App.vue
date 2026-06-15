<script setup lang="ts">
import AnimatedBackground from './components/AnimatedBackground.vue'
</script>

<template>
  <header>
    <h1>Portfolio Ambre Rat</h1>
  </header>
  <main class="contenu">
    <AnimatedBackground />
      <div class="gauche">  
        <img v-motion-roll-bottom 
             class="photo-profil" 
             src="/app/public/Ambre.jpg" 
             alt="Photo de profil">
      </div>
      <div class="droite">
        <div class="titre-contenue-droite">
          <h2>Bienvenue sur mon portfolio!</h2>
        </div>
        <div class="contenu-droite">
        droite ici
        <p>Bienvenue sur mon portfolio!</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        <p>Contenue pour remplir l'espace</p>
        </div>
      </div>
  </main>
</template>

<style>

.contenu {
  display: flex;
  flex: 1;
  min-height: 0;
}

.gauche {
  justify-content: center;
  display: flex;
  width: 450px;
}

.photo-profil {
  margin-top: 20px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 3px 70px rgba(0, 0, 0, 0.3);
}
.contenue {
  background-color: yellow;
  padding: 10px;
}

.titre-contenue-droite {
}
.droite {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
}

.contenu-droite {

}

body {
  margin: 0;
}

header {
  background-color: #333;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: white;
}

#app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

</style>
