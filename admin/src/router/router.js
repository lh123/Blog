import Vue from "vue";
import VueRouter from "vue-router";
import ArticleList from "../components/ArticleList.vue";
import ArticlePreview from "../components/ArticlePreview.vue";
import ArticleEdit from "../components/ArticleEdit.vue";
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
            path: "/", redirect: "/articles"
        },
        {
            path: "/articles", component: ArticleList, meta: {
                auth: true
            },
            children: [
                { path: "preview", component: ArticlePreview, meta: { auth: true } },
                { path: "edit", component: ArticleEdit, meta: { auth: true } }
            ]
        },
        {
            path: "/tags", component: TagList, meta: {
                auth: true
            },
            children: [
                { path: "articles", component: ArticleList }
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