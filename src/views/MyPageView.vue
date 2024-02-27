<template>
    <h1>마이페이지</h1>
    <div>
        <h1>계정 정보</h1>
        <div>로그인 아이디: {{ loginStore.name }}</div>
        <div>이메일: 
            <input 
                v-model="loginStore.email"
                type="text"
                placeholder="이메일을 입력해주세요.">
        </div>
    </div>
    <br>
    <br>
    <div>
        <h1>프로필 정보</h1>
        <div>닉네임: 
            <input 
                v-model="loginStore.nickname"
                type="text"
                placeholder="닉네임을 입력해주세요.">
        </div>
    </div>
    <br>
    <br>
    <button @click="update">수정 완료</button>

    <div>
        <h1>내 글 목록</h1>
        <table>
            <tr>
                <td>ID</td>
                <td>게시판</td>
                <td>제목</td>
                <td>작성자</td>
                <td>작성일자</td>
            </tr>
            <tr v-for="(post, index) in postList"
                :key="'post_' + index">
                <td>{{ post.id }}</td>
                <td>{{ post.board_name }}</td>
                <td>
                    <router-link :to="{ name: 'PostView' , params: { id: post.id } }">
                    {{ post.title }}
                    </router-link>
                </td>
                <td>{{ post.registered_by }}</td>
                <td>{{ new Date(post.registered_date * 1000).toLocaleString() }}</td>
            </tr>
        </table>

        <div :class="$style.pagenation">
            <a v-for="(page, index) in totalPages"
                :key="'page_' + index"
                :class="[$style.pageBtn, { active: page === currentPage }]"
                @click.prevent="myPost({ currentPage: page - 1})"
            >
                {{ page }}
            </a>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useLoginStore } from '../stores/counter.js'

const loginStore = useLoginStore()
const token = localStorage.getItem('token')

const postList = ref([])
const totalPages = ref(0)

onMounted(async () => { 
    await myPost()
})
//내글목록에서는 삭제한글도보이게, 마이페이지 접속 후 내 글 목록은 클릭하면 보이도록
const myPost = async ({ currentPage = 0 } = {}) => { 
    try { 
        const response = await axios.get("http://localhost:3000/getMyPost", {
            headers: {
				"authentification": token
			},
            params: {
                name: loginStore.name,
                page: currentPage
            },
        });
        if (response.status === 200) { 
            postList.value = response.data.datas
            totalPages.value = response.data.totalPages
        }
    } catch (error) { 
        alert(`오류가 발생했습니다: ${error.message}, ${error.response.data.message}`)
    }
}

const update = async () => { 
    try {
        const response = await axios.post("http://localhost:3000/updateUserInfo", {
            name: loginStore.name,
            email: loginStore.email,
            nickname: loginStore.nickname,
        });
        if (response.status === 200) { 
            alert(`${response.data.message}`)
        }
    } catch (error) { 
        alert(`오류가 발생했습니다: ${error.message}, ${error.response.data.message}`)
    }
} 
</script>

<style lang="scss" module>
.pagenation {
        display: flex;
        justify-content: center;

        .pageBtn{
            width: 25px;
            height: 20px;

            text-align: center;

            border: 1px solid red;
            
            margin: 0px 5px;

            &:hover {
                cursor: pointer;
            }
        }
    }
</style>