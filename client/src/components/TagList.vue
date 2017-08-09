<template>
    <div class="post-list">
        <div>
            <h2>
                All Tags
            </h2>
            <p class="fix tag-container tag-list">
                <span class="tag" v-for="tag in tags" :key="tag._id">
                    <a href="javascript:;" @click="tagClick(tag._id)" class="tag-link" :class="{active:currentTagId===tag._id}">{{tag.name}}</a>
                </span>
            </p>
        </div>
        <div class="post-list">
            <ul>
                <li v-for="article in articles" :key="article._id">
                    <h4>
                        <router-link :to="'/posts/'+article._id">{{article.title}}&nbsp;</router-link>
                        <span>&nbsp;{{article.createTime | dateFormat}}</span>
                    </h4>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import TagApi from "../api/tag";
import { dateFormat } from "../utils/index";

export default {
    name: "tag-list",
    data: function () {
        return {
            tags: [],
            articles: [],
            currentTagId: -1
        }
    },
    methods: {
        fetchData: function () {
            this.tags = [];
            TagApi.getAllTag()
                .then(tags => {
                    this.tags = tags;
                })
                .catch(err => alert(err));
        },
        tagClick: function (id) {
            this.articles = [];
            this.currentTagId = id;
            TagApi.getArticleListWithTag(id)
                .then(articles => {
                    this.articles = articles;
                })
                .catch(err => alert(err));
        }
    },
    filters:{
        dateFormat
    },
    created: function () {
        this.fetchData();
    }
}
</script>

<style>
.tag-container {
    font-size: 1.2em;
}
</style>
