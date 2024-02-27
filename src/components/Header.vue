<template>
    <div :class="$style.index">
		<div :class="$style.homeBtn">
			<a href="/">게시판 홈</a>
		</div>
		<div 
			v-if="loginStore.loginStatus === true"
			:class="$style.userBox"
		>
			<span 
				:class="$style.name"
				@click="togglePopover"
			>
				{{loginStore.name}}
			</span>
			<UserPopover 
				v-if="isPopoverOpen"
				@closePopover="closePopover"
			/>
		</div>
		<div 
			v-else
			:class="$style.userBox"
			@click="redirectToLogin"
		>
			<span :class="$style.needLogin">로그인이 필요합니다.</span>
		</div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { useLoginStore } from '../stores/counter';
import UserPopover from './UserPopover.vue'

const loginStore = useLoginStore()
const router = useRouter()
const isPopoverOpen = ref(false)



const redirectToLogin = () => { 
	router.push('/loginView')
}

const togglePopover = () => { 
	isPopoverOpen.value = !isPopoverOpen.value
}

const closePopover = () => { 
	isPopoverOpen.value = false
}
</script>

<style lang="scss" module>

a {
	text-decoration: none;
	color: black;

	&:visited {
		text-decoration: none;
		color: black;
	}

}
.index {
    width: 100%;
	height: 52px;

	display: flex;

	text-align: center;
	line-height: 52px;

	border-bottom: 1px solid red;
	margin-bottom: 20px;

	.homeBtn {
		margin-left: 5px;
		margin-right: auto;
	}

	.userBox {
		width: 200px;

		font-size: 20px;
		font-weight: bold;

		margin-left: auto;
		margin-right: 5px;

		.name {

			&:hover {
				cursor: pointer;
			}
		}

		.logout {
			width: 60px;

			font-size: 14px;

			border: 1px solid blue;

			&:hover {
				cursor: pointer;
			}
		}
	}

	

	.needLogin {
		
		&:hover {
			cursor: pointer;
		}
	}
}

</style>