

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
    const information = document.getElementById("message");
    if (window.history.length > 1) {
        window.history.back();
    } else {
        information.classList.add("_block");
    }
}

export function Refresh() {
    const path = window.location.pathname;
    window.location.href = path;
}