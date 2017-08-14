<template>
    <ul class="post-list">
        <li v-for="item in postList" :key="item._id" class="post-list-item">
            <div class="post" :class="[{'active':currentPostId === item._id},item.isPublish?'published':(item.article?'modified':'')]" @click="()=>$emit('updateId',item._id)">
                <h3 class="post-title">{{item.title}}</h3>
                <h6 class="post-time">{{item.lastModify | dateFormat}}</h6>
                <p class="post-summary">{{item.summary}}</p>
            </div>
        </li>
    </ul>
</template>

<script>
import DraftApi from "../../api/draft";
import { dateFormat } from "../../utils/index";
export default {
    name: "post-list",
    props: {
        postList: {
            type: Array
        },
        currentPostId: {
            type: String,
            required: true
        }
    },
    filters: {
        dateFormat
    }
}
</script>

<style>
.post-list {
    border-top: 1px solid #ececec;
    overflow: auto;
}

.post-list-item {
    cursor: pointer;
    margin: 0 25px;
    padding: 20px 0;
    border-bottom: 1px solid #ececec;
}

.post {
    padding-left: 5px;
}

.post.published {
    border-left: 2px solid #42b983;
}

.post.modified {
    border-left: 2px solid chocolate;
}

.post .post-title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 16px;
    line-height: 1.3em;
    font-weight: 400;
    margin: 0 0 4px;
    padding-bottom: 0;
}

.post.active .post-title,
.post:hover .post-title {
    color: #42b983;
}

.post .post-time {
    color: #7f8c8d;
    margin: 0 0 6px;
}

.post .post-summary {
    color: #7f8c8d;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    margin: 0;
    max-height: 51px;
    overflow: hidden;
    word-wrap: break-word;
}
</style>

// import DraftApi from "../api/draft";

// export default {
//     name: "post-list",
//     data: function () {
//         return {
//             draftList: [],
//             currentDraftId: -1
//         }
//     },
//     watch: {
//         "$route": function (to, from) {
//             var regr = to.fullPath.match(/\/posts\/\w{0,}\?(\w*=\w*)/);
//             if (regr && regr[1]) {
//                 this.currentDraftId = regr[1].split("=")[1];
//             }
//             if (to.path === from.path && to.query.tagId !== from.query.tagId) {
//                 this.fetchData();
//             }
//         }
//     }
//     ,
//     methods: {
//         fetchData: function () {
//             var regr = this.$route.fullPath.match(/\/posts\/\w{0,}\?(\w*=\w*)/);
//             if (regr && regr[1]) {
//                 this.currentDraftId = regr[1].split("=")[1];
//             }
//             DraftApi.getDraftList(this.$route.query.tagId)
//                 .then(data => {
//                     this.draftList = data;
//                 })
//                 .catch(err => console.log(err));
//         },
//         getFormatDate: function (post) {
//             var format = function (value) {
//                 if (value < 10) {
//                     return "0" + value;
//                 }
//                 return value;
//             };
//             var lastModify = post.lastModify;
//             var date = new Date(lastModify);
//             date.toLocaleDateString
//             var year = date.getFullYear();
//             var month = format(date.getMonth() + 1);
//             var day = format(date.getDate());
//             var hour = format(date.getHours());
//             var min = format(date.getMinutes());
//             var sec = format(date.getSeconds());
//             return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
//         },
//         onDraftClick: function (id) {
//             // this.currentDraftId = id;
//             this.$router.push({ path: "/posts/edit", query: { id } });
//         },
//         addPost: function () {
//             DraftApi.createDraft("请输入标题")
//                 .then((draft) => {
//                     let id = draft._id;
//                     // this.currentDraftId = draft._id;
//                     this.$router.push({ path: "/posts/edit", query: { id } });
//                     this.fetchData();
//                 })
//                 .catch(err => {
//                     this.$message({ message: err.message, type: "error" });
//                 });
//         }
//     },
//     created: function () {
//         this.fetchData();
//     }
// }

/* .list-wrapper {
    height: 100%;
}

.post-list {
    display: inline-block;
    width: 230px;
    height: 100%;
}

.post-list-head {
    height: 65px;
    line-height: 64px;
    vertical-align: middle;
    padding-left: 20px;
}

.post-list-head span {
    display: inline-block;
    width: 150px;
    vertical-align: middle;
    color: #666;
}

.post-list-head>img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

.post-list ul {
    padding-left: 22px;
    padding-right: 22px;
    max-height: calc(100% - 65px);
    overflow: auto;
}

.post-list-item {
    padding: 6px 8px;
    margin-bottom: 6px;
}

.post-list-item:hover {
    padding-left: 5px;
    border-left: 3px solid #20a0ff;
}

.post-select {
    padding-left: 5px;
    border-left: 3px solid #20a0ff;
}

.post-time {
    font-size: 12px;
    color: #b3bbbc;
    margin-bottom: 6px;
}

.post-title {
    width: 170px;
    padding: 5px 0px;
    line-height: 25px;
    max-height: 25px;
    display: block;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #20a0ff;
    font-weight: bold;
    font-size: 1.17em;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: break-word;
}

.post-summary {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    margin: 0;
    max-height: 51px;
    overflow: hidden;
    word-wrap: break-word;
    color: lightslategray;
}

.post-editor-container {
    vertical-align: top;
    display: inline-block;
    height: 100%;
    width: calc(100% - 240px);
} */
