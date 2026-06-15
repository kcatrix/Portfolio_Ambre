<script setup lang="ts">
</script>

<template>
  <header>
    <h1>Portfolio Ambre Rat</h1>
  </header>
  <main class="contenu">
      <div class="gauche">  
        <img class="photo-profil" src="src/assets/hero.png" alt="Photo de profil">
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
  width: 450px;
  background-color: red;
}

.photo-profil {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}
.contenue {
  background-color: yellow;
  padding: 10px;
}

.titre-contenue-droite {
  background-color: green;
}
.droite {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: blue;
  overflow-y: auto;
}

.contenu-droite {
  background-color: yellow;
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
