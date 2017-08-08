import Vue from "vue";
import VueRouter from "vue-router";
import PostList from "../components/PostList.vue";
import PostEdit from "../components/PostEdit.vue";
import TagList from "../components/Taglist.vue";
import Login from "../components/Login.vue";
import UserCenter from "../components/UserCenter.vue";
import store from "../vuex/store";

import LoginApi from "../api/login";

Vue.use(VueRouter);

var isRefeshToken = false;

const router = new VueRouter({
    routes: [
        {
            path: "/", redirect: "/posts"
        },
        {
            path: "/posts", component: PostList, meta: {
                auth: true
            },
            children: [
                { path: "edit", component: PostEdit, meta: { auth: true } }
            ]
        },
        {
            path: "/tags", component: TagList, meta: {
                auth: true
            },
            children: [
                { path: "posts", component: PostList }
            ]
        },
        {
            path: "/user", component: UserCenter, meta: {
                auth: true
            }
        },
        {
            path: "/login", component: Login
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!isRefeshToken && store.state.refresh_token) {
        isRefeshToken = true;
        LoginApi.refreshToken()
            .then(() => next())
            .catch((err) => next({ path: "/login", query: { redirect: to.fullPath } }));
        return;
    }
    if (to.meta.auth) {
        if (store.state.access_token && store.state.refresh_token) {
            next();
        } else {
            next({ path: "/login", query: { redirect: to.fullPath } });
        }
    } else {
        next();
    }
});

export default router;