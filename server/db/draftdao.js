var crypto = require("crypto");
var pool = require("./pool");

var sql = {
    insert: "insert into draft (title,user,content,summary,createTime,lastModify) values (?,?,?,?,?,?)",
    delete: "delete from draft where id=?",
    queryById: "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,d.article,d.isPublish,u.username as user from draft as d join user as u on d.user=u.id where d.id = ?",
    queryAll: "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,d.article,d.isPublish,u.username as user from draft as d join user as u on d.user=u.id"
};

function createDraft(title, user, content, summary) {
    return new Promise((resolve, reject) => {
        var date = new Date();
        pool.query(sql.insert, [title, user, content, summary, date, date], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results.insertId);
            }
        });
    });
}

function findAllDraft(order) {
    return new Promise((resolve, reject) => {
        var sqlstr = sql.queryAll;
        if (order > 0) {
            sqlstr += " order by d.lastModify asc";
        } else {
            sqlstr += " order by d.lastModify desc";
        }
        pool.query(sqlstr, (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });
}

function findDraftById(id) {
    return new Promise((resolve, reject) => {
        pool.query(sql.queryById, [id], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results[0]);
            }
        });
    })
        .then(draft => {
            return getAllTag(id)
                .then(tags => {
                    draft.tags = tags
                    return Promise.resolve(draft);
                })
        })
}

function findDraftByTag(tagId){
    return new Promise((resolve, reject) => {
        var sqlstr = "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,d.article,d.isPublish,u.username as user from draft as d join user as u on d.user=u.id where d.id in (select aid from draft_tag_links where tid=?) order by lastModify desc";
        pool.query(sqlstr,tagId,(err,results)=>{
            if(err){
                return reject(err);
            }
            return resolve(results);
        })
    });
}

function modify(opt, id) {
    return new Promise((resolve, reject) => {
        var sqlstr = "update draft set ";
        var keys = Object.keys(opt);
        var cond = [];
        var values = [];
        keys.forEach(value => {
            if (value !== "tags" && opt[value] !== undefined) {
                cond.push(value + "=?");
                values.push(opt[value]);
            }
        });
        var tags = opt.tags;
        sqlstr += cond.join(",") + " where id=?";
        pool.query(sqlstr, values.concat(id), (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(tags);
            }
        });
    })
        .then(tags => {
            if (tags) {
                return new Promise((resolve, reject) => {
                    var addTags = [];
                    getAllTag(id)
                        .then(etags => {
                            var deleteTags = [];
                            etags.forEach(value => {
                                if(!tags.find(newValue => newValue.id === value.id)){
                                    deleteTags.push(value);
                                }
                            })
                            tags.forEach(value => {
                                if (!etags.find(dvalue => dvalue.id === value.id)) {
                                    addTags.push(value);
                                }
                            });
                            return Promise.resolve(deleteTags);
                        })
                        .then(deleteTags => {
                            var promise = Promise.resolve();
                            deleteTags.forEach(value => {
                                promise = promise.then(removeTag(id, value.id));
                            })
                            return promise;
                        })
                        .then(() => resolve(addTags))
                        .catch(err => reject(err));
                })
            }else{
                return Promise.resolve();
            }
        })
        .then(tags => {
            if (tags) {
                var queries = [];
                tags.forEach(value => {
                    queries.push(addTag(id, value.id));
                });
                var promise = Promise.resolve();
                queries.forEach(value => {
                    promise = promise.then(value);
                })
                return promise;
            } else {
                return Promise.resolve();
            }
        })
}

function deleteDraft(id) {
    return new Promise((resolve, reject) => {
        pool.query(sql.delete, [id], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });
}

function removeTag(aid, tid) {
    return new Promise((resolve, reject) => {
        pool.query("delete from draft_tag_links where aid=? and tid=?", [aid, tid], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });
}

function addTag(aid, tid) {
    return new Promise((resolve, reject) => {
        pool.query("insert into draft_tag_links (aid,tid) values (?,?)", [aid, tid], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        });
    });
}

function getAllTag(aid) {
    return new Promise((resolve, reject) => {
        pool.query("select b.id,b.name from draft_tag_links as a join tag as b on a.tid=b.id where a.aid=?", [aid], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        })
    });
}

module.exports = {
    createDraft,
    findAllDraft,
    findDraftById,
    findDraftByTag,
    modify,
    deleteDraft
}