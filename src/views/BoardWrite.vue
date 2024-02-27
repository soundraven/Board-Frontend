<template>
    <div :class="$style.index">
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
        <select v-model="boardName" :class="$style.boardSelect">
            <option
                v-for="(list, index) in boardList" 
                :key="'list_' + index"
                :value=list.id
            >
                {{ list.board_name }}
            </option>
        </select>
        <div :class="$style.titleRow">
            <div :class="$style.titleBox">
                <!-- <div :class="$style.boardName">{{ detail.board_name }}</div> -->
                <input :class="$style.title"
                    type="text" 
                    v-model="title" 
                    placeholder="제목"
                >
            </div>
        </div>
        <div :class="$style.infoRow">
            <input 
                :class="$style.registeredBy"
                type="text" 
                v-model="writer" 
                placeholder="작성자"
            >
            <!-- <div>{{ detail.id }}</div> -->
        </div>
        <textarea 
            :class="$style.content"
            v-model="content" 
            placeholder="내용">
        </textarea>
    </div>
        
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "../axios"
import { getBoardList } from './utils'

const route = useRoute();
const router = useRouter();

const boardName = ref("")
const title = ref("")
const content = ref("")
const writer = ref("")

const boardList = ref([])

const edit = ref(false)

onMounted(async () => { 
    boardList.value = await getBoardList()
//로그인한 사람과 수정하려는 사람이 동일한지 체크 필요
    if (route.query.id !== undefined && route.query.id !== "") { 
        edit.value = true
        const response = await axios.get("/detail", {
            params: { id: route.query.id }
        })

        const detail = response.data.datas

        boardName.value = detail.board_id
        title.value = detail.title
        content.value = detail.content
        writer.value = detail.registered_by
    }
})

const submit = async () => {
    try {
        const response = await axios.post("/post", {
            board_name: boardName.value,
            title: title.value,
            content: content.value,
            registered_by: writer.value,
        })

        if (response.status === 200) {
            alert("글이 등록되었습니다.");
        } else {
            alert(`오류가 발생했습니다: ${response.statusText}`);
        }
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const update = async () => { 
    try { 
        const response = await axios.post("/postUpdate", {
            board_name: boardName.value,
            title: title.value,
            content: content.value,
            // registered_by: writer.value,
            id: route.query.id,
        })

        if (response.status === 200) {
            alert("글이 수정되었습니다.");
            router.push({ name: 'PostView', params: { id: route.query.id } })
        } else {
            alert(`try문에서의 오류: ${response.statusText}`);
        }
    } catch (error) { 
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const deletePost = async () => { 
    try { 
        const response = await axios.post("/postDelete", {
            id: route.query.id,
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
</script>

<style lang="scss" module>


.index {
    width: 1000px;
    border: 1px solid black;
    margin-inline: auto;

    .boardSelect {
        width: 100px;
    }

    .titleRow {
        display: flex;
        justify-content: space-between;
        border: 1px solid green;
        padding: 5px 10px;
        .titleBox {
            display: flex;

            .title {
                border: 1px solid red;
                margin-inline: 5px;
            }
        }
    }
    .infoRow {
        display: flex;
        justify-content: space-between;
        padding: 5px 10px;
        border: 1px solid orange;
    }

    .content {
        width: 100%;
        padding: 10px;
        min-height: 360px;
        border: 1px solid blue;
    }
}
</style>