import marked from "marked";
import highlight from "highlight";

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: function (value) {
        return highlight.highlightAuto(value).value;
    }
})

export function dateFormat(value) {
    var format = function (bit) {
        if (bit < 10) {
            return "0" + bit;
        }
        return bit;
    };
    var date = new Date(value);
    var year = date.getFullYear();
    var month = format(date.getMonth() + 1);
    var day = format(date.getDate());
    var hour = format(date.getHours());
    var min = format(date.getMinutes());
    var sec = format(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export function markdown(str) {
    return marked(str || "");
}