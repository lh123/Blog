import axios from "axios";
import store from "../vuex/store";
import { LOGIN_SUCCESS, LOGIN_OUT, LOGIN_FAIL } from "../vuex/types";

var login = function (username, password) {
    return axios.post("/oauth/login", { username, password })
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    var oauth = {};
                    oauth.access_token = res.data.data.access_token;
                    oauth.refresh_token = res.data.data.refresh_token;
                    oauth.expires = res.data.data.expires;
                    store.commit(LOGIN_SUCCESS, oauth);
                    return Promise.resolve(oauth);
                } else {
                    store.commit(LOGIN_FAIL);
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("网络错误"));
            }
        });
}

var refreshToken = function () {
    return axios.get("/oauth/refresh_token?refresh_token=" + store.state.refresh_token)
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    var oauth = {};
                    oauth.access_token = res.data.data.access_token;
                    oauth.refresh_token = res.data.data.refresh_token;
                    oauth.expires = res.data.data.expires;
                    store.commit(LOGIN_SUCCESS, oauth);
                    return Promise.resolve(oauth);
                } else {
                    store.commit(LOGIN_FAIL);
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("网络错误"));
            }
        });
}

var loginOut = function () {
    store.commit(LOGIN_OUT);
    return Promise.resolve();
}

export default {
    login,
    refreshToken,
    loginOut
}