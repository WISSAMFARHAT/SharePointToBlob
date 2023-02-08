var exports = {};
"use strict";
exports.__esModule = true;
exports.scrollToSection = void 0;
window.onscroll = function (event) {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop;
    if (scrollTop > 55) {
        document.querySelector("html").classList.add("_scroll");
    }
    else {
        document.querySelector("html").classList.remove("_scroll");
    }
};
function scrollToSection(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
        inline: 'start'
    });
}
exports.scrollToSection = scrollToSection;


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUs7SUFDN0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUNuQyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBRTlCLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNoQixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFM0Q7U0FBTTtRQUNILFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5RDtBQUNMLENBQUMsQ0FBQTtBQUdELFNBQWdCLGVBQWUsQ0FBQyxFQUFFO0lBQzlCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNuQixLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO0tBQ2xCLENBQUMsQ0FBQztBQUNQLENBQUM7QUFQRCwwQ0FPQyIsImZpbGUiOiJzaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbndpbmRvdy5vbnNjcm9sbCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuICAgIHZhciBzY3JvbGxUb3AgPSBkb2Muc2Nyb2xsVG9wO1xyXG5cclxuICAgIGlmIChzY3JvbGxUb3AgPiA1NSkge1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJodG1sXCIpLmNsYXNzTGlzdC5hZGQoXCJfc2Nyb2xsXCIpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuY2xhc3NMaXN0LnJlbW92ZShcIl9zY3JvbGxcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG9TZWN0aW9uKGlkKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgIGJsb2NrOiAnc3RhcnQnLFxyXG4gICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyxcclxuICAgICAgICBpbmxpbmU6ICdzdGFydCdcclxuICAgIH0pO1xyXG59XHJcblxyXG4iXX0=
