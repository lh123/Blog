var crypto = require("crypto");
var pool = require("./pool");

var sql = {
    insert: "insert into article (title,user,content,summary,createTime,lastModify) values (?,?,?,?,?,?)",
    delete: "delete from article where id=?",
    queryById: "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,u.username as user from article as d join user as u on d.user=u.id where d.id = ?",
    queryAll: "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,u.username as user from article as d join user as u on d.user=u.id",
    count: "select count(*) as count from article"
};

function createArticle(title, user, content, summary, tags) {
    var aid = undefined;
    return new Promise((resolve, reject) => {
        var date = new Date();
        pool.query(sql.insert, [title, user, content, summary, date, date], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                aid = results.insertId;
                return resolve(aid);
            }
        });
    })
        .then(articleId => {
            return new Promise((resolve, reject) => {
                var addTags = [];
                getAllTag(aid)
                    .then(etags => {
                        var deleteTags = etags.filter((value) => {
                            if (tags.length === 0) {
                                return true;
                            }
                            return tags.find(ovalue => ovalue.id !== value.id);
                        });
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
                            promise = promise.then(removeTag(aid, value.id));
                        })
                        return promise;
                    })
                    .then(() => resolve(addTags))
                    .catch(err => reject(err));
            })
        })
        .then(tags => {
            if (tags) {
                var queries = [];
                tags.forEach(value => {
                    queries.push(addTag(aid, value.id));
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
        .then(() => {
            return Promise.resolve(aid);
        })
}

function findAllArticle(order, skip, limit) {
    return new Promise((resolve, reject) => {
        var sqlstr = sql.queryAll;
        if (order > 0) {
            sqlstr += " order by d.createTime asc";
        } else {
            sqlstr += " order by d.createTime desc";
        }
        skip = skip || 0;
        limit = limit || 10;
        sqlstr += " limit " + skip + "," + limit;
        pool.query(sqlstr, (err, results) => {
            if (err) {
                return reject(err);
            } else {
                var articles = results;
                pool.query(sql.count, (err, results) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve({
                            articles,
                            total: results[0].count
                        })
                    }
                })
            }
        });
    });
}

function findArticleByTag(tagId) {
    return new Promise((resolve, reject) => {
        var sqlstr = "select d.id,d.title,d.content,d.summary,d.createTime,d.lastModify,u.username as user from article as d join user as u on d.user=u.id where d.id in (select aid from article_tag_links where tid=?) order by d.createTime desc";
        pool.query(sqlstr, tagId, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    });
}

function findArticleById(id) {
    return new Promise((resolve, reject) => {
        pool.query(sql.queryById, [id], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results[0]);
            }
        });
    })
        .then(article => {
            if (!article) {
                return Promise.reject(new Error("id不存在"));
            }
            var articleObj = {};
            articleObj.article = article;
            return getAllTag(id)
                .then(tags => {
                    articleObj.article.tags = tags;
                    return Promise.resolve(articleObj);
                })
        })
        .then(articleObj => {
            return findPreOrNextArticle("pre", id)
                .then(article => {
                    articleObj.preArticle = article;
                    return findPreOrNextArticle("next", id);
                })
                .then(article => {
                    articleObj.nextArticle = article;
                    return Promise.resolve(articleObj);
                })
        });
}

function findPreOrNextArticle(opt, id) {
    return new Promise((resolve, reject) => {
        var sql = undefined;
        if (opt === "next") {
            sql = "select id,title from article where id<? order by createTime desc limit 1";
        } else {
            sql = "select id,title from article where id>? limit 1";
        }
        pool.query(sql, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        })
    });
}



function modify(opt, id) {
    return new Promise((resolve, reject) => {
        var sqlstr = "update article set ";
        var keys = Object.keys(opt);
        var cond = [];
        var values = [];
        keys.forEach(value => {
            if (value !== "tags" && opt[value]) {
                cond.push(value + "=?");
                values.push(opt[value]);
            }
        });
        var tags = opt.tags;
        sqlstr.concat(cond.join(","));
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
            return new Promise((resolve, reject) => {
                var addTags = [];
                getAllTag(id)
                    .then(etags => {
                        var deleteTags = etags.filter((value) => {
                            return tags.find(ovalue => ovalue.id !== value.id);
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

function deleteArticle(id) {
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
        pool.query("delete from article_tag_links where aid=? and tid=?", [aid, tid], (err, results) => {
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
        pool.query("insert into article_tag_links (aid,tid) values (?,?)", [aid, tid], (err, results) => {
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
        pool.query("select b.id,b.name from article_tag_links as a join tag as b on a.tid=b.id where a.aid=?", [aid], (err, results) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(results);
            }
        })
    });
}

module.exports = {
    createArticle,
    findAllArticle,
    findArticleByTag,
    findArticleById,
    modify,
    deleteArticle
}