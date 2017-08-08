import VueRouter from "vue-router";
import Vue from "vue";

import PostList from "./components/PostList.vue";
import PostDetail from "./components/PostDetail.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: "/", redirect: "/posts"
        },
        {
            path: "/posts", component: PostList
        },
        {
            path:"/posts/:id", component: PostDetail
        }
    ]
});

export default router;