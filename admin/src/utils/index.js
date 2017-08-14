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

export function _debounce(fn, time) {
    let lastHandler = -1;
    var delay = time || 500;
    return function () {
        var that = this;
        if (lastHandler > 0) {
            clearTimeout(lastHandler);
        }
        lastHandler = setTimeout(fn.bind(that, ...arguments), delay);
    }
}