<template>
    <div :class="$style.popover">
        <div :class="$style.menu">
            <a href="/myPageView">마이페이지</a>
        </div>
        <div 
            :class="$style.menu"
            @click="logout"
        >
            로그아웃
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useLoginStore } from '../stores/counter';

const loginStore = useLoginStore()
const router = useRouter()

const logout = () => { 
	localStorage.removeItem('token')
	loginStore.logout()
}

const closePopover = () => { 
    emit('closePopover')
}
</script>

<style lang="scss" module>
.popover {
    width: 150px;

    display: table;

    position: absolute;

    background-color: white;

    border: 1px solid #c6c6c6;
    border-collapse: collapse;

    z-index: 0;

    .menu {
        display: block;


        a {
            text-decoration: none;
            color: black;

            &:visited {
                text-decoration: none;
                color: black;
            }
        }

        &:hover {
            background-color: #ccc;
            cursor: pointer;
        }
    }
}
    
</style>