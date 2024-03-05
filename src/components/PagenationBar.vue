<template>
    <div :class="$style.pagenation">
        <template v-if="currentPage -4 > 0">
            <a :class="$style.pageBtn" @click="currentPage = 0, movePage()">
                &lt;&lt;
            </a>
            <a :class="$style.pageBtn" @click="movePageGroup('prev'), movePage()">
                &lt;
            </a>
        </template>
        <a v-for="(page, index) in pageGroup" 
            :key="'page_' + page"
            :class="[ $style.pageBtn, getActiveClass(page - 1) ]"
            @click="currentPage = page - 1, movePage()"
        >
            {{ page }}
        </a>
        <template v-if="currentPage + 5 < totalPages">
            <a :class="$style.pageBtn" @click="movePageGroup('next'), movePage()">
                >
            </a>
            <a :class="$style.pageBtn" @click="currentPage = totalPages - 1, movePage()">
                >>
            </a>
        </template>
    </div>
</template>

<script setup>
import { ref, useCssModule, computed } from 'vue'

const props = defineProps(['totalPages'])
const emits = defineEmits(['movePage']);

const currentPage = ref(0)

const pageGroup = computed(() => { 
    let startPage, endPage
    if (props.totalPages < 10) {
        startPage = 1;
        endPage = props.totalPages;
    } else if (currentPage.value < 5) {
        startPage = 1;
        endPage = Math.min(10, props.totalPages);
    } else if (props.totalPages - currentPage.value >= 7) {
        startPage = Math.max(1, currentPage.value - 3);
        endPage = Math.min(startPage + 9, props.totalPages);
    } else if (props.totalPages - currentPage.value < 7) { 
        startPage = Math.max(1, props.totalPages - 9);
        endPage = Math.min(startPage + 9, props.totalPages);
    }

    return Array.from(Array(endPage - startPage + 1), (_, i) => startPage + i)
})

const movePageGroup = (direction) => { 
    if (direction === "next") {
        currentPage.value += 5
    } else if (direction === "prev") {
        currentPage.value -= 5
    }
}

const resetPage = () => { 
    currentPage.value = 0
}

const movePage = () => { 
    emits('movePage')
}

const $style = useCssModule()
const getActiveClass = (index) => { 
    return index === currentPage.value ? $style.active : ''
}

defineExpose({ currentPage, resetPage })
</script>

<style lang="scss" module>
.pagenation {
    display: table;
    border-collapse: collapse;
    margin-inline: auto;
    margin-top: 10px;

    .pageBtn {
        display: table-cell;

        width: 25px;
        height: 25px;

        text-align: center;
        vertical-align: middle;

        border: 1px solid #c6c6c6;

        &:hover {
            cursor: pointer;
        }

        &.active {
            background-color: darkgray;
        }
    }
}
</style>



