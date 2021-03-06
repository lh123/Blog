import Vue from "vue";
import VueRouter from "vue-router";
import Posts from "../components/Posts.vue";
import Tags from "../components/Tags.vue";
import Login from "../components/Login.vue";
import Blog from "../components/Blog.vue";
import store from "../vuex/store";

import LoginApi from "../api/login";

Vue.use(VueRouter);

const router = new VueRouter({
    linkActiveClass: "active",
    routes: [
        {
            path: "/", redirect: "/posts"
        },
        {
            path: "/posts", component: Posts, meta: {
                auth: true
            }
        },
        {
            path: "/tags", component: Tags, meta: {
                auth: true
            }
        },
        {
            path: "/user", component: Blog, meta: {
                auth: true
            }
        },
        {
            path: "/login", component: Login
        }
    ]
});

router.beforeEach((to, from, next) => {
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