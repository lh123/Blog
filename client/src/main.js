import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:7000";

import "./css/index.css";
new Vue({
    el: "#app",
    router,
    render: h => h(App)
})