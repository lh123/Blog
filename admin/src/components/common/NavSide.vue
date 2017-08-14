<template>
    <div class="side-nav">
        <img class="logo" src="../../assets/img/logo.png" alt="logo">
        <div class="nav">
            <ul class="top-menu">
                <li>
                    <router-link to="/posts" class="nav-link">
                        <i class="fa fa-book"></i>
                    </router-link>
                </li>
                <li>
                    <router-link to="/tags" class="nav-link">
                        <i class="fa fa-tags"></i>
                    </router-link>
                </li>
                <li>
                    <router-link to="/user" class="nav-link">
                        <i class="fa fa-user"></i>
                    </router-link>
                </li>
            </ul>
            <ul class="bottom-menu">
                <li>
                    <a class="nav-link">
                        <i class="fa fa-sign-out"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: "nav-side"
}
</script>
<style>
.side-nav {
    width: 70px;
    height: 100%;
    background-color: #f8f8f8;
    text-align: center;
    color: white;
    position: fixed;
    padding: 12px 12px 24px 12px;
    border-right: 1px solid #ececec;
    left: 0;
    top: 0;
    box-sizing: border-box;
    z-index: 9;
}

.side-nav .bottom-menu {
    position: absolute;
    display: block;
    bottom: 0;
}

.side-nav .nav {
    margin-top: 30px;
}

.side-nav ul>li {
    padding: 20px 0;
}

.side-nav .logo {
    width: 36px;
    margin-top: 5px;
}

.side-nav .nav-link {
    width: 45px;
    height: 45px;
    cursor: pointer;
    display: block;
    color: #42b983;
    padding-top: 10px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid #ececec;
}

.side-nav .nav-link:hover,
.side-nav .nav-link.active {
    border: 1px solid #42b983;
}

.side-nav .fa {
    font-size: 25px;
}
</style>
