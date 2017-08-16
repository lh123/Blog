import axios from "axios";
import store from "../vuex/store";

var getBlogInfo = function () {
    return axios.get("/api/blogInfo")
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("未知错误"))
            }
        });
};

var saveBlogInfo = function (content) {
    var access_token = store.state.access_token;
    return axios.post("/api/saveBlogInfo", { content }, { params: { access_token } })
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.msg);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("未知错误"))
            }
        });
}

export default {
    getBlogInfo,
    saveBlogInfo
}