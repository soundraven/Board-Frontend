<template>
    <div :class="$style.index">
		<router-link to="/">홈</router-link>
		<router-link to="/loginView">로그인</router-link>
		<router-link to="/boardView">게시판</router-link>
		<router-link to="/boardWrite">글작성</router-link>
		<router-link to="/MyPageView">마이페이지</router-link>
	</div>
</template>


<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style lang="scss" module>
.index { 
	width: 100%;
	height: 52px;

	text-align: center;
	line-height: 52px;

	border-top: 1px solid #c6c6c6;

	a {
		text-decoration: none;
		color: #888;
		margin: 0px 20px;
	}
}
</style>
