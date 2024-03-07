<template>
    <div :class="$style.index">
        <select v-model="boardName" :class="$style.boardSelect">
            <option
                v-for="(list, index) in boardList" 
                :key="'list_' + index"
                :value=list.id
            >
                {{ list.board_name }}
            </option>
        </select>
        <input :class="$style.title"
            type="text" 
            v-model="title" 
            placeholder="제목"
        >
        <textarea 
            :class="$style.content"
            v-model="content" 
            placeholder="내용">
        </textarea>
        <div 
            v-if="!edit"
            :class="$style.submit" 
            @click="submit"
        >
            등록
        </div>
        <div 
            v-else
            :class="$style.submit" 
            @click="update"
        >
            수정
        </div>
    </div>
    
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useLoginStore } from '../stores/counter';
import { getBoardList } from './utils'
import axios from "../axios"

const route = useRoute();
const router = useRouter();
const token = localStorage.getItem('token')
const loginStore = useLoginStore()

const boardName = ref("1")
const title = ref("")
const content = ref("")
const registeredBy = ref("")

const boardList = ref([])

const edit = ref(false)

onMounted( async () => { 
    boardList.value = await getBoardList()
    if (route.query.id) {
        edit.value = true

        const response = await axios.get("/detail", {
            params: { id: route.query.id }
        })
        const detail = response.data.datas

        if (detail.registered_by !== loginStore.id) {
            return
        }

        boardName.value = detail.board_id
        title.value = detail.title
        content.value = detail.content
        registeredBy.value = detail.registered_by
    } else { 
        registeredBy.value = loginStore.id
    }
})

const submit = async () => {
    try {
        if (!loginStore.loginStatus) {
            alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.")
            router.push('/loginView')
            return
        }
        const response = await axios.post("/post", {
            board_name: boardName.value,
            title: title.value,
            content: content.value,
            registered_by: registeredBy.value,
        }, {
            headers: {
                "authentification": token
            }
        })

        if (response.status !== 200) return alert(`글 작성 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("글이 등록되었습니다.");
        //추후 개선점: 자기가 작성한 게시판으로 이동하도록
        router.push('/boardView')
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const update = async () => { 
    try {
        if (!loginStore.loginStatus) {
            alert("로그인 상태가 아닙니다. 로그인 페이지로 이동합니다.")
            router.push('/loginView')
            return
        }
        const response = await axios.post("/postUpdate", {
            board_name: boardName.value,
            title: title.value,
            content: content.value,
            registered_by: registeredBy.value,
            id: route.query.id,
        }, {
            headers: {
                "authentification": token
            }
        })

        if (response.status !== 200) return alert(`글 수정 시도 중 오류가 발생했습니다: ${response.statusText}`)
        alert("글이 수정되었습니다.");
        router.push({ name: 'PostView', params: { id: route.query.id } })
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}
</script>

<style lang="scss" module>
.index {
    width: 1100px;
    min-height: 700px;
    border-block: 2px solid #c6c6c6;


    .submit {
        width: 40px;
    }

    .boardSelect {
        width: 100%;
        height: 30px;

        border: 1px solid #c6c6c6;
        border-radius: 2px;
        
        margin-top: 10px;
        padding: 5px;

        &:focus {
            border: 2px solid black;
        }
        &:select {
            background-color: blue;
        }
    }

    .title {
        width: 100%;
        height: 30px;

        font-weight: bold;

        margin-top: 10px;
        padding-left: 5px;

        border: 1px solid #c6c6c6;
        border-radius: 2px;

        &:focus {
            border: 2px solid black;
        }
    }

    .content {
        width: 100%;
        min-height: 600px;

        border: 1px solid #c6c6c6;
        border-radius: 2px;

        padding: 5px;
        margin-top: 10px;
    }

    .submit {
        width: 40px;
        height: 23px;

        font-size: 16px;
        text-align: center;
        line-height: 23px;

        border: 1px solid #c6c6c6;

        margin-inline: auto 5px;
        margin-block: 10px;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>