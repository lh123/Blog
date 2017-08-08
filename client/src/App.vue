<template>
    <div id="app">
        <head-nav></head-nav>
        <main class="content">
            <router-view></router-view>
        </main>
        <footer class="copy-right">
            Copyright © 2014-2017 LH
        </footer>
    </div>
</template>

<script>
import HeadNav from "./components/common/HeadNav.vue";
export default {
    components: {
        HeadNav
    }
}
</script>


<style>
.content {
    padding: 2.2em 0px;
    max-width: 600px;
    margin: 0 auto;
}

.content .post {
    padding: 1em 0 2em;
    border-bottom: 1px solid #ddd;
}

.content h2 {
    margin: 0.8em 0;
    padding-bottom: 0;
    border-bottom: none;
}

.content h4 {
    color: #7f8c8d;
    margin: 1.2em 0;
}

.content p, .content ul, .content ol {
    line-height: 1.6em;
    color: #34495e;
}

.content h2 a {
    color: #2c3e50;
}

.content h2 a:hover {
    border-bottom: 2px solid #42b983;
}

.content a {
    color: #42b983;
    font-weight: 600;
}

.copy-right {
    text-align: center;
    padding: 8px;
}

</style>
