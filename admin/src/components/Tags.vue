<template>
    <div class="content">
        <nav-side></nav-side>
        <div class="tag-list-container">
            <h3 class="page-title">
                <i class="fa fa-tags"></i> 根据标签搜索文章
            </h3>
            <div class="active-tag-container fix" v-if="tagActive === null">
                请选择一个标签
            </div>
            <div class="active-tag-container fix" v-if="tagActive !== null">
                <span class="tag active" v-show="!isTagEdit">{{tagActive.name}}</span>
                <div class="tag-tools">
                    <i class="fa fa-remove tag-tool" @click="deleteTag"></i>
                    <i class="fa fa-edit tag-tool" @click="editTag"></i>
                </div>
                <input class="edit-tag-input tag active" v-show="isTagEdit" v-model="newTagName" @keyup.enter="modifyTag" @blur="()=>isTagEdit = false">
            </div>
            <ul class="tag-list">
                <li class="tag" v-for="tag in tags" :key="tag._id" v-show="tagActive===null || tag._id !== tagActive._id">
                    <span @click="searchTag(tag)">{{tag.name}}</span>
                </li>
            </ul>
            <div class="page-list-container">
                <h3 class="page-title">
                    <i class="fa fa-book"></i> 文章列表
                </h3>
                <post-list :postList="postList" :currentPostId="currentPostId" @updateId="id => currentPostId = id"></post-list>
            </div>
        </div>
        <div class="post-editor">
            <post-editor v-if="currentPostId" :id="currentPostId" @titleModified="searchTag(tagActive)" @deletePost="searchTag(tagActive)" @publishPost="searchTag(tagActive)"></post-editor>
        </div>
    </div>
</template>

<script>
import NavSide from "./common/NavSide.vue";
import PostList from "./common/PostList.vue";
import PostEditor from "./common/PostEditor.vue";

import TagApi from "../api/tag";
import DraftApi from "../api/draft";

export default {
    name: "tags",
    data: function () {
        return {
            tagActive: null,
            isTagEdit: false,
            newTagName: "",
            tags: [],
            postList: [],
            currentPostId: ""
        }
    },
    methods: {
        fetchData: function () {
            TagApi.getTags()
                .then(tags => {
                    this.tags = tags;
                })
                .catch(err => alert(err));
        },
        searchTag: function (tag) {
            this.tagActive = tag;
            this.isTagEdit = false;
            this.newTagName = "";
            DraftApi.getDraftList(tag._id)
                .then(drafts => {
                    this.postList = drafts;
                })
                .catch(err => alert(err));
        },
        deleteTag: function () {
            if (!this.tagActive) {
                alert("没有选择标签");
                return;
            }
            TagApi.deleteTag(this.tagActive._id)
                .then(() => {
                    this.fetchData();
                    this.tagActive = null;
                    this.postList = [];
                })
                .catch(err => alert(err));
        },
        editTag: function () {
            if (!this.tagActive) {
                alert("没有选择标签");
                return;
            }
            this.isTagEdit = true;
            this.newTagName = this.tagActive.name;
        },
        modifyTag: function () {
            if (!this.tagActive) {
                alert("没有选择标签");
                return;
            }
            this.isTagEdit = false;
            TagApi.modifyTag(this.tagActive._id, this.newTagName)
                .then(newTag => {
                    this.fetchData();
                    this.tagActive = newTag;
                })
                .catch(err => alert(err));
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
.active-tag-container {
    margin: 5px 25px;
    position: relative;
}

.tag-list-container {
    position: relative;
    width: 300px;
    border-right: 1px solid #ececec;
    box-sizing: border-box;
    height: 100%;
}

.tag-tools {
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 6px;
}

.tag-tools .tag-tool {
    margin: 5px;
}

.tag-tools .tag-tool:hover,
.tag-tool .tag-tool.active {
    color: #42b983;
}

.edit-tag-input {
    border: none;
    outline: none;
    color: #42b983;
    font-size: 14px;
}

.tag-list {
    margin-left: 25px;
    margin-right: 25px;
    height: 110px;
    overflow: auto;
}

.page-list-container {
    height: calc(100% - 208px);
}

.post-list {
    height: calc(100% - 80px);
}

.post-editor {
    position: absolute;
    top: 0;
    left: 300px;
    width: calc(100% - 300px);
    height: 100%;
}

.tag-item {
    cursor: pointer;
}
</style>



