import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignView from '../views/SignView.vue'
import BoardView from '../views/BoardView.vue'
import BoardWrite from '../views/BoardWrite.vue'
import PostView from '../views/PostView.vue'
import MyPageView from '../views/MyPageView.vue'
import axios from 'axios'
import { useLoginStore } from '../stores/counter'

// const loginStore = useLoginStore()

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: { requiresAuth: false },
		},
		{
			path: '/loginView',
			name: 'loginView',
			component: LoginView,
			meta: { requiresAuth: false },
		},
		{
			path: '/SignView',
			name: 'SignView',
			component: SignView,
			meta: { requiresAuth: false },
		},
		{
			path: '/boardView',
			name: 'boardView',
			component: BoardView,
			meta: { requiresAuth: false },
		},
		{
			path: '/boardWrite',
			name: 'boardWrite',
			component: BoardWrite,
			meta: { requiresAuth: true },
		},
		{
			path: '/PostView/:id',
			name: 'PostView',
			component: PostView,
			meta: { requiresAuth: false },
		},
		{
			path: '/MyPageView',
			name: 'MyPageView',
			component: MyPageView,
			meta: { requiresAuth: true },
		},
	]
})


// router.beforeEach(async (to, from, next) => {
// 	const token = localStorage.getItem('token')

//     if (to.matched.some((record) => record.meta.requiresAuth !== false)) {
// 		if (!token) {
// 			alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.")
// 			next('/loginView')
// 		} else { 		
// 			if (token) { 
// 				const response = await axios.get("http://localhost:3000/userValidate", {
// 					headers: {
// 						"authentification": token
// 					},
// 					params: { name: `${ useLoginStore.name }` }
// 				})

// 				if (response.status === 200) {
// 					next()
// 				} else { 
// 					loginStore.logout()
// 					alert("확인되지 않은 사용자입니다. 로그인 페이지로 이동합니다.")
// 					next('loginView')
// 				}
// 			}
// 		}
// 	} else if (to.path === ('/loginView' || '/signView') && token) {
// 		alert("이미 로그인 상태입니다.")
// 	} else {
// 		next()
// 	}
// })

export default router
