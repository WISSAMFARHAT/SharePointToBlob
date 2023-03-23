
window.onscroll = function (event) {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop;

    if (scrollTop > 55) {
        document.querySelector("html").classList.add("_scroll");

    } else {
        document.querySelector("html").classList.remove("_scroll");
    }
}


export function scrollToSection(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'start'
    });
}



export function Return() {
    //const path = window.location.pathname;
    //let parts = path.split("/");
    //let newpath = parts.slice(0, -1).join("/") + "/";

    //window.location.href = newpath;
    window.history.back();
}

export function Refresh() {
    const path = window.location.pathname;
    window.location.href = path;
}