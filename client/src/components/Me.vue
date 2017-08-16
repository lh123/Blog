<template>
    <div>
        <div class="content">
            <p class="markdown" v-html="markdownContent"></p>
        </div>
    </div>
</template>

<script>
import { markdown, dateFormat } from "../utils/index";
import MeApi from "../api/me";
export default {
    name:"me",
    data:function(){
        return {
            content: ""
        }
    },
    computed:{
        markdownContent:function(){
            return markdown(this.content);
        }
    },
    mounted: function(){
        MeApi.getBlogInfo()
            .then(info =>{
                this.content = info.content;
            })
            .catch(err => alert(err));
    }
}
</script>
