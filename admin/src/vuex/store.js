import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import * as type from "./types";

Vue.use(Vuex);

var access_token = localStorage.getItem("access_token");
var refresh_token = localStorage.getItem("refresh_token");
var expires = localStorage.getItem("expires");

var state = {
    access_token,
    refresh_token,
    expires,
}

var mutations = {
    [type.LOGIN_SUCCESS]: function (state, value) {
        state.access_token = value.access_token;
        state.refresh_token = value.refresh_token;
        state.expires = value.expires;
        localStorage.setItem("access_token", state.access_token);
        localStorage.setItem("refresh_token", state.refresh_token);
        localStorage.setItem("expires", state.expires);
    },
    [type.LOGIN_FAIL]: function (state, message) {
        state.access_token = "";
        state.refresh_token = "";
        state.expires = "";
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires");
    },
    [type.LOGIN_OUT]: function (state) {
        state.access_token = "";
        state.refresh_token = "";
        state.expires = "";
    }
}

var store = new Vuex.Store({
    state,
    mutations,
    strict: true
});

export default store;