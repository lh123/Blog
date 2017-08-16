<template>
    <div class="content">
        <nav-side></nav-side>
        <div class="post-list-container">
            <h3 class="page-title">
                <i class="fa fa-book"></i> 文章列表
                <i class="fa fa-plus post-add" @click="createPost"></i>
            </h3>
            <post-list :postList="postList" :currentPostId="currentPostId" @updateId="id => currentPostId = id"></post-list>
        </div>
        <div class="post-editor">
            <transition name="fade" mode="out-in">
                <post-editor v-if="currentPostId > 0" :id="currentPostId" @postSave="fetchData" @deletePost="fetchData" @publishPost="fetchData"></post-editor>
            </transition>
        </div>
    </div>
</template>
<script>
import NavSide from "./common/NavSide.vue";
import PostList from "./common/PostList.vue";
import PostEditor from "./common/PostEditor.vue";
import DraftApi from "../api/draft";
export default {
    name: "posts",
    data: function () {
        return {
            postList: [],
            currentPostId: -1
        }
    },
    methods: {
        fetchData: function () {
            DraftApi.getDraftList()
                .then(data => {
                    this.postList = data;
                })
                .catch(err => console.log(err));
        },
        createPost: function () {
            DraftApi.createDraft("新文章")
                .then(id => {
                    this.currentPostId = id;
                    this.fetchData();
                })
                .catch(err => {
                    alert(err);
                });
        }
    },
    created: function () {
        this.fetchData();
    },
    components: {
        NavSide,
        PostList,
        PostEditor
    }
}
</script>

<style>
.content {
    position: relative;
    height: 100%;
    width: calc(100% - 70px);
    left: 70px;
    top: 0;
}

.post-list-container {
    position: relative;
    width: 300px;
    border-right: 1px solid #ececec;
    box-sizing: border-box;
    height: 100%;
}

.post-add {
    position: absolute;
    right: 0px;
    display: inline-block;
    margin-top: 4px;
    cursor: pointer;
}

.page-title {
    color: #7f8c8d;
    padding: 16px 16px 16px 25px;
    font-weight: 400;
}

.post-editor {
    position: absolute;
    top: 0;
    left: 300px;
    width: calc(100% - 300px);
    height: 100%;
}

.post-list {
    height: calc(100% - 57px);
}
</style>
