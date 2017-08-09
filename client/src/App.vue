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