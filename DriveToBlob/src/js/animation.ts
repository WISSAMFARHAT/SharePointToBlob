const fadersleft = document.querySelectorAll(".fade-left");
const fadersright = document.querySelectorAll(".fade-right");
const faderin = document.querySelectorAll(".fadein");

const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -100px 0px"
}

const appearScroll = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {

        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add("_appear");
            appearScroll.unobserve(entry.target);
        }
    });
},
    appearOptions
);

if (fadersleft) {
    fadersleft.forEach(fader => {
        appearScroll.observe(fader);
    })
}
  
if (fadersright) {
    fadersright.forEach(fader => {
        appearScroll.observe(fader);
    })
}

if (faderin) {
    faderin.forEach(fader => {
        appearScroll.observe(fader);
    })
}


