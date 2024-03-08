<template>
    <div :class="$style.index">
        <div :class="$style.titleRow">
            <div :class="$style.titleBox">
                <div :class="$style.boardName">{{ detail.board_name }}</div>
                <div :class="$style.title">{{ detail.title }}</div>
            </div>
            <div
                :class="$style.editBox"
                v-if="loginStore.id === detail.registered_by"
            >
                <router-link 
                    :to="{ name: 'boardWrite', query: { id } }"
                    :class="$style.editPost"
                >
                    수정
                </router-link>
                <div
                    :class="$style.editPost" 
                    @click="deletePost"
                >
                    삭제
                </div>
            </div>
        </div>
        <div :class="$style.infoRow">
            <div :class="$style.registeredBy">작성자: {{ detail.name }}</div>
            <div :class="$style.postInfo">
                <div :class="$style.likeCnt">추천: {{ detail.like_count }}</div>
                <div :class="$style.dislikeCnt">비추천: {{ detail.dislike_count }}</div>
                <div :class="$style.time">
                    작성일: {{ new Date(detail.registered_date * 1000).toLocaleString() }}
                </div>
            </div>
        </div>
        <div :class="$style.content">{{ detail.content }}</div>
        <div :class="$style.btnBox">
            <div 
                :class="$style.likeBtn"
                @click="liked('like')">
                추천<br/>
                {{ detail.like_count }}
            </div>
            <div 
                :class="$style.dislikeBtn"
                @click="liked('dislike')">
                비추천<br/>
                {{ detail.dislike_count }}
            </div>
        </div>
        <div :class="$style.cmtsCnt">
            전체 댓글: {{ totalCommentsCount }}개
        </div>
        <div :class="$style.cmtBox">
            <div v-for="(cmt, index) in comments"
            :key="'cmt_' + index"
            :class="$style.cmt"
            >
                <div :class="$style.cmtRegisteredBy">
                    {{ cmt.registered_by }}
                </div>
                <div 
                    
                    :class="$style.cmtContent">
                    <span v-show="cmtEditId !== cmt.id">{{ cmt.content }}</span>
                    <div 
                        :class="$style.cmtEditBox"
                        v-if="cmtEdit && cmtEditId === cmt.id">
                        <textarea 
                            :class="$style.cmtEditArea"
                            v-model="cmt.content"
                        ></textarea>
                        <div
                            :class="$style.submitCmtBtn"
                            @click="updateCmt(cmt.id, cmt.content)"
                        >
                            완료
                        </div>
                    </div>
                </div>
                <div :class="$style.cmtRight">
                    <div :class="$style.cmtFormattedDate">
                        {{ cmt.formattedDate }}
                        <div>
                            <span
                                :class="$style.cmtDeleteBtn"
                                v-if="loginStore.name === cmt.registered_by"
                                @click="cmtEdit = true, cmtEditId = cmt.id"
                            >
                                수정
                            </span>
                            <span 
                                :class="$style.cmtDeleteBtn"
                                v-if="loginStore.name === cmt.registered_by"
                                @click="deleteCmt(cmt.id)"
                            >
                                삭제
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style.cmtWriteBox">
            <div :class="$style.cmtInfoRow">
                <div :class="$style.cmtWriter">
                        {{ loginStore.name }}
                </div>
                <textarea 
                    :class="$style.cmtArea"
                    v-model="commentContent"
                    @focus="checkLogin" 
                >
                </textarea>
            </div>
            <div :class="$style.cmtBtnRow">
                <div
                    v-if="loginStore.loginStatus"
                    :class="$style.submitCmtBtn"
                    @click="submitCmt">등록</div>
            </div>
            
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "../axios";
import { useLoginStore } from '../stores/counter.js'
import { DateTime } from 'luxon';

const loginStore = useLoginStore()
const route = useRoute();
const router = useRouter();
const token = localStorage.getItem('token')
const id = ref('')

const detail = ref([])
const comments = ref([])
const totalCommentsCount = ref(0)
const cmtEdit = ref(false)
const cmtEditId = ref(0)

const commentContent = ref("")

const getDetail = async () => { 
    const response = await axios.get("/detail", {
        params: {
            id: `${id.value}`
        }
    })

    detail.value = response.data.datas

    if (detail.value.like_count === null) { 
        detail.value.like_count = 0
    }
    if (detail.value.dislike_count === null) { 
        detail.value.dislike_count = 0
    }

    comments.value = response.data.commentsDatas.map((data) => {
        const postDate = DateTime.fromMillis(data.registered_date * 1000)
        const formattedDate = postDate.toFormat('yyyy-MM-dd HH:mm')
        return {
            ...data,
            formattedDate,
        }
    })

    totalCommentsCount.value = response.data.totalCommentsCount
}

onMounted(() => { 
    id.value = route.params.id
    getDetail()
})

const liked = async (status) => {
    if (!loginStore.loginStatus) { 
        alert("로그인된 사용자만 사용할 수 있는 기능입니다.")
        return
    }

    try {
        const response = await axios.post("/liked", {
            postId: id.value,
            userId: loginStore.id,
            likeDislike: status === 'like' ? true : false,
        })
        if (response?.data === 'likeUp') {
            detail.value.like_count++
        } else if (response?.data === 'likeDn') {
            detail.value.like_count--
        } else if (response?.data === 'dislikeUp') {
            detail.value.dislike_count++
        } else if (response?.data === 'dislikeDn') {
            detail.value.dislike_count--
        } else { 
            alert("추천/비추천 값에 문제가 생겼습니다.")
        }
    } catch (err) {
        alert("서버와의 통신 과정에서 문제가 생겼습니다.")
    }
}

