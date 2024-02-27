<template>
    <Header />
    <div :class="$style.content">
        <div :class="$style.boardCategory">
            <span 
                v-for="(list, index) in boardList"
                :key="'list_' + index"
                :class="$style.boardName"
                @click="() => { 
                    boardId = list.board_id 
                    keyword = ''
                    resetCurrentPage()
                    pushWithQuery()
                    propClearSearchBar()
                }"
            >
                {{ list.board_name }}
            </span>
        </div>
        <table :class="$style.postTable">
            <tr>
                <th :class="$style.id">ID</th>
                <th :class="$style.board">게시판</th>
                <th :class="$style.title">제목</th>
                <th :class="$style.registeredBy">작성자</th>
                <th :class="$style.registeredDate">작성일자</th>
            </tr>
            <tr v-for="(data, index) in posts"
                :key="'data_' + index">
                <td>{{ data.id }}</td>
                <td>{{ data.board_name }}</td>
                <td :class="$style.tdTitle">
                    <router-link :to="{ name: 'PostView' , params: { id: data.id } }">
                        {{ data.title }}
                    </router-link>
                </td>
                <td>{{ data.registered_by }}</td>
                <td>{{ data.formattedDate }}</td>
            </tr>
        </table>
    <PagenationBar 
        ref = "currentPageComponent"
        :totalPages="totalPages"
        @movePage="pushWithQuery"
    />
    <SearchBar 
        ref = "clearSearchBar"
        @searchPost="doSearch"
    />

    <select 
        :class="$style.itemsPerPage"
        v-model="itemsPerPage" 
        @change="viewPost"
    >
            <option
                v-for="(number, index) in itemsPerPageList" 
                :key="'list_' + index"
                :value=number
            >
                {{ number }}
            </option>
        </select>
    </div>

</template>

<script setup>

// asyncData 처럼 mounted 전에 데이터를 불러와서 처음에 페이지에 도달했을 때부터 글 목록이 보이게
import { ref, onMounted, onBeforeUnmount, } from 'vue'
import { RouterLink } from 'vue-router'
import axios from "../axios"
import { getBoardList } from './utils';
import SearchBar from '../components/SearchBar.vue'
import PagenationBar from '../components/PagenationBar.vue'
import { DateTime } from 'luxon';
import { useRoute } from 'vue-router' // useRouter, 
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const route = useRoute();
// const router = useRouter()

function pushWithQuery() { 

    viewPost()
    // router.push({
    //     name: 'boardView',
    //     query: {
    //         boardName: boardId.value,
    //         currentPage: parseInt(currentPageComponent.value.currentPage),
    //         searchKeyword: keyword.value,
    //     }
    // })
}

const posts = ref([])
const totalPages = ref(0)
const currentPageComponent = ref(null)

const itemsPerPage = ref(20)
const itemsPerPageList = [20, 30, 50]

const boardList = ref([])
const boardId = ref('free')

const keyword = ref('')
const searchOpt = ref('제목')
const clearSearchBar = ref(null)

// const queryToData = () => { 
//     boardId.value = route.query.boardName || "free"
//     // currentPageComponent.value.currentPage = parseInt(route.query.currentPage) || 0
//     keyword.value = route.query.searchKeyword || ''
// }

onMounted(async () => { 
    currentPageComponent.value.currentPage = parseInt(route.query.currentPage) || 0
    boardList.value = await getBoardList()
    viewPost()

    window.addEventListener("popstate", popStateHandler)
    // window.addEventListener("click", (e) => {
    //     console.log(e)  
    // })
})

onBeforeUnmount(() => {
    window.removeEventListener("popstate", popStateHandler)
})

const popStateHandler = (e) => {
    console.log(e)
    currentPageComponent.value.currentPage = e.state.page
    boardId.value = e.state.boardId
    viewPost(false)
}

const viewPost = async (saveState = true) => {
    // queryToData()
    const response = await axios.get("/boards", {
        params: {
            board: `${boardId.value}`,
            page: `${currentPageComponent.value.currentPage}`,
            keyword: `${keyword.value}`,
            searchOpt: `${searchOpt.value}`,
            itemsPerPage: `${itemsPerPage.value}`
        }
    })

    if (saveState) {
        let url = "boardView?currentPage=" + currentPageComponent.value.currentPage + "&board=" + boardId.value

        if (keyword.value !== '') { 
            url += "&search=" + keyword.value
        }

        window.history.pushState({
            page: currentPageComponent.value.currentPage,
            boardId: boardId.value,
            search: keyword.value,
        }, "", url)
    }

    totalPages.value = response.data.totalPages
    posts.value = response.data.datas.map((data) => {
        const today = DateTime.now();
        const postDate = DateTime.fromSeconds(data.registered_date);

        const formattedDate = today.year === postDate.year &&
        today.month === postDate.month &&
        today.day === postDate.day
        ? postDate.toLocaleString(DateTime.TIME_24_SIMPLE)
        : postDate.toISODate();
//이 아랫부분 나중에 다시 공부하기
        return {
            ...data,
            formattedDate,
        };
    });
}

// watch(() => route.params, async () => {
//     viewPost()
// });


const doSearch = (searchKeyword, opt) => {
    currentPageComponent.value.resetPage()
    keyword.value = searchKeyword
    searchOpt.value = opt
    pushWithQuery()
}

const propClearSearchBar = () => { 
    clearSearchBar.value.clearSearchBar()
}

const resetCurrentPage = () => { 
    currentPageComponent.value.resetPage()
}
</script>

<style lang="scss" module>
.content {
    width: 1024px;
    margin: 0 auto;
    a {
        text-decoration: none;
        color: black;

        &:visited {
            color: purple;
        }
    }
    .boardCategory {
        display: flex;
        justify-content: space-evenly;

        .boardName {
            border: 1px solid blue;
        }
    }
    .postTable{
        width: 800px;
        margin: 0 auto;
        border: 1px solid green;
        border-collapse: collapse;

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
            border: 1px solid red;
            text-align: center;
        }

        .tdTitle {
            text-align: left;
            padding-left: 5px;
        }
    }
}
</style>