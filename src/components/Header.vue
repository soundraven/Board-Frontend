<template>
    <div :class="$style.index">
		<div 
			:class="$style.homeBtn"
			@click=" router.push('/')"
		>
			Home
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
	align-items: center;

	border-bottom: 1px solid #c6c6c6;

	.homeBtn {
		width: 60px;
		height: 30px;

		display: flex;
		justify-content: center;

		border: 1px solid #c6c6c6;

		text-align: center;

		margin-left: 5px;
		margin-right: auto;
		margin-block: auto;

		&:hover {
			cursor: pointer;
		}
	}

	.userBox {
		width: 200px;
		height: 40px;

		font-size: 20px;
		font-weight: bold;
		line-height: 40px;

		border: 1px solid #c6c6c6;

		margin-left: auto;
		margin-right: 5px;
		margin-block: auto;

		.name {
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