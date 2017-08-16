<template>
    <div>
        <header class="top-nav-container">
            <nav class="top-nav">
                <a class="logo">
                    <img src="../../assets/img/logo.png">
                    <span>My Blog</span>
                </a>
                <ul class="nav-item-container">
                    <li class="nav-link-item">
                        <router-link to="/posts" class="nav-link">文章</router-link>
                    </li>
                    <li class="nav-link-item">
                        <router-link to="/tags" class="nav-link">标签</router-link>
                    </li>
                    <li class="nav-link-item">
                        <router-link to="/about" class="nav-link">关于我</router-link>
                    </li>
                </ul>
            </nav>
        </header>
        <header class="mobile-nav-container">
            <nav class="mobile-nav">
                <a class="menu" @click="menuClick"></a>
                <a class="logo"></a>
            </nav>
            <div v-if="isSlideOpen" class="nav-masker" @click="maskClick"></div>
            <div class="sidebar" :class="{open:isSlideOpen}">
                <ul class="sidebar-menu" @click="itemClick">
                    <li>
                        <router-link to="/posts" class="nav-link">文章</router-link>
                    </li>
                    <li>
                        <router-link to="/tags" class="nav-link">标签</router-link>
                    </li>
                    <li>
                        <router-link to="/about" class="nav-link">关于我</router-link>
                    </li>
                </ul>
            </div>
    
        </header>
    </div>
</template>

<script>
export default {
    name: "head-nav",
    data: function () {
        return {
            isSlideOpen: false
        }
    },
    methods: {
        menuClick: function () {
            this.isSlideOpen = !this.isSlideOpen;
        },
        itemClick: function () {
            this.isSlideOpen = !this.isSlideOpen;
        },
        maskClick: function () {
            this.isSlideOpen = false;
        }
    }
}
</script>

<style>
.top-nav-container {
    display: block;
    box-shadow: 0 0 4px rgba(0, 0, 0, .25);
}

.top-nav {
    height: 40px;
    background-color: #fff;
    padding: 10px 60px;
    position: relative;
}

.logo {
    display: inline-block;
    font-size: 1.5em;
    line-height: 40px;
    color: #2c3e50;
    font-family: 'Dosis', 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 500;
}

.logo>img {
    vertical-align: middle;
    margin-right: 6px;
    width: 40px;
    height: 40px;
}

.nav-item-container {
    list-style-type: none;
    margin: 0px;
    padding: 0px;
    position: absolute;
    height: 40px;
    line-height: 40px;
    top: 10px;
    right: 30px;
}

.nav-link-item {
    display: inline-block;
    margin: 0 0.6em;
    cursor: pointer;
}

.nav-link {
    padding-bottom: 3px;
    font-size: 15px;
    margin-left: 10px;
}

.nav-link:hover {
    border-bottom: 3px solid #42b983;
}

.nav-link.active {
    border-bottom: 3px solid #42b983;
}

.mobile-nav-container {
    display: none;
}

.mobile-nav {
    z-index: 9;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 40px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    background-color: #fff;
}

.mobile-nav .logo {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 5px;
    left: 50%;
    margin-left: -15px;
    background: url("../../assets/img/logo.png") center center no-repeat;
    background-size: 30px;
}

.mobile-nav .menu {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 8px;
    left: 12px;
    background: url("../../assets/img/menu.png") center center no-repeat;
    background-size: 24px;
}

.sidebar {
    position: absolute;
    top: 0;
    left: 60px;
    bottom: 0;
    padding: 2.2em 0;
    width: 260px;
    margin-right: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    display: none;
}

.sidebar-menu {
    padding-left: 0px;
    margin-bottom: 20px;
    list-style-type: none;
    line-height: 1.8em;
}

.nav-masker {
    position: fixed;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
}

@media screen and (max-width: 720px) {
    .top-nav-container {
        display: none;
    }
    .mobile-nav-container {
        display: block;
    }
    .sidebar {
        position: fixed;
        background-color: #f9f9f9;
        height: 100%;
        top: 0;
        left: 0;
        padding: 60px 30px 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
        transform: translate(-280px, 0);
        display: block;
    }

    .sidebar.open {
        transform: translate(0, 0);
    }
    .nav-link:hover {
        border-bottom: 3px solid #42b983;
    }

    .nav-link.active {
        border-bottom: 3px solid #42b983;
    }
}
</style>
