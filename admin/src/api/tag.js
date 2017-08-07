import axios from "axios";
import store from "../vuex/store";

var getTags = function () {
    return axios.get("/api/tagList")
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("未知错误"));
            }
        });
};

var addTag = function (name) {
    var access_token = store.state.access_token;
    return axios.post("/api/addTag", { name }, { params: { access_token } })
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.msg);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("未知错误"));
            }
        })
};

var deleteTag = function (id) {
    var access_token = store.state.access_token;
    return axios.post("/api/deleteTag", { id }, { params: { access_token } })
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.msg);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("未知错误"));
            }
        })
}

export default {
    getTags,
    addTag,
    deleteTag
}