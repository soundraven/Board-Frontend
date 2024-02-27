import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', () => {
	const loginStatus = ref(false)
	const adminStatus = ref(false)
	const id = ref("")
	const name = ref("")
	const email = ref("")
	const nickname = ref("")
//스토어에 토큰값 넣어놓기
	function login(userInfo) { 
		loginStatus.value = true
		id.value = userInfo.id
		name.value = userInfo.name
		email.value = userInfo.email
		nickname.value = userInfo.nickname
		if (userInfo.permission === 3) { 
			adminStatus.value = true
		}
	}

	function logout() { 
		loginStatus.value = false
		id.value = ""
		name.value = ""
		email.value = ""
		nickname.value = ""
		adminStatus.value = false
	}

	return { loginStatus, adminStatus, login, logout, id, name, email, nickname }
})


// export const useCounterStore = defineStore('counter', () => {
// 	const count = ref(0)
// 	const doubleCount = computed(() => count.value * 2)
// 	function increment() {
// 		count.value++
// 	}

// 	return { count, doubleCount, increment }
// })