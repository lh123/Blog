<template>
    <div class="list-wrapper">
        <div class="tag-list">
            <div class="tag-head">
                <img src="../assets/img/article-title.png" />
                <span>标签管理</span>
                <img src="../assets/img/add.png" @click="addTag" />
            </div>
            <ul>
                <li v-for="item in tagList" :key="item._id" @click="onTagClick(item._id)">
                    <img src="../assets/img/labels.png">
                    <h3 class="tag-name">{{item.name}}</h3>
                    <span class="el-icon-delete" @click.stop="onTagDelete(item._id)"></span>
                </li>
            </ul>
        </div>
        <div class="article-view-container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import TagApi from "../api/tag";

export default {
    name: "tag-list",
    data: function () {
        return {
            tagList: []
        }
    },
    methods: {
        fetchData: function () {
            TagApi.getTags()
                .then(tags => this.tagList = tags)
                .catch(err => this.$message({ message: err.message, type: "error" }));
        },
        onTagClick: function (id) {
            this.$router.push({ path: "/tags/articles", query: { tagId: id } });
        },
        addTag: function () {
            this.$prompt('请输入标签名', '提示', { confirmButtonText: '确定', cancelButtonText: '取消' })
                .catch(() => {
                    return Promise.reject(new Error("cancel"));
                })
                .then(({ value }) => {
                    return TagApi.addTag(value);
                })
                .then(() => {
                    this.$message({message: "添加成功", type: "success"});
                    this.fetchData();
                })
                .catch(err => {
                    if (err.message !== "cancel") {
                        this.$message({ message: err.message, type: "error" })
                    }
                });
        },
        onTagDelete: function (id) {
            TagApi.deleteTag(id)
                .then(message => {
                    this.$message({ message: "删除成功", type: "success" });
                    this.fetchData();
                })
                .catch(err => this.$message({ message: err.message, type: "error" }));
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

.tag-list {
    display: inline-block;
    width: 230px;
    height: 100%;
}

.tag-head {
    height: 65px;
    line-height: 64px;
    vertical-align: middle;
    padding-left: 20px;
}

.tag-head>span {
    display: inline-block;
    width: 150px;
    vertical-align: middle;
    color: #666;
}

.tag-head>img {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

.tag-list ul {
    padding-left: 22px;
    padding-right: 22px;
    max-height: calc(100% - 65px);
    overflow: auto;
}

.tag-list ul li {
    padding: 5px 5px;
    position: relative;
}

.tag-list ul img {
    width: 17px;
    height: 17px;
    vertical-align: middle;
}

.tag-name {
    width: 150px;
    padding: 5px 0px;
    display: inline-block;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #20a0ff;
    font-weight: bold;
    font-size: 1.17em;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
}

.tag-list ul>li>span {
    color: #20a0ff;
    position: absolute;
    right: 0px;
    top: 12px;
}
</style>
