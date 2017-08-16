import VueRouter from "vue-router";
import Vue from "vue";

import PostList from "./components/PostList.vue";
import PostDetail from "./components/PostDetail.vue";
import TagList from "./components/TagList.vue";
import Me from "./components/Me.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    linkActiveClass:"active",
    routes: [
        {
            path: "/", redirect: "/posts"
        },
        {
            path: "/posts", component: PostList
        },
        {
            path:"/posts/:id", component: PostDetail
        },
        {
            path: "/tags", component: TagList
        },
        {
            path: "/about", component: Me
        }
    ]
});

export default router;