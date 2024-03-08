import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', () => {
	const loginStatus = ref(false)
	const adminStatus = ref(false)
	const id = ref("")
	const name = ref("")
	const email = ref("")
	const nickname = ref("")

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

export const searchOptList = [
    {
        code: 'Opt0',
        value: '제목'
    },
    {
        code: 'Opt1',
        value: '제목+내용'
    },
    {
        code: 'Opt2',
        value: '작성자'
    },
    // {
    //     code: 'Opt3',
    //     value: '댓글'
    // },
]