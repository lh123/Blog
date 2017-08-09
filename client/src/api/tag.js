import axios from "axios";

function getAllTag() {
    return axios.get("/api/tagList")
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.reject(res.data.msg);
                }
            } else {
                return Promise.reject("未知错误");
            }
        })
        .catch(err => Promise.reject("网络错误"));
}

function getArticleListWithTag(id) {
    return axios.get("/api/articleList", { params: { tag: id } })
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.reject(res.data.msg);
                }
            } else {
                return Promise.reject("未知错误");
            }
        })
        .catch(err => Promise.reject("网络错误"));
}

export default {
    getAllTag,
    getArticleListWithTag
}