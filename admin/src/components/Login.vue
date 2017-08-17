<template>
    <div class="login-wrapper">
        <form @submit="submitForm">
            <div class="form-item">
                <label>用户名</label>
                <input type="text" v-model="username" class="input-normal">
            </div>
            <div class="form-item">
                <label>密码</label>
                <input type="password" v-model="password" class="input-normal">
            </div>
            <div class="form-item btn-group">
                <button type="submit" class="btn btn-primary">登录</button>
                <button class="btn btn-danger" @click="resetForm">重置</button>
            </div>
        </form>
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
                alert("用户名和密码不能为空");
                return;
            }
            LoginApi.login(this.username, this.password)
                .then(() => {
                    alert("登陆成功");
                    var to = this.$route.query.redirect;
                    if (to) {
                        this.$router.push(to);
                    }else{
                        this.$router.push("/");
                    }
                })
                .catch(err => {
                    alert(err.message);
                });
        },
        resetForm: function () {
            this.username = "";
            this.password = "";
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

form .form-item {
    margin-top: 10px;
    margin-bottom: 10px;
}

form .btn-group {
    text-align: center;
}

form .btn-group .btn {
    margin: 0px 10px;
}

.login-wrapper label {
    display: inline-block;
    width: 60px;
}
</style>
