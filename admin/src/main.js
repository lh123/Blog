import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import axios from "axios";
import "./assets/css/base.css";
import store from "./vuex/store";
import router from "./router/router";
import { LOGIN_SUCCESS } from "./vuex/types";
import LoginApi from "./api/login";

// axios.defaults.baseURL = "http://blog-server.azurewebsites.net";
// axios.defaults.baseURL = "http://localhost:7000";

new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});