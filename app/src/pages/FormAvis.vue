<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const pseudo = ref('');
const url = ref('');
const note = ref();
const message = ref('');
const survol = ref(0);
const send = ref(false)

const router = useRouter()
const erreur = ref('')


const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function envoyer () {
	if (!note.value) {
		erreur.value = 'Choisisez une note'
		setTimeout(() => { erreur.value = '' }, 3000)
		return
	}
	const response = await fetch(`${apiUrl}/api/avis`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			pseudo: pseudo.value,
			url: url.value,
			note: note.value,
			message: message.value,          
    	})
	})
	if (response.ok)
	{
		send.value = true
		setTimeout(() => { router.push('/') }, 4000)
	}
	else{
		erreur.value = response.statusText
		setTimeout(() => { erreur.value = ''}, 2000)
	}
}

</script>

<template>
<div class="page-avis">
	<div v-if="!send" class="titre">Laisse ton avis</div>
	<form @submit.prevent="envoyer" v-if="!send" class="form">
		<input v-model="pseudo" type="text" placeholder="Le nom de ta chaîne" required>
		<input v-model="url" type="url" placeholder="Url de ta chaine ex:(https://www.youtube.com/@Squeezie)" required>
		<textarea v-model="message" type="text" placeholder="Ton avis sur mon travail" required></textarea>
		<div @mouseleave="survol = 0">
			<span class="étoile" v-for="(i) in 5" @mouseenter="survol = i" @click="note = i">
				{{ (survol || note) >= i ? '★' : '☆' }}
			</span>
		</div>
		<button type="submit">Envoyer</button>
		<p v-if="erreur" class="erreur">{{ erreur }}</p>
	</form>
	<div class="remerciment" v-else>
		Merci pour ton avis !
	</div>
</div>
</template>

<style scoped>

.page-avis{
	display: flex; align-items: center; justify-content: center;
	background: var(--bg-gradient);
	background-attachment: fixed;   /* dégradé fixe pendant le défilement */
	color: var(--text-fort);
	min-height: 100dvh;
	flex-direction: column;
}


.form{
	display: flex;
	flex-direction: column;
	gap : 0.625rem;
	text-align: center;
	margin: 1.875rem auto;
	width: 100%;
	max-width: 31.25rem;
	background: var(--surface);
	padding: 2rem;
	border-radius: 1rem;

}

.form input, .form textarea{
	padding: 0.6875rem;
	border: 0.0625rem solid rgba(128, 128, 128, 0.3);
	border-radius: 0.625rem;
	box-sizing: border-box;
	width: 100%;
	font-size: 0.875rem;
	background: var(--bg);
	color: var(--text-fort);
}
.form textarea{
	font-family: inherit;
	resize: vertical;
}

.form input:focus, .form textarea:focus {
  border-color: var(--accent);
  outline: none;
}

.étoile{
	color: #f5b50a;         /* doré façon Amazon */
	font-size: 1.625rem;
	letter-spacing: 0.0625rem;
	cursor: pointer;
}

.form button{
	background: var(--accent);
	color: var(--on-accent);
	border: none;
	border-radius: 0.625rem;
	padding: 0.75rem;
	font-weight: 600;
	cursor: pointer;
}

.form button:hover { filter: brightness(0.92); }

.erreur {
  color: #e74c3c;   /* rouge */
  font-size: 0.875rem;
}
</style>