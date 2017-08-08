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
                        <a class="nav-link">文章</a>
                    </li>
                    <li class="nav-link-item">
                        <a class="nav-link">标签</a>
                    </li>
                    <li class="nav-link-item">
                        <a class="nav-link">关于我</a>
                    </li>
                </ul>
            </nav>
        </header>
    </div>
</template>

<script>
export default {
    name: "head-nav"
}
</script>

<style>
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

.nav-link-item>a {
    padding-bottom: 3px;
    font-size: 15px;
    margin-left: 10px;
}

.nav-link-item>a:hover {
    border-bottom: 3px solid #42b983;
}
</style>
