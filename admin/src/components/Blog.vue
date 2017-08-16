<template>
    <div class="content">
        <nav-side></nav-side>
        <div class="blog-container">
            <h3 class="blog-title">
                博客介绍
            </h3>
            <button type="button" class="btn btn-save" @click="saveInfo">保存</button>
            <textarea id="editor"></textarea>
        </div>
    </div>
</template>

<script>
import NavSide from "./common/NavSide.vue";
import BlogApi from "../api/blog";
import SimpleMDE from "SimpleMDE";
import "../assets/css/markdown.css";
export default {
    data: function () {
        return {
            simplemde: null
        }
    },
    computed: {
        content: {
            get: function () {
                return this.simplemde.value();
            },
            set: function (value) {
                this.simplemde.value(value || "");
            }
        }
    },
    methods: {
        fetchData: function () {
            BlogApi.getBlogInfo()
                .then(info => {
                    this.content = info.content;
                })
                .catch(err => alert(err));
        },
        saveInfo: function () {
            BlogApi.saveBlogInfo(this.content)
                .then(()=>alert("保存成功"))
                .catch(err=>alert(err));
        }
    },
    mounted: function () {
        var self = this;
        this.simplemde = new SimpleMDE({
            element: document.getElementById("editor"),
            spellChecker: false
        });
        this.fetchData();
    },
    beforeDestroy: function () {
        this.simplemde.toTextArea();
    },
    components: {
        NavSide
    }
}
</script>
<style>
.blog-container {
    padding: 16px 16px 0px 25px;
    box-sizing: border-box;
    height: 100%;
    position: relative;
}

.blog-container .btn {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 50px;
}

.blog-title {
    color: #7f8c8d;
    font-weight: 400;
    border-left: 2px solid #42b983;
    margin-bottom: 16px;
}

.editor-container {
    height: calc(100% - 90px - 56px);
}

.CodeMirror {
    height: calc(100% - 110px - 56px);
    min-height: 300px;
}
</style>
