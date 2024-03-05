<template>
    <div :class="$style.index">
        <div :class="$style.info">
            <div>계정 정보</div>
                <div>로그인 아이디: {{ loginStore.name }}</div>
                <div>이메일: 
                    <input 
                        v-model="loginStore.email"
                        type="text"
                        placeholder="이메일을 입력해주세요."
                    >
                </div>
                <div>닉네임: 
                    <input 
                        v-model="loginStore.nickname"
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                    >
                </div>
                <button @click="update">수정 완료</button>
        </div>
        <div :class="$style.postList">
            <table :class="$style.table">
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
            <PagenationBar 
                ref = "currentPageComponent"
                :totalPages="totalPages"
                @movePage="myPost()"
                />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router';
import { useLoginStore } from '../stores/counter.js'
import axios from '../axios';
import PagenationBar from '../components/PagenationBar.vue'

const loginStore = useLoginStore()
const token = localStorage.getItem('token')

const currentPageComponent = ref(null)
const postList = ref([])
const totalPages = ref(0)

onMounted(async () => { 
    await myPost()
})
//내글목록에서는 삭제한글도보이게, 마이페이지 접속 후 내 글 목록은 클릭하면 보이도록
const myPost = async ({ currentPage = 0 } = {}) => { 
    try { 
        const response = await axios.get('/getMyPost', {
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
        const response = await axios.post("/updateUserInfo", {
            name: loginStore.name,
            email: loginStore.email,
            nickname: loginStore.nickname,
        }, {
            headers: {
                "authentification": token
            },
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
.index {

    .info {
        width: 100%;
        height: 250px;
    }

    .postList {
        width: 1100px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        

        border-top: 2px solid #c6c6c6;
        margin-block: 10px;
        padding-block: 10px;
        padding-inline: 5px;

        .table{
            width: 1000px;

            border-block: 1px solid #c6c6c6;
            border-collapse: collapse;

            margin-inline: auto;

            position: relative;
            z-index: 0;

            th {
                text-align: center;
            }

            .id {
                width: 80px;
            }
            .board {
                width: 80px;
            }
            .title {
                width: 400px;
            }
            .registeredBy {
                width: 80px;
            }
            .registeredDate {
                width: 120px;
            }

            td {
                border-top: 1px solid #c6c6c6;
                text-align: center;
            }

            .tdTitle {
                text-align: left;
                padding-left: 5px;
            }
        }
    }
}
.pagenation {

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