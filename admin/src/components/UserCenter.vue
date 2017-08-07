<template>
    <div class="user-wrapper">
        <el-form label-width="100px">
            <el-form-item label="博客标题">
                <el-input type="text" v-model="title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="博客描述">
                <el-input type="text" v-model="describe" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import BlogApi from "../api/blog";

export default {
    data: function () {
        return {
            title: "",
            describe: ""
        }
    },
    methods: {
        fetchData: function () {
            BlogApi.getBlogInfo()
                .then(data => {
                    this.title = data.title;
                    this.describe = data.describe;
                })
                .catch(err => this.$message({ message: err.message, type: "error" }));
        },
        submitForm: function () {
            BlogApi.saveBlogInfo(this.title, this.describe)
                .then(msg => this.$message({ message: "成功修改", type: "success" }))
                .catch(err => this.$message({ message: err.message, type: "error" }));
        }
    },
    created: function () {
        this.fetchData();
    }
}
</script>
<style>
.user-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.user-wrapper>.el-form {
    width: 400px;
}
</style>
