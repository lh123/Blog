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

var searchTag = function (name) {
    return axios.get("/api/tagList", { params: { "start-with": name } })
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

var createTag = function (name) {
    var access_token = store.state.access_token;
    return axios.post("/api/createTag", { name }, { params: { access_token } })
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

var modifyTag = function (id, name) {
    var access_token = store.state.access_token;
    return axios.post("/api/modifyTag", { name }, { params: { access_token, id } })
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
        })
}

export default {
    getTags,
    searchTag,
    createTag,
    deleteTag,
    modifyTag
}