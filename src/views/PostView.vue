<template>
    <div :class="$style.index">
        <div :class="$style.titleRow">
            <div :class="$style.titleBox">
                <div :class="$style.boardName">{{ detail.board_name }}</div>
                <div :class="$style.title">{{ detail.title }}</div>
            </div>
            <div
                :class="$style.editBox"
                v-if="loginStore.name === detail.registered_by"
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
            <div :class="$style.registeredBy">작성자: {{ detail.registered_by }}</div>
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
                        v-if="cmtEdit === true && cmtEditId === cmt.id">
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
                    <span :class="$style.cmtDelete">

                    </span>
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
            const postDate = DateTime.fromMillis(data.registered_date * 1000);
            const formattedDate = postDate.toFormat('yyyy-MM-dd HH:mm')
            return {
                ...data,
                formattedDate,
            };
        });

    totalCommentsCount.value = response.data.totalCommentsCount
}

onMounted(() => { 
    id.value = route.params.id;
    getDetail()
})

const liked = async (status) => {
    if (loginStore.loginStatus !== true) { 
        alert("로그인된 사용자만 사용할 수 있는 기능입니다.")
        return
    }

    try {
        const response = await axios.post("/liked", {
            postId: id.value,
            userId: loginStore.id,
            likeDislike: status === 'like' ? true : false,
        })
//likeup likedn 이런걸 굳이 문자로 하지 말고 타입으로 나눠서 관리?
        if (response?.data === 'likeUp') {
            detail.value.like_count++
            // alert("추천되었습니다.")
        } else if (response?.data === 'likeDn') {
            detail.value.like_count--
            // alert("추천이 취소되었습니다.")
        } else if (response?.data === 'dislikeUp') {
            detail.value.dislike_count++
            // alert("비추천되었습니다.")
        } else if (response?.data === 'dislikeDn') {
            detail.value.dislike_count--
            // alert("비추천이 취소되었습니다.")
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
        })

        if (response.status === 200) {
            alert("글이 삭제되었습니다.");
            router.push({ name: 'boardView' })
        } else {
            alert(`try문에서의 오류: ${response.statusText}`);
        }
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
        })

        if (response.status === 200) { 
            alert("댓글이 등록되었습니다")
        } else {
            alert(`댓글 등록 과정에서 오류가 발생했습니다: ${response.statusText}`);
        }
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }

    getDetail()
    commentContent.value = ""
}

const deleteCmt = async (cmtId) => { 
    try { 
        const response = await axios.post("/deleteCmt", {
            cmtId: cmtId,
        })

        if (response.status === 200) {
            alert("댓글이 삭제되었습니다.");
            getDetail()
        } else {
            alert(`try문에서의 오류: ${response.statusText}`);
        }
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const updateCmt = async (cmtId, editedCmt) => { 
    try { 
        const response = await axios.post("/updateCmt", {
            cmtId: cmtId,
            editedCmt: editedCmt
        })

        if (response.status === 200) {
            alert("댓글이 수정되었습니다.");
            cmtEdit.value = false
            cmtEditId.value = 0
            getDetail()
        } else {
            alert(`try문에서의 오류: ${response.statusText}`);
        }
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
    width: 1000px;
    border: 1px solid black;
    margin-inline: auto;
    // display: flex;
    .titleRow {
        display: flex;
        justify-content: space-between;
        border: 1px solid green;
        padding: 5px 10px;
        .titleBox {
            display: flex;

            .boardName {
                border: 1px solid blue;
            }

            .title {
                border: 1px solid red;
                margin-inline: 5px;
            }
        }

        .editBox {
            display: flex;

            .editPost {
                border: 1px solid blue;
                margin-left: 5px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
            
    }
    .infoRow {
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
        border: 1px solid orange;
        
        .postInfo {
            display: flex;

            .likeCnt, .dislikeCnt {
                margin-right: 5px;
            }
        }
    }

    .content {
        padding: 10px;
        min-height: 360px;
        border: 1px solid blue;
    }

    .btnBox {
        display: flex;
        flex-direction: row;
        justify-content: center;
        .likeBtn, .dislikeBtn {
            width: 80px;
            height: 60px;

            border: 1px solid red;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            margin: 5px;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .cmtsCnt {
        border-bottom: 2px solid blue;
        padding: 5px 10px;
    }
    
    .cmtBox {
        display: flex;
        flex-direction: column;

        .cmt {
            display: flex;
            justify-content: space-around;
            padding: 10px;
            border-bottom: 1px solid grey;

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
                border: 1px solid red;
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

                    border: 1px solid red;
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
                border: 1px solid green;
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
                border: 1px solid red;
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