<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: "app"
}
</script>

<style>
#app {
    width: 100%;
    height: 100%;
}

/* 
.left-nav {
    width: 90px;
    height: 100%;
    display: inline-block;
    top: 0px;
    left: 0px;
    border-right: 1px solid #f1f1f1;
    background-color: #f8f8f8;
    vertical-align: top;
}

.logo {
    margin-top: 20px;
    margin-bottom: 100px;
}

.nav-icon {
    margin-bottom: 50px;
}

.left-nav img {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0px auto;
}

.content {
    vertical-align: top;
    width: calc(100% - 100px);
    height: 100%;
    display: inline-block;
    top: 0px;
    left: 0px;
    border-right: 1px solid #f1f1f1;
    background-color: #f8f8f8;
} */
</style>
