<template>
	<div :class="$style.index">
		<RouterView />
	</div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import axios from 'axios'
import { useLoginStore } from './stores/counter';
import router from './router';

const loginStore = useLoginStore()
const token = localStorage.getItem('token')

onMounted(async () => { 
	if (token) {
		const response = await axios.get("http://localhost:3000/autoLogin", {
			headers: {
				"authentification": token
			}
		})

		if (response.status === 401) {
			// ?
			localStorage.removeItem("token")

		} else if (response.status == 200) {
			const userInfo = response.data.userInfo
			loginStore.login(userInfo)
		}
	}
})



</script>

<style lang="scss" module>
* {
	box-sizing: border-box;
}

body { 
	margin: 0;
}

.header {
	width: 1200px;
	height: 52px;

	text-align: center;
	line-height: 52px;

	border-bottom: 1px solid red;
	margin-bottom: 20px;
}

.index {
	width: 1200px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	// margin: 0 auto;
}


</style>
