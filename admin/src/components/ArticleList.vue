<template>
    <div class="list-wrapper">
        <div class="article-list">
            <div class="article-head">
                <img src="../assets/img/article-title.png" />
                <span>文章列表</span>
                <img src="../assets/img/add.png" @click="addArticle" />
            </div>
            <ul>
                <li v-for="item in articleList" :key="item._id" @click="onArticleClick(item._id)">
                    <h3 class="article-title" :class="{'draft-title' : item.isDraft}">{{item.title}}</h3>
                    <p>{{getFormatDate(item)}}</p>
                </li>
            </ul>
        </div>
        <div class="article-view-container">
            <transition name="fade" mode="out-in">
                <router-view @onArticleSave="fetchData" @onArticleDelete="fetchData" @onDraftSave="fetchData"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import ArtcileApi from "../api/article";

export default {
    name: "article-list",
    data: function () {
        return {
            articleList: [],
            routerKey:""
        }
    },
    methods: {
        fetchData: function () {
            ArtcileApi.getArticleList(this.$route.query.tagId)
                .then(data => {
                    this.articleList = data;
                })
                .catch(err => console.log(err));
        },
        getFormatDate: function (article) {
            var format = function (value) {
                if (value < 10) {
                    return "0" + value;
                }
                return value;
            };
            var lastModify = article.lastModify;
            var date = new Date(lastModify);
            date.toLocaleDateString
            var year = date.getFullYear();
            var month = format(date.getMonth() + 1);
            var day = format(date.getDate());
            var hour = format(date.getHours());
            var min = format(date.getMinutes());
            var sec = format(date.getSeconds());
            return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
        },
        onArticleClick: function (id) {
            this.$router.push({ path: "/articles/preview", query: { id } });
        },
        addArticle: function () {
            this.$router.push("/articles/edit");
        }
    },
    created: function () {
        this.fetchData();
    }
}
</script>
<style>
.list-wrapper {
    height: 100%;
}

.article-list {
    display: inline-block;
    width: 230px;
    height: 100%;
}

.article-head {
    height: 65px;
    line-height: 64px;
    vertical-align: middle;
    padding-left: 20px;
}

.article-head>span {
    display: inline-block;
    width: 150px;
    vertical-align: middle;
    color: #666;
}

.article-head>img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

.article-list ul {
    padding-left: 22px;
    padding-right: 22px;
    max-height: calc(100% - 65px);
    overflow: auto;
}

.article-list ul li {
    padding: 5px 5px;
}

.article-list ul p {
    font-size: 12px;
    color: #b3bbbc;
}

.article-title {
    width: 170px;
    padding: 5px 0px;
    display: block;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #20a0ff;
    font-weight: bold;
    font-size: 1.17em;
}

.draft-title {
    color: #ff4949;
}

.article-view-container {
    vertical-align: top;
    display: inline-block;
    height: 100%;
    width: calc(100% - 240px);
}
</style>
