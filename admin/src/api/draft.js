import axios from "axios";
import store from "../vuex/store";

var getDraftList = function (tagname) {
    var access_token = store.state.access_token;
    return axios.get("/api/draftsList", { params: { tag: tagname, access_token } })
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

var getDraftDetail = function (id) {
    var access_token = store.state.access_token;
    return axios.get("/api/draftDetail", { params: { id, access_token } })
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
var saveDraft = function (id, title, content, tags) {
    var access_token = store.state.access_token;
    return axios.post("/api/modifyDraft", { title, content, tags }, { params: { access_token, id } })
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

var publishDraft = function (id) {
    var access_token = store.state.access_token;
    return axios.post("/api/publish", undefined, { params: { access_token, draftId: id } })
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
        })
}

var deleteDraft = function (id) {
    var access_token = store.state.access_token;
    return axios.post("/api/deleteDraft", undefined, { params: { access_token, id } })
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
};

var createDraft = function (title) {
    var access_token = store.state.access_token;
    return axios.post("/api/createDrafts", { title }, { params: { access_token } })
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

export default {
    getDraftList,
    getDraftDetail,
    saveDraft,
    publishDraft,
    deleteDraft,
    createDraft
}