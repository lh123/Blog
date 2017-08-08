<template>
    <div class="page-nav">
        <span v-if="havePre">
            <a href="javascript:;" @click="$emit('onPreClick')">← {{preWord}}</a>
        </span>
        <span v-if="haveNext">
            <a href="javascript:;" @click="$emit('onNextClick')">{{nextWord}} →</a>
        </span>
    </div>
</template>

<script>
export default {
    name: 'page-nav',
    props: {
        havePre: {
            type: Boolean,
            required:true
        },
        haveNext: {
            type: Boolean,
            required:true
        },
        preWord: {
            type: String,
            default:"上一页"
        },
        nextWord: {
            type: String,
            default:"下一页"
        }
    }
}
</script>

<style>
.page-nav {
    margin-top: 2em;
    text-align: center;
}

.page-nav>span{
    margin: 10px;
}
</style>
