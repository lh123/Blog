<template>
    <div class="post-edit-wrapper">
        <div class="post-edit-title">
            <input type="text" v-model="postTitle" placeholder="请输入标题">
        </div>
        <div class="post-toolbar">
            <div class="tags">
                <el-dropdown @command="onTagClick" trigger="click">
                    <span class="el-dropdown-link">
                        <img src="../assets/img/tag.png" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="tag in allTags" :key="tag._id" :command="tag">{{tag.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-tag v-for="tag in tags" :key="tag._id" :closable="true" type="success" @close="onTagRemove(tag)">
                    {{tag.name}}
                </el-tag>
            </div>
            <div class="action-btn">
                <el-button type="danger" size="small" @click="deleteDraft">删除</el-button>
                <el-button size="small" @click="saveDraft">保存草稿</el-button>
                <el-button type="primary" size="small" @click="publishedDraft">发布文章</el-button>
            </div>
        </div>
        <div class="editor-container">
            <textarea id="editor"></textarea>
        </div>
    </div>
</template>

<script>
import SimpleMDE from "simplemde";
import axios from "axios";
import marked from "marked";
import DraftApi from "../api/draft";
import TagApi from "../api/tag";
import highlight from "highlight.js";
import "highlight.js/styles/github.css";
import "../assets/css/simplemde.css";
import "../assets/css/markdown.css";

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

export default {
    data: function () {
        return {
            id: undefined,
            postTitle: "",
            content: "",
            tags: [],
            allTags: [],
            isPublic: false,
            simplemde: null
        }
    },
    watch: {
        "$route": function (to, from) {
            if (to.path === from.path && to.query.id !== from.query.id) {
                this.fetchData();
            }
        }
    },
    mounted: function () {
        var self = this;
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            autofocus: true,
            autosave: true,
            spellChecker: false,
            previewRender: function (text) {
                return marked(text);
            }
        });
        this.simplemde.codemirror.on("change", function () {
            var value = self.simplemde.value();
            self.content = value;
        });
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            this.id = this.$route.query.id;
            TagApi.getTags()
                .then(tags => this.allTags = tags)
                .catch(err => this.$message({ message: err.message, type: "error" }));
            if (this.id) {
                DraftApi.getDraftDetail(this.id)
                    .then(res => {
                        this.postTitle = res.title;
                        this.content = res.content;
                        this.isPublic = res.isPublic;
                        this.tags = res.tags;
                        this.simplemde.value(this.content);
                    })
                    .catch(err => this.$message({ message: err.message, type: "error" }));
            } else {
                this.id = undefined;
                this.postTitle = "";
                this.content = "";
                this.isPublic = false;
                this.tags = [];
                this.simplemde.value(this.content);
            }
        },
        onTagClick: function (tag) {
            if (!(this.tags.find(value => value._id === tag._id))) {
                this.tags.push(tag);
            }
        },
        onTagRemove: function (tag) {
            var index = this.tags.findIndex(value => value._id === tag._id);
            this.tags.splice(index, 1);
        },
        deleteDraft: function () {
            DraftApi.deleteDraft(this.id)
                .then(() => {
                    this.$message({ message: "成功删除文章", type: "success" });
                    this.$emit("onDraftDelete");
                    this.$router.push("/posts");
                })
                .catch(err => {
                    this.$message({ message: err.message, type: "error" });
                })
        },
        saveDraft: function () {
            if (this.id) {
                DraftApi.saveDraft(this.id, this.postTitle, this.content, this.tags)
                    .then(() => {
                        this.$message({ message: "成功保存草稿", type: "success" });
                        this.$emit("onDraftSave");
                    })
                    .catch(err => {
                        this.$message({ message: err.message, type: "error" });
                    });
            }
        },
        publishedDraft: function () {
            DraftApi.publishDraft(this.id)
                .then(data => {
                    this.$message({ message: "成功发布文章", type: "success" });
                    this.$emit("onDraftPublish");
                })
                .catch(err => {
                    this.$message({ message: err.message, type: "error" });
                });
        }
    }
}
</script>

<style>
.post-edit-title {
    height: 43px;
    width: 100%;
}

.post-edit-title>input {
    height: 43px;
    width: 90%;
    margin-left: 10px;
    outline-style: none;
    font-size: 20px;
    border: none;
}

.post-edit-wrapper {
    height: 100%;
    width: 100%;
}

.post-toolbar {
    height: 60px;
    line-height: 60px;
}

.tags span>img {
    width: 30px;
    height: 30px;
    vertical-align: middle;
}

.tags span>img:hover {
    border-bottom: 3px solid #20a0ff;
}

.tags .el-tag {
    margin: 5px;
}

.post-toolbar .tags {
    display: inline-block;
}

.post-toolbar .action-btn {
    float: right;
    padding-right: 20px;
}

.editor-container {
    width: 100%;
    height: calc(100% - 105px);
    max-height: calc(100% - 105px);
    overflow: auto;
}

#editor {
    width: 100%;
}

.CodeMirror {
    height: calc(100% - 105px) !important;
}
</style>
