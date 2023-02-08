
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

