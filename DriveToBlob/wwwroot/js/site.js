var exports = {};
"use strict";
exports.__esModule = true;
exports.Refresh = exports.Return = exports.scrollToSection = void 0;
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
function Return() {
    //const path = window.location.pathname;
    //let parts = path.split("/");
    //let newpath = parts.slice(0, -1).join("/") + "/";
    //window.location.href = newpath;
    window.history.back();
}
exports.Return = Return;
function Refresh() {
    var path = window.location.pathname;
    window.location.href = path;
}
exports.Refresh = Refresh;


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUs7SUFDN0IsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUNuQyxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBRTlCLElBQUksU0FBUyxHQUFHLEVBQUUsRUFBRTtRQUNoQixRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7S0FFM0Q7U0FBTTtRQUNILFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5RDtBQUNMLENBQUMsQ0FBQTtBQUdELFNBQWdCLGVBQWUsQ0FBQyxFQUFFO0lBQzlCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztRQUNuQixLQUFLLEVBQUUsT0FBTztRQUNkLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO0tBQ2xCLENBQUMsQ0FBQztBQUNQLENBQUM7QUFQRCwwQ0FPQztBQUlELFNBQWdCLE1BQU07SUFDbEIsd0NBQXdDO0lBQ3hDLDhCQUE4QjtJQUM5QixtREFBbUQ7SUFFbkQsaUNBQWlDO0lBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQVBELHdCQU9DO0FBRUQsU0FBZ0IsT0FBTztJQUNuQixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEMsQ0FBQztBQUhELDBCQUdDIiwiZmlsZSI6InNpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxud2luZG93Lm9uc2Nyb2xsID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gICAgdmFyIHNjcm9sbFRvcCA9IGRvYy5zY3JvbGxUb3A7XHJcblxyXG4gICAgaWYgKHNjcm9sbFRvcCA+IDU1KSB7XHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuY2xhc3NMaXN0LmFkZChcIl9zY3JvbGxcIik7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5jbGFzc0xpc3QucmVtb3ZlKFwiX3Njcm9sbFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUb1NlY3Rpb24oaWQpIHtcclxuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XHJcbiAgICAgICAgYmxvY2s6ICdzdGFydCcsXHJcbiAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxyXG4gICAgICAgIGlubGluZTogJ3N0YXJ0J1xyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFJldHVybigpIHtcclxuICAgIC8vY29uc3QgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgIC8vbGV0IHBhcnRzID0gcGF0aC5zcGxpdChcIi9cIik7XHJcbiAgICAvL2xldCBuZXdwYXRoID0gcGFydHMuc2xpY2UoMCwgLTEpLmpvaW4oXCIvXCIpICsgXCIvXCI7XHJcblxyXG4gICAgLy93aW5kb3cubG9jYXRpb24uaHJlZiA9IG5ld3BhdGg7XHJcbiAgICB3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSZWZyZXNoKCkge1xyXG4gICAgY29uc3QgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aDtcclxufSJdfQ==
