<template>
    <div class="post-list">
        <div class="post" v-for="post in posts" :key="post._id">
            <h2>
                <router-link :to="'/posts/' + post._id">{{post.title}}</router-link>
            </h2>
            <h4>{{post.createTime | dateFormate}}</h4>
            <div>
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
import marked from "marked";

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
        markdown: function (content) {
            return marked(content || "");
        },
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
        dateFormate: function (value) {
            var format = function (bit) {
                if (bit < 10) {
                    return "0" + bit;
                }
                return bit;
            };
            var date = new Date(value);
            var year = date.getFullYear();
            var month = format(date.getMonth() + 1);
            var day = format(date.getDate());
            var hour = format(date.getHours());
            var min = format(date.getMinutes());
            var sec = format(date.getSeconds());
            return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
        }
    }
}
</script>


