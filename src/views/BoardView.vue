<template>
    <div :class="$style.content">
        <div :class="$style.boardCategory">
            <span 
                v-for="(list, index) in boardList"
                :key="'list_' + index"
                :class="[$style.boardName, getActiveClass(list.board_id)]"
                @click="clickBoardName(list.board_id)"
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
            @movePage="viewPost"
        />
        <div :class="$style.utility">
            <div :class="$style.postNumber">
                게시글 수:
                <select 
                    :class="$style.itemsPerPage"
                    v-model="itemsPerPage" 
                    @change="reloadList()"
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
            <SearchBar 
                ref = "clearSearchBar"
                @searchPost="doSearch"
            />
            <div :class="$style.writeBox">
                <span 
                    :class="[$style.writeBtn, {[$style.hide]: !loginStore.loginStatus}]"
                    @click="router.push('/boardWrite')"
                >
                    글 작성
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
// asyncData 처럼 mounted 전에 데이터를 불러와서 처음에 페이지에 도달했을 때부터 글 목록이 보이게
import { ref, onMounted, onBeforeUnmount,useCssModule } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useLoginStore } from '../stores/counter';
import { getBoardList } from './utils';
import axios from "../axios"
import { DateTime } from 'luxon';
import SearchBar from '../components/SearchBar.vue'
import PagenationBar from '../components/PagenationBar.vue'

const route = useRoute()
const router = useRouter()
const loginStore = useLoginStore()
const $style = useCssModule()

const posts = ref([])
const totalPages = ref(0)
const currentPageComponent = ref(null)

const itemsPerPage = ref(30)
const itemsPerPageList = [30, 40, 50]

const boardList = ref([])
const boardId = ref('free')

const keyword = ref('')
const searchOpt = ref('Opt0')
const clearSearchBar = ref(null)

onMounted(async () => { 
    currentPageComponent.value.currentPage = parseInt(route.query.currentPage) || 0
    boardList.value = await getBoardList()
    viewPost()
    window.addEventListener("popstate", popStateHandler)
})

onBeforeUnmount(() => {
    window.removeEventListener("popstate", popStateHandler)
})

const popStateHandler = (e) => {
    currentPageComponent.value.currentPage = e.state.page
    boardId.value = e.state.boardId
    viewPost(false)
}

const viewPost = async (saveState = true) => {
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
    
    try {
        const response = await axios.get("/boards", {
            params: {
                boardName: `${boardId.value}`,
                page: `${currentPageComponent.value.currentPage}`,
                keyword: `${keyword.value}`,
                searchOpt: `${searchOpt.value}`,
                itemsPerPage: `${itemsPerPage.value}`
            }
        })

        if (response.status !== 200) return alert(`게시글 목록 로드 시도 중 오류가 발생했습니다: ${response.statusText}`)
        totalPages.value = response.data.totalPages
        posts.value = response.data.datas.map((data) => {
            const today = DateTime.now();
            const postDate = DateTime.fromSeconds(data.registered_date);

            const formattedDate = today.year === postDate.year &&
                today.month === postDate.month &&
                today.day === postDate.day
                ? postDate.toLocaleString(DateTime.TIME_24_SIMPLE)
                : postDate.toISODate();

            return {
                ...data,
                formattedDate,
            };
        })
    } catch (error) {
        console.error(error)
        alert(`오류가 발생했습니다: ${error.message}`)
    }
}

const clickBoardName = (clickedBoardId) => { 
    boardId.value = clickedBoardId
    keyword.value = ''
    resetCurrentPage()
    propClearSearchBar()
    viewPost()
}

const reloadList = () => { 
    currentPageComponent.value.currentPage = 0
    viewPost()
}

const getActiveClass = (board) => { 
    return board === boardId.value ? $style.active : ''
}

const doSearch = (searchKeyword, opt) => {
    currentPageComponent.value.resetPage()
    keyword.value = searchKeyword
    searchOpt.value = opt
    viewPost()
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
    min-height: 800px;
    margin-block: 5px;

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
        align-items: center;
        margin-bottom: -1px;

        .boardName {
            width: 100px;
            height: 40px;

            color: grey;
            font-size: 18px;
            text-align: center;
            line-height: 40px;

            z-index: 1;
            position: relative;

            &.active {
                color: black;
                font-weight: bold;
                border: 1px solid #c6c6c6;
                border-bottom: 1px solid white;
            }
        }
    }
    .postTable{
        width: 1100px;

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

    .utility {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .postNumber {
            width: 120px;

            .itemsPerPage {
                border: 1px solid #c6c6c6;
            }
        }

        .writeBox {
            width: 120px;
        }

        .writeBtn {
            width: 60px;
            float: right;
            text-align: center;
            border: 1px solid #c6c6c6;

            &:hover {
                cursor: pointer;
            }
        }

        .hide {
            display: none;
        }
    }
}
</style>