const deletePost = async () => { 
    try { 
        const response = await axios.post("/postDelete", {
            id: id.value,
        }, {
            headers: {
                "authentification": token
            }
        })

        if (response.status !== 200) return alert(`글 삭제 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("글이 삭제되었습니다.")
        router.push({ name: 'boardView' })
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const submitCmt = async () => { 
    try { 
        const response = await axios.post("/submitCmt", {
            postId: id.value,
            registeredBy: loginStore.id,
            cmt: commentContent.value,
        }, {
            headers: {
                "authentification": token
            },
        })

        if (response.status !== 200) return alert(`댓글 등록 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("댓글이 등록되었습니다.")
        getDetail()
        commentContent.value = ""
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const deleteCmt = async (cmtId) => { 
    try { 
        const response = await axios.post("/deleteCmt", {
            cmtId: cmtId,
            registeredBy: loginStore.id,
        }, {
            headers: {
                "authentification": token
            }
        })

        if (response.status !== 200) return alert(`댓글 삭제 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("댓글이 삭제되었습니다.")
        getDetail()
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const updateCmt = async (cmtId, editedCmt) => { 
    try { 
        const response = await axios.post("/updateCmt", {
            cmtId: cmtId,
            editedCmt: editedCmt,
            registeredBy: loginStore.id,
        }, {
            headers: {
                "authentification": token
            }
        })

        if (response.status !== 200) return alert(`댓글 수정 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("댓글이 수정되었습니다.")
        cmtEdit.value = false
        cmtEditId.value = 0
        getDetail()
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const checkLogin = () => { 
    if (!loginStore.loginStatus) { 
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.")
        router.push({ name: "loginView"})
    }
}
</script>

<style lang="scss" module>
.index {
    width: 1100px;
    margin-block: 5px;

    .titleRow {
        height: 40px;

        display: flex;
        justify-content: space-between;

        line-height: 40px;

        border-top: 2px solid #c6c6c6;

        margin-top: 10px;
        padding-inline: 5px;

        .titleBox {
            display: flex;
            align-items: center;

            .boardName {
                height: 20px;
                font-size: 14px;
                line-height: 20px;
                border: 1px solid #c6c6c6;
            }

            .title {
                font-weight: bold;
                margin-inline: 5px;
            }
        }

        .editBox {
            display: flex;
            align-items: center;

            .editPost {
                height: 20px;

                font-size: 14px;
                line-height: 20px;

                border: 1px solid #c6c6c6;

                margin-left: 5px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
            
    }

    .infoRow {
        height: 30px;

        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 14px;

        border-block: 1px solid #c6c6c6;

        padding-inline: 5px;

        .postInfo {
            display: flex;

            .likeCnt, .dislikeCnt {
                margin-right: 5px;
            }
        }
    }

    .content {
        min-height: 360px;
        border-top: 1px solid #c6c6c6;
        padding: 10px;
    }

    .btnBox {
        display: flex;
        flex-direction: row;
        justify-content: center;

        .likeBtn, .dislikeBtn {
            width: 80px;
            height: 60px;

            text-align: center;

            display: flex;
            justify-content: center;
            align-items: center;

            border: 1px solid #c6c6c6;

            margin: 5px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .cmtsCnt {
        border-bottom: 2px solid #c6c6c6;
        padding: 5px 10px;
    }

    .cmtBox {
        display: flex;
        flex-direction: column;

        .cmt {
            display: flex;
            justify-content: space-around;
            border-bottom: 1px solid #c6c6c6;
            padding-block: 10px;

            .cmtRegisteredBy {
                flex-basis: 15%;
            }

            .cmtContent {
                flex-basis: 65%;

                .cmtEditBox {
                    display: flex;

                    .cmtEditArea {
                        width: 100%;
                    }

                    .submitCmtBtn {
                        width: 36px;
                        height: 20px;
                        font-size: 13px;
                        border: 1px solid #c6c6c6;
                        margin: 0 10px 10px 5px;

                        text-align: center;

                        &:hover {
                            cursor: pointer;
                        }
                    }
                }
            }

            .cmtFormattedDate {
                flex-basis: 20%;
                text-align: right;
                font-size: 13px;

                .cmtDeleteBtn {
                    width: 32px;

                    border: 1px solid #c6c6c6;
                    text-align: center;
                    font-size: 13px;

                    margin-left: 2px;

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .cmtWriteBox {
        display: flex;
        flex-direction: column;

        .cmtInfoRow {
            display: flex;
            .cmtWriter {
                width: 140px;
                height: 30px;
                flex-basis: 15%;
                border: 1px solid #c6c6c6;
                padding-left: 10px;
                margin: 10px 0px 0px 10px;
            }

            .cmtArea {
                width: 800px;
                min-height: 100px;
                flex-basis: 85%;
                margin: 10px;
            }
        }
        
        .cmtBtnRow {
            display: flex;
            justify-content: right;
            .submitCmtBtn {
                width: 120px;
                border: 1px solid #c6c6c6;
                margin: 0 10px 10px 0;
                padding: 10px;
                text-align: center;

                &:hover {
                    cursor: pointer;
                }
            }
        }

    }

}
</style>