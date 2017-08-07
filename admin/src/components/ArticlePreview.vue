<template>
    <div class="article-preview">
        <div class="article-preview-title">{{articleDetail.title}}</div>
        <div class="article-preview-tags">
            <el-tag v-for="tag in articleDetail.tags" :key="tag._id" :closable="false" type="success" @close="onTagRemove(tag)">
                {{tag.name}}
            </el-tag>
        </div>
        <div class="article-preview-content" v-html="compiledMarkdown"></div>
        <div class="article-preview-footer">
            <el-button type="primary" icon="edit" @click="onModifyClick">编辑</el-button>
        </div>
    </div>
</template>
<script>
import marked from "marked";
import ArticleApi from "../api/article";

export default {
    data: function () {
        return {
            articleDetail: {},
        }
    },
    created: function () {
        this.fetchData();
    },
    watch: {
        "$route": function (to, from) {
            if (to.path === from.path) {
                if (to.query.id != from.query.id) {
                    this.fetchData();
                }
            }
        }
    },
    methods: {
        fetchData: function () {
            var id = this.$route.query.id;
            ArticleApi.getArticleDetail(id)
                .then(res => {
                    this.articleDetail = res;
                })
                .catch(err => this.$message({ message: err.message, type: "error" }));
        },
        onModifyClick: function () {
            var id = this.$route.query.id;
            this.$router.push({ path: "/articles/edit", query: { id } })
        }
    },
    computed: {
        compiledMarkdown: {
            get: function () {
                return marked(this.articleDetail.content || "");
            }
        }
    }
}
</script>
<style>
.article-preview {
    padding: 15px;
    height: calc(100% - 30px);
}

.article-preview-title {
    font-size: 22px;
    height: 30px;
    cursor: pointer;
    border-left: 3px solid #a0a0a1;
    padding-left: 10px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}

.article-preview-tags .el-tag {
    margin: 5px;
}

.article-preview-content {
    height: calc(100% - 70px);
    max-height: calc(100% - 70px);
    overflow: auto;
}

.article-preview-footer {
    position: fixed;
    right: 20px;
    bottom: 30px;
}
</style>
