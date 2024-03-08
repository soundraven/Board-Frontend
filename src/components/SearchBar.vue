<template>
    <div :class="$style.container">
        <select v-model="searchOpt" :class="$style.searchOpt">
            <option
                v-for="(list, index) in searchOptList" 
                :key="'list_' + index"
                :value="list.code"
            >
                {{ list.value }}
            </option>
        </select>

        <input 
            :class="$style.inputArea"
            v-model="keyword"
            type="text"
        />
        <div 
            :class="$style.searchBtn"
            @click="searchPost"
        >
            검색
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchOptList } from '@/stores/counter'

const keyword = ref('')
const searchOpt = ref('Opt0')

const searchPost = () => {
    emit('searchPost', keyword.value, searchOpt.value)
}

const clearSearchBar = () => { 
    keyword.value = ''
}

defineExpose({ clearSearchBar })

const emit = defineEmits(['searchPost'])
</script>

<style lang="scss" module>
.container {
    display: flex;
    justify-content: center;

    .searchOpt {
        border: 1px solid #c6c6c6;
    }

    .inputArea {
        border: 1px solid #c6c6c6;
    }

    .searchBtn {
        border: 1px solid #c6c6c6;
        margin-left: 5px;
    }
}
</style>

