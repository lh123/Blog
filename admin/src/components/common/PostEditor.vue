<template>
    <div class="post-editor-container">
        <div class="input-title-container">
            <input type="text" class="post-title-input" placeholder="请输入标题" v-model="postTitle" @input="()=>isModified = true">
        </div>
        <div class="post-toolbar fix">
            <div class="tag-container">
                <i class="fa fa-tags"></i>
                <span class="tag" v-for="tag in tags" :key="tag._id">{{tag.name}}
                    <i class="fa fa-remove delete-tag" @click="deleteTag(tag._id)"></i>
                </span>
                <div class="tag-add-container">
                    <span class="tag active" v-show="!tagInput" @click="beginAddTag">+</span>
                    <input type="text" v-show="tagInput" class="tag-input" v-model="newTagName" placeholder="请用回车提交新Tag" @keyup.enter="addNewTag">
                    <span class="tag active" v-show="tagInput" @click="()=>tagInput=false">取消</span>
                    <ul class="search-tag-list" v-show="searchedTags.length>0 && tagInput">
                        <li class="search-tag-item" v-for="tag in searchedTags" :key="tag._id" @click="suggestTagClick(tag)">{{tag.name}}</li>
                    </ul>
                </div>
            </div>
            <div class="post-btn-container">
                <button type="button" class="btn btn-primary right" @click="publishPost">发布文章</button>
                <button type="button" v-show="isModified" class="btn btn-primary right" @click="savePost">保存草稿</button>
                <button type="button" class="btn btn-danger right" @click="deletePost">删除草稿</button>
            </div>
        </div>
        <div class="editor-container">
            <textarea id="editor"></textarea>
        </div>
    </div>
</template>

<script>
import DraftApi from "../../api/draft";
import TagApi from "../../api/tag";
import SimpleMDE from "SimpleMDE";
import { _debounce } from "../../utils/index";
import "../../assets/css/markdown.css";

const searchDebounce = _debounce(function (value) {
    TagApi.searchTag(value)
        .then(tags => {
            this.searchedTags = tags;
        })
        .catch(err => console.log(err));
}, 500);

// const titleChangeDebounce = _debounce(function () {
//     DraftApi.saveDraft(this.id, this.postTitle, undefined, undefined)
//         .then(() => this.$emit("titleModified"))
//         .catch(err => alert(err));
// }, 500);

// const contentChangeDebounce = _debounce(function () {
//     DraftApi.saveDraft(this.id, undefined, this.content, undefined)
//         .then(() => this.$emit("contentModified"))
//         .catch(err => alert(err));
// }, 500);

// const tagChangeDebounce = _debounce(function (value) {
//     DraftApi.saveDraft(this.id, undefined, undefined, this.tags)
//         .then(() => this.$emit("tagModified"))
//         .catch(err => alert(err));
// }, 500);

export default {
    name: "post-editor",
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data: function () {
        return {
            postTitle: "",
            isPublic: "",
            tags: [],
            tagInput: false,
            newTagName: "",
            searchedTags: [],
            simplemde: null,
            isChangedByUser: false,
            isModified: false
        }
    },
    computed: {
        content: {
            get: function () {
                return this.simplemde.value();
            },
            set: function (value) {
                this.simplemde.value(value);
            }
        }
    },
    created: function () {
        this.fetchData(this.id);
    },
    mounted: function () {
        var self = this;
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false
        });
        this.simplemde.codemirror.on("change", () => {
            if (!self.isChangedByUser) {
                self.isChangedByUser = true;
                return;
            }
            this.isModified = true;
        });
    },
    destroyed: function () {
        this.simplemde.toTextArea();
        this.simplemde = null;
    },
    watch: {
        "id": function (id) {
            this.fetchData(id);
        },
        "newTagName": function (value) {
            this.searchTag(value);
        }
    },
    methods: {
        fetchData: function (id) {
            DraftApi.getDraftDetail(id)
                .then(draft => {
                    this.postTitle = draft.title;
                    this.isChangedByUser = false;
                    this.content = draft.content;
                    this.isPublic = draft.isPublic;
                    this.tags = draft.tags;
                })
                .catch(err => alert(err));
        },
        // titleModified: titleChangeDebounce,
        // contentModified: contentChangeDebounce,
        // tagModified: tagChangeDebounce,
        beginAddTag: function () {
            this.tagInput = true;
            this.newTagName = "";
        },
        addNewTag: function () {
            if (this.searchedTags.length === 0) {
                TagApi.createTag(this.newTagName)
                    .then(tag => {
                        this.tags.push(tag);
                        this.tagInput = false;
                        this.isModified = true;
                    })
                    .catch(err => {
                        alert(err);
                    });
            } else {
                alert("该标签已经存在无法再次添加");
            }
        },
        deleteTag: function (id) {
            this.tags.splice(this.tags.findIndex(value => value.id === id), 1);
            this.isModified = true;
        },
        searchTag: searchDebounce,
        suggestTagClick: function (tag) {
            this.tagInput = false;
            if (!this.tags.find(value => value.id === tag.id)) {
                this.tags.push(tag);
                this.isModified = true;
            }
        },
        publishPost: function () {
            DraftApi.publishDraft(this.id)
                .then(() => this.$emit("publishPost"))
                .catch(err => alert(err));
        },
        savePost: function () {
            DraftApi.saveDraft(this.id, this.postTitle, this.content, this.tags)
                .then(() => {
                    this.isModified = false;
                    this.$emit("postSave");
                })
                .catch(err => alert(err));
        },
        deletePost: function () {
            DraftApi.deleteDraft(this.id)
                .then(() => {
                    alert("删除成功")
                    this.$emit("deletePost")
                })
                .catch(err => alert(err));
        }
    }
}
</script>

<style>
.post-editor-container {
    height: 100%;
    min-width: 720px;
    padding: 16px 16px 0px 16px;
    box-sizing: border-box;
    overflow: auto;
}

.post-toolbar {
    white-space: nowrap;
}

.post-title-input {
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #ececec;
    transition: border 0.5s;
    width: 100%;
    outline: none;
    font-size: 1.5em;
    padding-left: 10px;
}

.post-title-input.modified {
    border-left: 2px solid chocolate;
}

.tag-container {
    float: left;
    width: 50%;
    box-sizing: border-box;
    padding: 15px;
}

.tag-container .fa {
    margin-left: 8px;
    margin-right: 8px;
}

.tag-add-container {
    display: inline-block;
    position: relative;
}

.tag-container .tag .delete-tag {
    display: none;
    font-size: 12px;
}

.tag-container .tag:hover .delete-tag {
    display: inline-block;
}

.tag-add-container .tag-input {
    border: none;
    outline: none;
    font-size: 14px;
    color: #42b983;
    background: transparent;
    z-index: 100;
}

.search-tag-list {
    position: absolute;
    z-index: 100;
    top: 30px;
    width: 151px;
    background-color: white;
    border: 1px solid #ececec;
    border-radius: 4px;
    box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.3);
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 200px;
}

.search-tag-item {
    color: #7f8c8d;
    margin: 8px 4px;
    border-bottom: 1px solid #ececec;
    cursor: pointer;
}

.search-tag-item:hover {
    color: #42b983;
}

.post-btn-container {
    width: 50%;
    float: left;
    box-sizing: border-box;
    padding: 15px;
    min-width: 178px;
}

.post-btn-container .btn {
    margin: 0px 5px;
}

.right {
    float: right;
}

.editor-container {
    height: calc(100% - 90px);
}

.CodeMirror {
    height: calc(100% - 110px);
    min-height: 300px;
}
</style>
