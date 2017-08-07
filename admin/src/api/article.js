import axios from "axios";
import store from "../vuex/store";

var getArticleList = function (tagname) {
    return axios.get("/api/articleList", { params: { tag: tagname } })
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data.articles);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("网络错误"));
            }
        });
}

var getArticleDetail = function (id) {
    return axios.get("/api/articleDetail?id=" + id)
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve(res.data.data);
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("网络错误"));
            }
        });
}

// var title = req.body.title;
// var userId = req.body.user._id;
// var content = req.body.content;
// var tags = req.body.tags;
// var hidden = req.body.hidden;
// var isPublic = req.body.isPublic;
var saveArticle = function (id, title, content, tags, hidden, isDraft) {
    var access_token = store.state.access_token;
    if (id === undefined) {
        return axios.post("/api/saveArticle", { title, content, tags, hidden, isDraft }, { params: { access_token } })
            .catch(err => Promise.reject(new Error("网络错误")))
            .then(res => {
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        return Promise.resolve(res.data.data);
                    } else {
                        return Promise.reject(new Error(res.data.msg));
                    }
                } else {
                    return Promise.reject(new Error("网络错误"));
                }
            });
    } else {
        return axios.post("/api/modifyArticle", { title, content, tags, hidden, isDraft }, { params: { access_token, id } })
            .catch(err => Promise.reject(new Error("网络错误")))
            .then(res => {
                if (res.status === 200) {
                    if (res.data.code === 0) {
                        return Promise.resolve();
                    } else {
                        return Promise.reject(new Error(res.data.msg));
                    }
                } else {
                    return Promise.reject(new Error("网络错误"));
                }
            });
    }

}

var deleteArticle = function (id) {
    var access_token = store.state.access_token;
    return axios.get("/api/deleteArticle", { params: { access_token, id } })
        .catch(err => Promise.reject(new Error("网络错误")))
        .then(res => {
            if (res.status === 200) {
                if (res.data.code === 0) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(new Error(res.data.msg));
                }
            } else {
                return Promise.reject(new Error("网络错误"));
            }
        })
}

export default {
    getArticleList,
    getArticleDetail,
    saveArticle,
    deleteArticle
}