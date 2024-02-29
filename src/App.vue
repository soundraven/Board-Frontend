<template>
	<Header v-if="HeaderFooter"/>
	<div :class="[$style.index, borderOn()]">
		<RouterView />
	</div>
	<Footer v-if="HeaderFooter"/>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch, useCssModule } from 'vue'
import { useLoginStore } from './stores/counter';
import axios from './axios'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const loginStore = useLoginStore()
const token = localStorage.getItem('token')
const $style = useCssModule()

const HeaderFooter = ref(true)

const borderOn = () => { 
    return HeaderFooter.value === true ? $style.withHeader : ''
}

onMounted(async () => { 
	if (token) {
		const response = await axios.get("/autoLogin", {
			headers: {
				"authentification": token
			}
		})

		if (response.status === 401) {
			alert("올바르지 않은 사용자를 감지했습니다. 다시 로그인해 주시기 바랍니다.")
			localStorage.removeItem("token")

		} else if (response.status == 200) {
			const userInfo = response.data.userInfo
			loginStore.login(userInfo)
		}
	}
})

watch(() => route.path, (newPath) => {
	if (newPath.includes('/loginView') || newPath.includes('/signView')) {
		HeaderFooter.value = false
	} else { 
		HeaderFooter.value = true
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

.index {
	width: 1200px;
	min-height: 800px;

	display: flex;
	justify-content: center;
	align-items: center;

	margin-inline: auto;
}
.withHeader {
	border-inline: 1px solid #c6c6c6;
}

</style>
