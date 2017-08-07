<template>
    <div class="login-wrapper">
        <el-form label-width="100px">
            <el-form-item label="用户名" prop="pass">
                <el-input type="text" v-model="username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="checkPass">
                <el-input type="password" v-model="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">登录</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import LoginApi from "../api/login";
export default {
    data: function () {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        submitForm: function () {
            if (!this.username || !this.password) {
                this.$message({
                    message: "用户名和密码不能为空",
                    type: "error"
                });
                return;
            }
            LoginApi.login(this.username, this.password)
                .then(() => {
                    this.$message({
                        message: "登陆成功",
                        type: "success"
                    });
                    var to = this.$route.query.redirect;
                    this.$router.push(to);
                })
                .catch(err => {
                    this.$message({
                        message: err.message,
                        type: "error"
                    });
                });
        },
        resetForm: function () {
            
        }
    }
}
</script>

<style>
.login-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.login-wrapper>.el-form {
    width: 400px;
}
</style>
