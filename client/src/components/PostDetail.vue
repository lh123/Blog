<template>
    <div>
        <!-- <div class="marked-content"></div> -->
        <div class="content">
            <h1>{{title}}</h1>
            <h4>{{createTime}}</h4>
            <p v-html="markdownContent" id="markdown-content"></p>
            <div class="tag-list">
                <span class="tag" v-for="tag in tags" :key="tag._id">{{tag.name}}</span>
            </div>
        </div>
        <page-nav @onPreClick="goPreArticle" @onNextClick="goNextArticle" :havePre="Boolean(preArticle)" :haveNext="Boolean(nextArticle)" :preWord="preArticle?preArticle.title:''" :nextWord="nextArticle?nextArticle.title:''"></page-nav>
    </div>
</template>

<script>
import ArticleApi from "../api/article";
import PageNav from "./common/PageNav.vue";
import marked from "marked";

export default {
    name: "post-detail",
    data: function () {
        return {
            id: "",
            title: "",
            content: "",
            createTime: "",
            lastModify: "",
            tags: [],
            nextArticle: "",
            preArticle: ""
        }
    },
    computed: {
        markdownContent: function () {
            return marked(this.content || "");
        }
    },
    methods: {
        fetchData: function () {
            this.id = this.$route.params.id;
            ArticleApi.getArticleDetail(this.id)
                .then(articleDetail => {
                    this.title = articleDetail.article.title;
                    this.content = articleDetail.article.content;
                    this.createTime = articleDetail.article.createTime;
                    this.lastModify = articleDetail.article.lastModify;
                    this.tags = articleDetail.article.tags;
                    this.nextArticle = articleDetail.nextArticle;
                    this.preArticle = articleDetail.preArticle;
                })
                .catch(err => alert(err));
        },
        goPreArticle: function () {
            this.$router.push("/posts/" + this.preArticle._id);
        },
        goNextArticle: function () {
            this.$router.push("/posts/" + this.nextArticle._id);
        }
    },
    watch: {
        "$route": function (to, from) {
            if (to.path.match(/^\/posts\/\w{24}$/)){
                this.fetchData();
            }
        }
    },
    components: {
        PageNav
    },
    created: function () {
        this.fetchData();
    }
}
</script>
