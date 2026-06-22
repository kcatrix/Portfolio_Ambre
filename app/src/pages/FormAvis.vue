<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const pseudo = ref('');
const email = ref('');
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
			email: email.value,
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
	<div class="titre">Laisse ton avis</div>
	<form @submit.prevent="envoyer" v-if="!send" class="form">
		<input v-model="pseudo" type="text" placeholder="Le nom de ta chaîne" required>
		<input v-model="email" type="email" placeholder="Ton email (ne sera pas affiché)" required>
		<textarea v-model="message" type="text" placeholder="Ton avis sur mon travail" required></textarea>
		<div @mouseleave="survol = 0">
			<span class="étoile" v-for="(i,index) in 5" @mouseenter="survol = i" @click="note = i">
				{{ (survol || note) >= i ? '★' : '☆' }}
			</span>
		</div>
		<button type="submit">Envoyer</button>
		<p v-if="erreur" class="erreur">{{ erreur }}</p>
	</form>
	<div v-else>
		Merci pour ton avis !
	</div>
</div>
</template>

<style scoped>

.page-avis{
	display: flex; align-items: center; justify-content: center;
	background: #f7f6fd;
	min-height: 100vh;
	flex-direction: column;
}


.form{
	display: flex;
	flex-direction: column;
	gap : 10px;
	text-align: center;
	margin: 30px auto;
	width: 100%;
	max-width: 500px;
	background: white;
	padding: 32px;
	border-radius: 16px;

}

.form input, .form textarea{
	padding: 11px;
	border: 1px solid #ddd;
	border-radius: 10px;
	box-sizing: border-box;
	width: 100%;
	font-size: 14px
}
.form textarea{
	font-family: inherit;
	resize: vertical;
}

.form input:focus, .form textarea:focus {
  border-color: #6c5ce7;
  outline: none;
}

.étoile{
	color: #f5b50a;         /* doré façon Amazon */
	font-size: 26px;
	letter-spacing: 1px;
	cursor: pointer;
}

.form button{
	background: #6c5ce7;
	color: white;
	border: none;
	border-radius: 10px;
	padding: 12px;
	font-weight: 600;
	cursor: pointer;
}

.form button:hover { background: #5a4bd1; }

.erreur {
  color: #e74c3c;   /* rouge */
  font-size: 14px;
}
</style>