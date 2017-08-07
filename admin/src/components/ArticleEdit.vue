<template>
    <div class="article-edit-wrapper">
        <div class="article-edit-title">
            <input type="text" v-model="articleTitle" placeholder="请输入标题">
        </div>
        <div class="article-toolbar">
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
                <el-button type="danger" size="small" @click="delectArticles">删除</el-button>
                <el-button size="small" @click="saveDraft">保存草稿</el-button>
                <el-button type="primary" size="small" @click="publishedArticles">发布文章</el-button>
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
import "../assets/css/simplemde.min.css";
import marked from "marked";
import ArticleApi from "../api/article";
import TagApi from "../api/tag";

export default {
    data: function () {
        return {
            id: undefined,
            articleTitle: "",
            content: "",
            tags: [],
            allTags: [],
            isPublic: false
        }
    },
    mounted: function () {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            var self = this;
            self.id = this.$route.query.id;
            var simplemde = new SimpleMDE({
                element: document.getElementById("editor"),
                autofocus: true,
                autosave: true,
                previewRender: function (text) {
                    return marked(text);
                }
            });
            simplemde.codemirror.on("change", function () {
                var value = simplemde.value();
                self.content = value;
            });
            TagApi.getTags()
                .then(tags => this.allTags = tags)
                .catch(err => this.$message({ message: err.message, type: "error" }));
            if (self.id) {
                ArticleApi.getArticleDetail(self.id)
                    .then(res => {
                        this.articleTitle = res.title;
                        this.content = res.content;
                        this.isPublic = res.isPublic;
                        this.tags = res.tags;
                        simplemde.value(this.content);
                    })
                    .catch(err => this.$message({ message: err.message, type: "error" }));
            } else {
                this.id = undefined;
                this.articleTitle = "";
                this.content = "";
                this.isPublic = false;
                this.tags = [];
                simplemde.value(this.content);
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
        delectArticles: function () {
            ArticleApi.deleteArticle(this.id)
                .then(() => {
                    this.$message({ message: "成功删除文章", type: "success" });
                    this.$emit("onArticleDelete");
                    this.$router.push("/articles");
                })
                .catch(err => {
                    this.$message({ message: err.message, type: "error" });
                })
        },
        saveDraft: function () {
            ArticleApi.saveArticle(this.id, this.articleTitle, this.content, this.tags, false, true)
                .then(() => {
                    this.$message({ message: "成功保存草稿", type: "success" });
                    this.$emit("onDraftSave");
                })
                .catch(err => {
                    this.$message({ message: err.message, type: "error" });
                });
        },
        publishedArticles: function () {
            ArticleApi.saveArticle(this.id, this.articleTitle, this.content, this.tags, false, false)
                .then(data => {
                    if (data) {
                        this.id = data._id;
                    }
                    this.$message({ message: "成功发布文章", type: "success" });
                    this.$router.push({ path: "/articles/edit", query: { id: this.id } });
                    this.$emit("onArticleSave");
                })
                .catch(err => {
                    this.$message({ message: err.message, type: "error" });
                });
        }
    }
}
</script>

<style>
.article-edit-title {
    height: 43px;
    width: 100%;
}

.article-edit-title>input {
    height: 43px;
    width: 90%;
    margin-left: 10px;
    outline-style: none;
    font-size: 20px;
    border: none;
}

.article-edit-wrapper {
    height: 100%;
    width: 100%;
}

.article-toolbar {
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

.article-toolbar .tags {
    display: inline-block;
}

.article-toolbar .action-btn {
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
