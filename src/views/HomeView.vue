<template>
    <Header />
    <div :class="$style.index">
        <div :class="$style.contents">
            내용이 표시될 영역<br><br><br>
            게시판의 설명과 접속을 위한 메인 페이지
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
</script>

<style lang="scss" module>
.index {
    width: 1000px;
    margin: 0 auto;

    .contents {
        width: 800px;
        height: 400px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        text-align: center;
    }
}
</style>