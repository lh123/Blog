<template>
    <div class="post-list">
        <div class="post" v-for="post in posts" :key="post._id">
            <h2>
                <router-link :to="'/posts/' + post._id">{{post.title}}</router-link>
            </h2>
            <h4>{{post.createTime | dateFormat}}</h4>
            <div class="markdown">
                <p v-html="markdown(post.summary)"></p>
            </div>
            <router-link :to="'/posts/' + post._id">... continue reading</router-link>
        </div>
        <page-nav @onPreClick="prePage" @onNextClick="nextPage" :havePre="currentPage>0" :haveNext="totalPage !== null && totalPage !== undefined && (currentPage<totalPage-1)"></page-nav>
    </div>
</template>

<script>
import ArticleApi from "../api/article";
import PageNav from "./common/PageNav.vue";
import { markdown, dateFormat } from "../utils/index";

const limit = 10;

export default {
    data: function () {
        return {
            posts: [],
            totalPage: 0,
            currentPage: 0
        }
    },
    components: {
        PageNav
    },
    watch: {
        "$route": function (to, from) {
            if (to.path === from.path && to.query.page !== from.query.page) {
                this.fetchData();
            }
        }
    },
    created: function () {
        this.fetchData();
    },
    methods: {
        fetchData: function () {
            this.currentPage = this.$route.query.page || 0;
            ArticleApi.getArticleList(this.currentPage, limit)
                .then(data => {
                    this.posts = data.articles;
                    this.totalPage = Math.ceil(data.total / limit);
                })
                .catch(msg => {
                    alert(msg);
                })
        },
        markdown,
        prePage: function () {
            var prePage = this.currentPage - 1;
            this.$router.push({ path: "/posts", query: { page: prePage } });
        },
        nextPage: function () {
            var nextPage = this.currentPage + 1;
            this.$router.push({ path: "/posts", query: { page: nextPage } });
        }
    },
    filters: {
        dateFormat
    }
}
</script>


