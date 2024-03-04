<template>
    <div :class="$style.index">
        <div :class="$style.contents">
            내용이 표시될 영역
            게시판의 설명과 접속을 위한 메인 페이지
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" module>
.index {
    width: 100%;
    min-height: 800px;
    margin-inline: auto;

    .contents {
        width: 100%;

        display: flex;
        justify-content: center;

        text-align: center;

        margin-inline: auto;
    }
}
</style>