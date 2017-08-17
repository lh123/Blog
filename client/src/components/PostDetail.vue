<template>
    <div>
        <!-- <div class="marked-content"></div> -->
        <div class="content">
            <h1>{{title}}</h1>
            <h4>{{createTime | dateFormat}}</h4>
            <p class="markdown" v-html="markdownContent"></p>
            <div class="tag-list fix">
                <span class="tag" v-for="tag in tags" :key="tag._id">
                    <router-link to="/tags" class="tag-link" active-class="active">{{tag.name}}</router-link>
                </span>
            </div>
        </div>
        <page-nav @onPreClick="goPreArticle" @onNextClick="goNextArticle" :havePre="Boolean(preArticle)" :haveNext="Boolean(nextArticle)" :preWord="preArticle?preArticle.title:''" :nextWord="nextArticle?nextArticle.title:''"></page-nav>
    </div>
</template>

<script>
import ArticleApi from "../api/article";
import PageNav from "./common/PageNav.vue";
import { markdown, dateFormat } from "../utils/index";

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
            return markdown(this.content);
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
            this.$router.push("/posts/" + this.preArticle.id);
        },
        goNextArticle: function () {
            this.$router.push("/posts/" + this.nextArticle.id);
        }
    },
    watch: {
        "$route": function (to, from) {
            if (to.path.match(/^\/posts\/\w{24}$/)) {
                this.fetchData();
            }
        }
    },
    filters:{
        dateFormat
    },
    components: {
        PageNav
    },
    created: function () {
        this.fetchData();
    }
}
</script>
