<template>
    <div :class="$style.index">
        <div :class="$style.info">
            <div :class="$style.infoBox">
                {{ loginStore.name }}님의 마이페이지 입니다.
                <span 
                    :class="$style.edit"
                    @click="openModal"
                >
                    편집
                </span>
            </div>
            <div 
                v-if="showModal"
                :class="$style.modalOverlay"
            >
                <div :class="$style.modalWindow">
                    <div 
                        :class="$style.close"
                        @click="closeModal"
                    >
                        X
                    </div>
                    <div>
                        이메일: 
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
                    <div 
                        :class="$style.editBtn"
                        @click="update"
                    >
                        수정 완료
                    </div>
                </div>
            </div>
        </div>
        <div>총 게시글 수: {{ totalCount }}</div>
        <div :class="$style.postList">
            <table :class="$style.table">
                <tr>
                    <th :class="$style.id">ID</th>
                    <th :class="$style.board">게시판</th>
                    <th :class="$style.title">제목</th>
                    <th :class="$style.registeredBy">작성자</th>
                    <th :class="$style.registeredDate">작성일자</th>
                    <th :class="$style.active">상태</th>
                </tr>
                <tr v-for="(post, index) in postList"
                    :key="'post_' + index">
                    <td>{{ post.id }}</td>
                    <td>{{ post.board_name }}</td>
                    <td :class="$style.tdTitle">
                        <router-link 
                            :to="{ name: 'PostView' , params: { id: post.id } }"
                        >
                            {{ post.title }}
                        </router-link>
                    </td>
                    <td>{{ post.registered_by }}</td>
                    <td>{{ new Date(post.registered_date * 1000).toLocaleString() }}</td>
                    <td v-if="post.active === 1">미삭제</td>
                    <td v-else>삭제</td>
                </tr>
            </table>
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
const totalCount = ref(0)

const showModal = ref(false)

const openModal = () => { 
    showModal.value = true
}

const closeModal = () => { 
    showModal.value = false
}

onMounted(async () => { 
    await myPost()
})
//내글목록에서는 삭제한글도보이게, 마이페이지 접속 후 내 글 목록은 클릭하면 보이도록
const myPost = async () => { 
    try { 
        const response = await axios.get('/getMyPost', {
            headers: {
				"authentification": token
			},
            params: {
                page: currentPageComponent.value.currentPage,
            },
        });

        if (response.status !== 200) return alert(`내가 쓴 글 목록 로드 시도 중 오류가 발생했습니다: ${response.statusText}`)
        postList.value = response.data.datas
        totalPages.value = response.data.totalPages
        totalCount.value = response.data.totalCount
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

        if (response.status !== 200) return alert(`내 정보 업데이트 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("내 정보가 업데이트 되었습니다.")
        closeModal()
    } catch (error) { 
        alert(`오류가 발생했습니다: ${error.message}, ${error.response.data.message}`)
    }
} 
</script>

<style lang="scss" module>
.index {

    .info {

        .infoBox {
            height: 80px;

            font-size: 20px;
            font-weight: bold;
            text-align: center;
            line-height: 80px;

            margin-block: auto;
        }

        .edit {
            &:hover {
                cursor: pointer;
            }
        }

        .modalOverlay {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;

            background-color: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(1.5px);
            -webkit-backdrop-filter: blur(1.5px);

            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 10px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

            .modalWindow {
                width: 400px;
                height: 300px;

                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                position: relative;
                top: -100px;

                background: rgba( 69, 139, 197, 0.70 );
                backdrop-filter: blur( 13.5px );
                -webkit-backdrop-filter: blur( 13.5px );

                border: 1px solid rgba( 255, 255, 255, 0.18 );
                border-radius: 10px;
                box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );

                padding: 10px;

                .close {
                    width: 20px;
                    height: 20px;

                    text-align: center;
                    line-height: 20px;

                    position: absolute;
                    left: 370px;
                    top: 10px;

                    background-color: white;

                    border: 1px solid #c6c6c6;

                    &:hover {
                        cursor: pointer;
                    }
                }

                .editBtn {
                    width: 80px;
                    height: 30px;

                    text-align: center;
                    line-height: 30px;

                    background-color: white;

                    border: 1px solid #c6c6c6;

                    margin-top: 10px;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
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

        .table {
            width: 1000px;

            border-block: 1px solid #c6c6c6;
            border-collapse: collapse;

            margin-inline: auto;
            margin-block: 10px;

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
                width: 300px;
            }
            .active {
                width: 60px;
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
</style>