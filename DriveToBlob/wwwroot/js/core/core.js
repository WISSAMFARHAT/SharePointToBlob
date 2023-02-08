var exports = {};
var loadImageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.getAttribute('data-src') !== undefined) {
            var src = entry.target.getAttribute('data-src');
            entry.target.setAttribute('src', src);
            entry.target.removeAttribute('data-src');
            loadImageObserver.unobserve(entry.target);
        }
    });
});
var CoreMain = (function () {
    function CoreMain() {
    }
    CoreMain.reinitializeLazyLoadingImages = function () {
        document.querySelectorAll('img[data-src]').forEach(function (element) {
            loadImageObserver.unobserve(element);
            loadImageObserver.observe(element);
        });
    };
    CoreMain.preventScrolling = function () {
        var width = document.body.offsetWidth;
        $('html').addClass('_noscroll');
        var scrollWidth = document.body.offsetWidth - width;
        if (scrollWidth > 0) {
            document.body.style.marginRight = scrollWidth + 'px';
            var header = document.querySelector('body > header');
            if (header !== null)
                header.style.right = scrollWidth + 'px';
        }
    };
    CoreMain.allowScrolling = function () {
        $('html').removeClass('_noscroll');
        document.body.style.marginRight = null;
        var header = document.querySelector('body > header');
        if (header !== null)
            header.style.right = null;
    };
    CoreMain.scrollTo = function (scroll, scrollDuration) {
        if (typeof scroll === 'object')
            scroll = window.pageYOffset + scroll.getBoundingClientRect().y;
        var scrollTo = scroll;
        var cosParameter = (window.pageYOffset - scrollTo) / 2;
        var scrollCount = 0;
        var oldTimestamp = window.performance.now();
        function step(newTimestamp) {
            var tsDiff = newTimestamp - oldTimestamp;
            if (tsDiff > 100)
                tsDiff = 30;
            scrollCount += Math.PI / (scrollDuration / tsDiff);
            if (scrollCount >= Math.PI)
                return;
            var moveStep = Math.round(scrollTo + cosParameter + cosParameter * Math.cos(scrollCount));
            window.scrollTo(0, moveStep);
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    };
    return CoreMain;
}());
{ CoreMain };
CoreMain.reinitializeLazyLoadingImages();
var CoreString = (function () {
    function CoreString() {
    }
    CoreString.randomLetters = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    CoreString.randomNumbers = function (length) {
        var result = "";
        var characters = "012345678911";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    CoreString.random = function (length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    };
    return CoreString;
}());
{ CoreString };
var CoreStack = (function () {
    function CoreStack() {
    }
    CoreStack.mountAll = function () {
        var currentClass = this;
        $(".stack:not(.stackclone)").each(function () {
            currentClass.mount(this);
        });
    };
    CoreStack.mount = function (parent) {
        var currentClass = this;
        var clonedId = "stackclone" + Math.random();
        var clonedParent = $(parent).clone();
        var parentContainer = $('<div id="' + clonedId + '"></div>');
        $("body").append(parentContainer);
        parentContainer.append(clonedParent);
        clonedParent.parent().css({
            position: "absolute",
            top: "-200px"
        });
        clonedParent.find("> *, .stack-keep, .stack-shy").each(function () {
            $(this).css({
                display: ""
            });
        });
        clonedParent.addClass("stackclone");
        clonedParent.css({
            display: "flex"
        });
        clonedParent.children().each(function (index) {
            $(this).width($(parent)
                .children()
                .eq(index)
                .outerWidth(true));
        });
        $(parent)
            .find("> *, .stack-keep, .stack-shy")
            .show();
        if (this.isParentLargerThanVisibleItems(clonedParent[0], parent)) {
            parentContainer.remove();
            return;
        }
        $(clonedParent)
            .find("> *, .stack-keep")
            .show();
        $(clonedParent)
            .find(".stack-shy")
            .hide();
        $(parent)
            .find("> *, .stack-keep")
            .show();
        $(parent)
            .find(".stack-shy")
            .hide();
        if (this.isParentLargerThanVisibleItems(clonedParent[0], parent)) {
            parentContainer.remove();
            return;
        }
        clonedParent.children().each(function () {
            clonedParent.prepend(this);
        });
        var totalChildren = $(parent).children().length;
        clonedParent.children().each(function (index) {
            if (currentClass.isParentLargerThanVisibleItems(clonedParent[0], parent))
                return;
            if (!$(this).is(":visible") || $(this).hasClass("stack-keep"))
                return;
            $(this).hide();
            $(parent)
                .children()
                .eq(totalChildren - 1 - index)
                .hide();
        });
        parentContainer.remove();
    };
    CoreStack.isParentLargerThanVisibleItems = function (clonedParent, realParent) {
        return $(realParent).innerWidth() >= $(clonedParent).innerWidth();
    };
    return CoreStack;
}());
{ CoreStack };
CoreStack.mountAll();
$(window).on("load", function () {
    CoreStack.mountAll();
});
$(window).resize(function () {
    CoreStack.mountAll();
    setTimeout(function () { CoreStack.mountAll(); }, 10);
});
var CorePopup = (function () {
    function CorePopup() {
    }
    Object.defineProperty(CorePopup, "selector", {
        get: function () {
            return "body > .popup";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePopup, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CorePopup, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    CorePopup.onContentLoaded = function (callback) {
        this._contentLoadedCallBack = callback;
    };
    CorePopup.open = function (content, settings) {
        if (this.isOpened)
            this.close();
        if (content === undefined)
            content = "loading...";
        if (settings === undefined)
            settings = new CorePopupSettings();
        var html = "\n            <aside class=\"popup\">\n                <div class=\"popup-content\">" +
            content +
            "</div>\n            </aside>";
        $("body").append(html);
        CoreMain.preventScrolling();
        var contentElement = this.element.find(".popup-content");
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
        if (!settings.preventClose) {
            CorePopup.element.css("cursor", "pointer");
            $(this.selector).click(function (e) {
                if (!contentElement.is(e.target) &&
                    contentElement.has(e.target).length === 0)
                    CorePopup.close();
            });
        }
        window.history.pushState("forward", null, "");
    };
    CorePopup.close = function () {
        this.softClose();
        window.history.back();
    };
    CorePopup.softClose = function () {
        CoreMain.allowScrolling();
        this.element.remove();
    };
    CorePopup.updateContent = function (content) {
        if (!this.isOpened)
            throw new Error("Open popup before setting its content.");
        this.element.find(".popup-content").html(content);
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
    };
    return CorePopup;
}());
{ CorePopup };
var CorePopupSettings = (function () {
    function CorePopupSettings() {
        this.preventClose = false;
    }
    return CorePopupSettings;
}());
{ CorePopupSettings };
$(window).on("popstate", function () {
    if (CorePopup.isOpened)
        CorePopup.softClose();
});
var CoreMessage = (function () {
    function CoreMessage() {
    }
    Object.defineProperty(CoreMessage, "selector", {
        get: function () {
            return "body > .popup .message";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreMessage, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreMessage, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    CoreMessage.open = function (title, description, buttons) {
        var buttonsHtml = "";
        buttons.forEach(function (button, index) {
            var id = CoreString.randomLetters(20);
            var buttonElement = $("<button id='" +
                id +
                "' class=\"message-button\">" +
                button.content +
                "</button>");
            if (button.method !== undefined)
                $(document).on("click", "#" + id, button.method);
            $(document).on("click", "#" + id, function () {
                CoreMessage.close();
            });
            buttonsHtml += buttonElement[0].outerHTML;
        });
        var html = "\n            <div class=\"message\">\n                <div class=\"message-content\">\n                    <p class=\"message-title\">" +
            title +
            "</p>\n                    <p class=\"message-description\">" +
            description +
            "</p>\n                    <div class=\"message-buttons\">" +
            buttonsHtml +
            "</div>\n                </div>\n            </div>";
        CorePopup.open(html, {
            preventClose: false
        });
        CoreMessage.element
            .find(".message-button")
            .first()
            .focus();
    };
    CoreMessage.close = function () {
        CorePopup.close();
    };
    CoreMessage.click = function () {
        this.element.find(".message-button:focus").click();
    };
    CoreMessage.selectPreviousButton = function () {
        var selected = this.element.find(".message-button:focus");
        if (selected.length === 0) {
            CoreMessage.element
                .find(".message-button")
                .first()
                .focus();
            return;
        }
        var previous = selected.not(":hidden").prev();
        if (previous.length > 0)
            previous.focus();
    };
    CoreMessage.selectNextButton = function () {
        var selected = this.element.find(".message-button:focus");
        if (selected.length === 0) {
            this.element
                .find(".message-button")
                .first()
                .focus();
            return;
        }
        var next = selected.not(":hidden").next();
        if (next.length > 0)
            next.focus();
    };
    return CoreMessage;
}());
{ CoreMessage };
var CoreMessageButton = (function () {
    function CoreMessageButton(content, method) {
        this.content = content;
        this.method = method;
    }
    return CoreMessageButton;
}());
{ CoreMessageButton };
$(document).on("keydown", document, function (eventObject) {
    if (CoreMessage.isOpened)
        switch (eventObject.keyCode) {
            case 13:
                CoreMessage.click();
                break;
            case 27:
                CoreMessage.close();
                break;
            case 37:
                CoreMessage.selectPreviousButton();
                break;
            case 39:
                CoreMessage.selectNextButton();
                break;
            default:
                break;
        }
});
var CoreSideBar = (function () {
    function CoreSideBar() {
    }
    Object.defineProperty(CoreSideBar, "selector", {
        get: function () {
            return 'body > .sidebar';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreSideBar, "element", {
        get: function () {
            return $(this.selector);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CoreSideBar, "isOpened", {
        get: function () {
            return $(this.selector).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    CoreSideBar.updateWindowsWidthPropertyValue = function () {
        this.WindowsWidth = $(window).width();
    };
    CoreSideBar.onContentLoaded = function (callback) {
        this._contentLoadedCallBack = callback;
    };
    CoreSideBar.open = function (content) {
        if (this.isOpened)
            this.close();
        window.history.pushState('forward', null, '');
        if (content === undefined)
            content = 'Loading...';
        var html = "\n        <aside class=\"sidebar\">\n            <div class=\"sidebar-void\">\n\n            </div>\n            <div class=\"sidebar-load\">\n                <div class=\"sidebar-header\">\n                    <div>\n                        <div class=\"sidebar-back\"></div>\n                        <div class=\"sidebar-title\"></div>\n                        <div class=\"sidebar-close\">\n                            <svg viewBox=\"0 0 40 40\">\n                                <line style=\"fill: none; stroke: #000; stroke-miterlimit: 10;\" x1=\"11.43\" y1=\"11.26\" x2=\"28.46\" y2=\"28.29\"></line>\n                                <line style=\"fill: none; stroke: #000; stroke-miterlimit: 10;\" x1=\"11.43\" y1=\"28.29\" x2=\"28.46\" y2=\"11.26\"></line>\n                            </svg>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"sidebar-content\">"
            +
                content
            +
                "</div>\n            </div>\n        </aside>\n        ";
        $('body').append(html);
        CoreMain.preventScrolling();
        if (this.HeaderHeight === undefined)
            this.element.find('.sidebar-header').height($('header').height() + 'px');
        else
            this.element.find('.sidebar-header').height(this.HeaderHeight);
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
        CoreSideBar.updateWindowsWidthPropertyValue();
        $('.sidebar-void, .sidebar-header').click(function () {
            CoreSideBar.close();
        });
    };
    CoreSideBar.close = function () {
        this.softClose();
        window.history.back();
    };
    CoreSideBar.softClose = function () {
        CoreMain.allowScrolling();
        this.element.remove();
    };
    CoreSideBar.updateContent = function (content) {
        if (!this.isOpened)
            throw new Error('Open sidebar before setting its content');
        this.element.find('.sidebar-content').html(content);
        if (this._contentLoadedCallBack !== undefined)
            this._contentLoadedCallBack();
    };
    return CoreSideBar;
}());
{ CoreSideBar };
CoreSideBar.updateWindowsWidthPropertyValue();
$(document).on('click', 'body > .sidebar .sidebar-content a', function () {
    CoreSideBar.close();
});
$(window).on("popstate", function () {
    if (CoreSideBar.isOpened)
        CoreSideBar.softClose();
});
$(window).resize(function () {
    if ($(this).width() !== CoreSideBar.WindowsWidth) {
        CoreSideBar.WindowsWidth = $(this).width();
        if (CoreSideBar.isOpened)
            CoreSideBar.close();
    }
});
$(window).on("load", function () {
    if (CoreSideBar.isOpened)
        CoreSideBar.close();
});
$(document).on('click', 'a[href*="#"]:not([href="#"])', function () {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length)
            CoreMain.scrollTo(target[0], 200);
        return false;
    }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUM7UUFDMUIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUV6RSxJQUFJLE1BQU0sQ0FBQyxNQUFNO1lBQ2IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsT0FBTyxLQUFLLENBQUM7S0FDaEI7QUFDTCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNvbnN0IGxvYWRJbWFnZU9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKChlbnRyaWVzKTogdm9pZCA9PiB7XHJcblxyXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nICYmIGVudHJ5LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3JjJykgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3JjID0gZW50cnkudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKTtcclxuXHJcbiAgICAgICAgICAgIGVudHJ5LnRhcmdldC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyk7XHJcbiAgICAgICAgICAgIGVudHJ5LnRhcmdldC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtc3JjJyk7XHJcblxyXG4gICAgICAgICAgICBsb2FkSW1hZ2VPYnNlcnZlci51bm9ic2VydmUoZW50cnkudGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVNYWluIHtcclxuXHJcbiAgICBzdGF0aWMgcmVpbml0aWFsaXplTGF6eUxvYWRpbmdJbWFnZXMoKSB7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLXNyY10nKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBsb2FkSW1hZ2VPYnNlcnZlci51bm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGxvYWRJbWFnZU9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHByZXZlbnRTY3JvbGxpbmcoKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aDtcclxuICAgICAgICAkKCdodG1sJykuYWRkQ2xhc3MoJ19ub3Njcm9sbCcpO1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbFdpZHRoID0gZG9jdW1lbnQuYm9keS5vZmZzZXRXaWR0aCAtIHdpZHRoO1xyXG5cclxuICAgICAgICBpZiAoc2Nyb2xsV2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubWFyZ2luUmlnaHQgPSBzY3JvbGxXaWR0aCArICdweCc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSA+IGhlYWRlcicpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGhlYWRlciAhPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS5yaWdodCA9IHNjcm9sbFdpZHRoICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFsbG93U2Nyb2xsaW5nKCk6IHZvaWQge1xyXG5cclxuICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ19ub3Njcm9sbCcpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubWFyZ2luUmlnaHQgPSBudWxsO1xyXG5cclxuICAgICAgICBjb25zdCBoZWFkZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keSA+IGhlYWRlcicpO1xyXG4gICAgICAgIGlmIChoZWFkZXIgIT09IG51bGwpXHJcbiAgICAgICAgICAgIGhlYWRlci5zdHlsZS5yaWdodCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNjcm9sbFRvKHNjcm9sbDogRWxlbWVudCB8IG51bWJlciwgc2Nyb2xsRHVyYXRpb246IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHNjcm9sbCA9PT0gJ29iamVjdCcpXHJcbiAgICAgICAgICAgIHNjcm9sbCA9IHdpbmRvdy5wYWdlWU9mZnNldCArIChzY3JvbGwgYXMgRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG86IG51bWJlciA9IHNjcm9sbCBhcyBudW1iZXI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRGVjbGFyYXRpb25zXHJcblxyXG4gICAgY29uc3QgY29zUGFyYW1ldGVyID0gKHdpbmRvdy5wYWdlWU9mZnNldCAtIHNjcm9sbFRvKSAvIDI7XHJcbiAgICBsZXQgc2Nyb2xsQ291bnQgPSAwO1xyXG4gICAgbGV0IG9sZFRpbWVzdGFtcCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChuZXdUaW1lc3RhbXA6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRzRGlmZiA9IG5ld1RpbWVzdGFtcCAtIG9sZFRpbWVzdGFtcDtcclxuXHJcbiAgICAgICAgICAgIC8vIFBlcmZvcm1hbmNlLm5vdygpIHBvbHlmaWxsIGxvYWRzIGxhdGUgc28gcGFzc2VkLWluIHRpbWVzdGFtcCBpcyBhIGxhcmdlciBvZmZzZXRcclxuICAgICAgICAgICAgLy8gb24gdGhlIGZpcnN0IGdvLXRocm91Z2ggdGhhbiB3ZSB3YW50IHNvIEknbSBhZGp1c3RpbmcgdGhlIGRpZmZlcmVuY2UgZG93biBoZXJlLlxyXG4gICAgICAgICAgICAvLyBSZWdhcmRsZXNzLCB3ZSB3b3VsZCByYXRoZXIgaGF2ZSBhIHNsaWdodGx5IHNsb3dlciBhbmltYXRpb24gdGhhbiBhIGJpZyBqdW1wIHNvIGEgZ29vZFxyXG4gICAgICAgICAgICAvLyBzYWZlZ3VhcmQsIGV2ZW4gaWYgd2UncmUgbm90IHVzaW5nIHRoZSBwb2x5ZmlsbC5cclxuXHJcbiAgICAgICAgICAgIGlmICh0c0RpZmYgPiAxMDApXHJcbiAgICAgICAgICAgICAgICB0c0RpZmYgPSAzMDtcclxuXHJcbiAgICAgICAgICAgIHNjcm9sbENvdW50ICs9IE1hdGguUEkgLyAoc2Nyb2xsRHVyYXRpb24gLyB0c0RpZmYpO1xyXG5cclxuICAgICAgICAgICAgLy8gQXMgc29vbiBhcyB3ZSBjcm9zcyBvdmVyIFBpLCB3ZSdyZSBhYm91dCB3aGVyZSB3ZSBuZWVkIHRvIGJlXHJcblxyXG4gICAgICAgICAgICBpZiAoc2Nyb2xsQ291bnQgPj0gTWF0aC5QSSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1vdmVTdGVwID0gTWF0aC5yb3VuZChzY3JvbGxUbyArIGNvc1BhcmFtZXRlciArIGNvc1BhcmFtZXRlciAqIE1hdGguY29zKHNjcm9sbENvdW50KSk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBtb3ZlU3RlcCk7XHJcbiAgICAgICAgICAgIG9sZFRpbWVzdGFtcCA9IG5ld1RpbWVzdGFtcDtcclxuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkNvcmVNYWluLnJlaW5pdGlhbGl6ZUxhenlMb2FkaW5nSW1hZ2VzKCk7XG5leHBvcnQgY2xhc3MgQ29yZVN0cmluZyB7XHJcbiAgc3RhdGljIHJhbmRvbUxldHRlcnMobGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgbGV0IHJlc3VsdCA9IFwiXCI7XHJcbiAgICBsZXQgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5elwiO1xyXG4gICAgbGV0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxyXG4gICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmFuZG9tTnVtYmVycyhsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcclxuICAgIGxldCBjaGFyYWN0ZXJzID0gXCIwMTIzNDU2Nzg5MTFcIjtcclxuICAgIGxldCBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKylcclxuICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJhbmRvbShsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBsZXQgcmVzdWx0ID0gXCJcIjtcclxuICAgIGxldCBjaGFyYWN0ZXJzID1cclxuICAgICAgXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgbGV0IGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKVxyXG4gICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59XHJcblxuZXhwb3J0IGNsYXNzIENvcmVTdGFjayB7XHJcbiAgc3RhdGljIG1vdW50QWxsKCkge1xyXG4gICAgdmFyIGN1cnJlbnRDbGFzcyA9IHRoaXM7XHJcblxyXG4gICAgJChcIi5zdGFjazpub3QoLnN0YWNrY2xvbmUpXCIpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGN1cnJlbnRDbGFzcy5tb3VudCh0aGlzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG1vdW50KHBhcmVudDogSFRNTEVsZW1lbnQpIHtcclxuICAgIHZhciBjdXJyZW50Q2xhc3MgPSB0aGlzO1xyXG5cclxuICAgIGxldCBjbG9uZWRJZCA9IFwic3RhY2tjbG9uZVwiICsgTWF0aC5yYW5kb20oKTtcclxuXHJcbiAgICBsZXQgY2xvbmVkUGFyZW50ID0gJChwYXJlbnQpLmNsb25lKCk7XHJcbiAgICBsZXQgcGFyZW50Q29udGFpbmVyID0gJCgnPGRpdiBpZD1cIicgKyBjbG9uZWRJZCArICdcIj48L2Rpdj4nKTtcclxuICAgICQoXCJib2R5XCIpLmFwcGVuZChwYXJlbnRDb250YWluZXIpO1xyXG4gICAgcGFyZW50Q29udGFpbmVyLmFwcGVuZChjbG9uZWRQYXJlbnQpO1xyXG5cclxuICAgIGNsb25lZFBhcmVudC5wYXJlbnQoKS5jc3Moe1xyXG4gICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxyXG4gICAgICB0b3A6IFwiLTIwMHB4XCJcclxuICAgIH0pO1xyXG5cclxuICAgIGNsb25lZFBhcmVudC5maW5kKFwiPiAqLCAuc3RhY2sta2VlcCwgLnN0YWNrLXNoeVwiKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAkKHRoaXMpLmNzcyh7XHJcbiAgICAgICAgZGlzcGxheTogXCJcIlxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNsb25lZFBhcmVudC5hZGRDbGFzcyhcInN0YWNrY2xvbmVcIik7XHJcbiAgICBjbG9uZWRQYXJlbnQuY3NzKHtcclxuICAgICAgZGlzcGxheTogXCJmbGV4XCJcclxuICAgIH0pO1xyXG5cclxuICAgIGNsb25lZFBhcmVudC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgJCh0aGlzKS53aWR0aChcclxuICAgICAgICAkKHBhcmVudClcclxuICAgICAgICAgIC5jaGlsZHJlbigpXHJcbiAgICAgICAgICAuZXEoaW5kZXgpXHJcbiAgICAgICAgICAub3V0ZXJXaWR0aCh0cnVlKVxyXG4gICAgICApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChwYXJlbnQpXHJcbiAgICAgIC5maW5kKFwiPiAqLCAuc3RhY2sta2VlcCwgLnN0YWNrLXNoeVwiKVxyXG4gICAgICAuc2hvdygpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzUGFyZW50TGFyZ2VyVGhhblZpc2libGVJdGVtcyhjbG9uZWRQYXJlbnRbMF0sIHBhcmVudCkpIHtcclxuICAgICAgLy8gSGlkZSBub25lLlxyXG4gICAgICBwYXJlbnRDb250YWluZXIucmVtb3ZlKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAkKGNsb25lZFBhcmVudClcclxuICAgICAgLmZpbmQoXCI+ICosIC5zdGFjay1rZWVwXCIpXHJcbiAgICAgIC5zaG93KCk7XHJcbiAgICAkKGNsb25lZFBhcmVudClcclxuICAgICAgLmZpbmQoXCIuc3RhY2stc2h5XCIpXHJcbiAgICAgIC5oaWRlKCk7XHJcblxyXG4gICAgJChwYXJlbnQpXHJcbiAgICAgIC5maW5kKFwiPiAqLCAuc3RhY2sta2VlcFwiKVxyXG4gICAgICAuc2hvdygpO1xyXG4gICAgJChwYXJlbnQpXHJcbiAgICAgIC5maW5kKFwiLnN0YWNrLXNoeVwiKVxyXG4gICAgICAuaGlkZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLmlzUGFyZW50TGFyZ2VyVGhhblZpc2libGVJdGVtcyhjbG9uZWRQYXJlbnRbMF0sIHBhcmVudCkpIHtcclxuICAgICAgLy8gSGlkZSBzaHkgaXRlbXMuXHJcbiAgICAgIHBhcmVudENvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldmVyc2UgaXRlbXMgb3JkZXJcclxuICAgIGNsb25lZFBhcmVudC5jaGlsZHJlbigpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNsb25lZFBhcmVudC5wcmVwZW5kKHRoaXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IHRvdGFsQ2hpbGRyZW4gPSAkKHBhcmVudCkuY2hpbGRyZW4oKS5sZW5ndGg7XHJcblxyXG4gICAgY2xvbmVkUGFyZW50LmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICBpZiAoY3VycmVudENsYXNzLmlzUGFyZW50TGFyZ2VyVGhhblZpc2libGVJdGVtcyhjbG9uZWRQYXJlbnRbMF0sIHBhcmVudCkpXHJcbiAgICAgICAgLy8gSGlkZSBjdXJyZW50IGl0ZW0uXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKCEkKHRoaXMpLmlzKFwiOnZpc2libGVcIikgfHwgJCh0aGlzKS5oYXNDbGFzcyhcInN0YWNrLWtlZXBcIikpIHJldHVybjtcclxuXHJcbiAgICAgICQodGhpcykuaGlkZSgpO1xyXG4gICAgICAkKHBhcmVudClcclxuICAgICAgICAuY2hpbGRyZW4oKVxyXG4gICAgICAgIC5lcSh0b3RhbENoaWxkcmVuIC0gMSAtIGluZGV4KVxyXG4gICAgICAgIC5oaWRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBwYXJlbnRDb250YWluZXIucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN0YXRpYyBpc1BhcmVudExhcmdlclRoYW5WaXNpYmxlSXRlbXMoXHJcbiAgICBjbG9uZWRQYXJlbnQ6IEhUTUxFbGVtZW50LFxyXG4gICAgcmVhbFBhcmVudDogSFRNTEVsZW1lbnRcclxuICApIHtcclxuICAgIHJldHVybiAkKHJlYWxQYXJlbnQpLmlubmVyV2lkdGgoKSA+PSAkKGNsb25lZFBhcmVudCkuaW5uZXJXaWR0aCgpO1xyXG4gIH1cclxufVxyXG5cclxuQ29yZVN0YWNrLm1vdW50QWxsKCk7XHJcblxyXG4kKHdpbmRvdykub24oXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcbiAgQ29yZVN0YWNrLm1vdW50QWxsKCk7XHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcclxuICBDb3JlU3RhY2subW91bnRBbGwoKTtcclxuXHJcbiAgc2V0VGltZW91dChmdW5jdGlvbigpe0NvcmVTdGFjay5tb3VudEFsbCgpO30sIDEwKTtcclxufSk7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29yZVBvcHVwIHtcclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgX2NvbnRlbnRMb2FkZWRDYWxsQmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgLy8gUHJvcGVydGllc1xyXG5cclxuICBwcml2YXRlIHN0YXRpYyBnZXQgc2VsZWN0b3IoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBcImJvZHkgPiAucG9wdXBcIjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGdldCBlbGVtZW50KCk6IEpRdWVyeTxIVE1MRWxlbWVudD4ge1xyXG4gICAgcmV0dXJuICQodGhpcy5zZWxlY3Rvcik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IGlzT3BlbmVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICQodGhpcy5zZWxlY3RvcikubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIC8vIE1ldGhvZHNcclxuXHJcbiAgICBzdGF0aWMgb25Db250ZW50TG9hZGVkKGNhbGxiYWNrOiAoKSA9PiB2b2lkKXtcclxuICAgICAgICB0aGlzLl9jb250ZW50TG9hZGVkQ2FsbEJhY2sgPSBjYWxsYmFjaztcclxuICAgIH1cclxuXHJcbiAgc3RhdGljIG9wZW4oXHJcbiAgICBjb250ZW50Pzogc3RyaW5nIHwgSFRNTEVsZW1lbnQsXHJcbiAgICBzZXR0aW5ncz86IENvcmVQb3B1cFNldHRpbmdzXHJcbiAgKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc09wZW5lZCkgdGhpcy5jbG9zZSgpO1xyXG5cclxuICAgIGlmIChjb250ZW50ID09PSB1bmRlZmluZWQpIGNvbnRlbnQgPSBcImxvYWRpbmcuLi5cIjtcclxuXHJcbiAgICBpZiAoc2V0dGluZ3MgPT09IHVuZGVmaW5lZCkgc2V0dGluZ3MgPSBuZXcgQ29yZVBvcHVwU2V0dGluZ3MoKTtcclxuXHJcbiAgICBsZXQgaHRtbCA9XHJcbiAgICAgIGBcclxuICAgICAgICAgICAgPGFzaWRlIGNsYXNzPVwicG9wdXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwb3B1cC1jb250ZW50XCI+YCArXHJcbiAgICAgIGNvbnRlbnQgK1xyXG4gICAgICBgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvYXNpZGU+YDtcclxuXHJcbiAgICAkKFwiYm9keVwiKS5hcHBlbmQoaHRtbCk7XHJcbiAgICBDb3JlTWFpbi5wcmV2ZW50U2Nyb2xsaW5nKCk7XHJcblxyXG4gICAgbGV0IGNvbnRlbnRFbGVtZW50ID0gdGhpcy5lbGVtZW50LmZpbmQoXCIucG9wdXAtY29udGVudFwiKTtcclxuXHJcbiAgICBpZiAodGhpcy5fY29udGVudExvYWRlZENhbGxCYWNrICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgdGhpcy5fY29udGVudExvYWRlZENhbGxCYWNrKCk7XHJcblxyXG4gICAgaWYgKCFzZXR0aW5ncy5wcmV2ZW50Q2xvc2UpIHtcclxuICAgICAgQ29yZVBvcHVwLmVsZW1lbnQuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcclxuICAgICAgJCh0aGlzLnNlbGVjdG9yKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgIWNvbnRlbnRFbGVtZW50LmlzKGUudGFyZ2V0KSAmJlxyXG4gICAgICAgICAgY29udGVudEVsZW1lbnQuaGFzKGUudGFyZ2V0KS5sZW5ndGggPT09IDBcclxuICAgICAgICApXHJcbiAgICAgICAgICBDb3JlUG9wdXAuY2xvc2UoKTtcclxuICAgICAgfSk7XHJcbiAgICB9ICAgIFxyXG5cclxuICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZShcImZvcndhcmRcIiwgbnVsbCwgXCJcIik7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNvZnRDbG9zZSgpO1xyXG4gICAgd2luZG93Lmhpc3RvcnkuYmFjaygpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNvZnRDbG9zZSgpOiB2b2lkIHtcclxuICAgIENvcmVNYWluLmFsbG93U2Nyb2xsaW5nKCk7XHJcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgdXBkYXRlQ29udGVudChjb250ZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmlzT3BlbmVkKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPcGVuIHBvcHVwIGJlZm9yZSBzZXR0aW5nIGl0cyBjb250ZW50LlwiKTtcclxuXHJcbiAgICB0aGlzLmVsZW1lbnQuZmluZChcIi5wb3B1cC1jb250ZW50XCIpLmh0bWwoY29udGVudCk7XHJcblxyXG4gICAgaWYgKHRoaXMuX2NvbnRlbnRMb2FkZWRDYWxsQmFjayAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIHRoaXMuX2NvbnRlbnRMb2FkZWRDYWxsQmFjaygpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVQb3B1cFNldHRpbmdzIHtcclxuICBwcmV2ZW50Q2xvc2U6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuJCh3aW5kb3cpLm9uKFwicG9wc3RhdGVcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gIGlmIChDb3JlUG9wdXAuaXNPcGVuZWQpXHJcbiAgICBDb3JlUG9wdXAuc29mdENsb3NlKCk7XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVNZXNzYWdlIHtcclxuICAvLyBQcm9wZXJ0aWVzXHJcblxyXG4gIHByaXZhdGUgc3RhdGljIGdldCBzZWxlY3RvcigpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIFwiYm9keSA+IC5wb3B1cCAubWVzc2FnZVwiO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGVsZW1lbnQoKTogSlF1ZXJ5PEhUTUxFbGVtZW50PiB7XHJcbiAgICByZXR1cm4gJCh0aGlzLnNlbGVjdG9yKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgaXNPcGVuZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gJCh0aGlzLnNlbGVjdG9yKS5sZW5ndGggPiAwO1xyXG4gIH1cclxuXHJcbiAgLy8gTWV0aG9kc1xyXG5cclxuICBzdGF0aWMgb3BlbihcclxuICAgIHRpdGxlOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcclxuICAgIGJ1dHRvbnM6IENvcmVNZXNzYWdlQnV0dG9uW11cclxuICApOiB2b2lkIHtcclxuICAgIGxldCBidXR0b25zSHRtbCA9IFwiXCI7XHJcblxyXG4gICAgYnV0dG9ucy5mb3JFYWNoKGZ1bmN0aW9uKGJ1dHRvbiwgaW5kZXgpIHtcclxuICAgICAgbGV0IGlkID0gQ29yZVN0cmluZy5yYW5kb21MZXR0ZXJzKDIwKTtcclxuXHJcbiAgICAgIGxldCBidXR0b25FbGVtZW50ID0gJChcclxuICAgICAgICBgPGJ1dHRvbiBpZD0nYCArXHJcbiAgICAgICAgICBpZCArXHJcbiAgICAgICAgICBgJyBjbGFzcz1cIm1lc3NhZ2UtYnV0dG9uXCI+YCArXHJcbiAgICAgICAgICBidXR0b24uY29udGVudCArXHJcbiAgICAgICAgICBgPC9idXR0b24+YFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGJ1dHRvbi5tZXRob2QgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAkKGRvY3VtZW50KS5vbihcImNsaWNrXCIsIFwiI1wiICsgaWQsIGJ1dHRvbi5tZXRob2QpO1xyXG5cclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCBcIiNcIiArIGlkLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBDb3JlTWVzc2FnZS5jbG9zZSgpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGJ1dHRvbnNIdG1sICs9IGJ1dHRvbkVsZW1lbnRbMF0ub3V0ZXJIVE1MO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGh0bWwgPVxyXG4gICAgICBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJtZXNzYWdlLXRpdGxlXCI+YCArXHJcbiAgICAgIHRpdGxlICtcclxuICAgICAgYDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm1lc3NhZ2UtZGVzY3JpcHRpb25cIj5gICtcclxuICAgICAgZGVzY3JpcHRpb24gK1xyXG4gICAgICBgPC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLWJ1dHRvbnNcIj5gICtcclxuICAgICAgYnV0dG9uc0h0bWwgK1xyXG4gICAgICBgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YDtcclxuXHJcbiAgICBDb3JlUG9wdXAub3BlbihodG1sLHtcclxuICAgICAgIHByZXZlbnRDbG9zZTogZmFsc2VcclxuICAgIH0pO1xyXG4gICAgQ29yZU1lc3NhZ2UuZWxlbWVudFxyXG4gICAgICAuZmluZChcIi5tZXNzYWdlLWJ1dHRvblwiKVxyXG4gICAgICAuZmlyc3QoKVxyXG4gICAgICAuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgIENvcmVQb3B1cC5jbG9zZSgpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNsaWNrKCk6IHZvaWQge1xyXG4gICAgdGhpcy5lbGVtZW50LmZpbmQoXCIubWVzc2FnZS1idXR0b246Zm9jdXNcIikuY2xpY2soKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzZWxlY3RQcmV2aW91c0J1dHRvbigpOiB2b2lkIHtcclxuICAgIGxldCBzZWxlY3RlZCA9IHRoaXMuZWxlbWVudC5maW5kKFwiLm1lc3NhZ2UtYnV0dG9uOmZvY3VzXCIpO1xyXG5cclxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgQ29yZU1lc3NhZ2UuZWxlbWVudFxyXG4gICAgICAgIC5maW5kKFwiLm1lc3NhZ2UtYnV0dG9uXCIpXHJcbiAgICAgICAgLmZpcnN0KClcclxuICAgICAgICAuZm9jdXMoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwcmV2aW91cyA9IHNlbGVjdGVkLm5vdChcIjpoaWRkZW5cIikucHJldigpO1xyXG5cclxuICAgIGlmIChwcmV2aW91cy5sZW5ndGggPiAwKSBwcmV2aW91cy5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNlbGVjdE5leHRCdXR0b24oKTogdm9pZCB7XHJcbiAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLmVsZW1lbnQuZmluZChcIi5tZXNzYWdlLWJ1dHRvbjpmb2N1c1wiKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudFxyXG4gICAgICAgIC5maW5kKFwiLm1lc3NhZ2UtYnV0dG9uXCIpXHJcbiAgICAgICAgLmZpcnN0KClcclxuICAgICAgICAuZm9jdXMoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBuZXh0ID0gc2VsZWN0ZWQubm90KFwiOmhpZGRlblwiKS5uZXh0KCk7XHJcblxyXG4gICAgaWYgKG5leHQubGVuZ3RoID4gMCkgbmV4dC5mb2N1cygpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVNZXNzYWdlQnV0dG9uIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBjb250ZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCxcclxuICAgIHB1YmxpYyBtZXRob2Q/OiAoKSA9PiB2b2lkXHJcbiAgKSB7fVxyXG59XHJcblxyXG4vLyBPbiBLZXlib2FyZCBEb3duXHJcbiQoZG9jdW1lbnQpLm9uKFwia2V5ZG93blwiLCBkb2N1bWVudCwgZnVuY3Rpb24oZXZlbnRPYmplY3QpIHtcclxuICAgIFxyXG4gIGlmIChDb3JlTWVzc2FnZS5pc09wZW5lZClcclxuICAgIHN3aXRjaCAoZXZlbnRPYmplY3Qua2V5Q29kZSkge1xyXG4gICAgICBjYXNlIDEzOiAvLyBFbnRlclxyXG4gICAgICAgIENvcmVNZXNzYWdlLmNsaWNrKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIDI3OiAvLyBFc2NhcGVcclxuICAgICAgICBDb3JlTWVzc2FnZS5jbG9zZSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAzNzogLy8gTGVmdCBBcnJvd1xyXG4gICAgICAgIENvcmVNZXNzYWdlLnNlbGVjdFByZXZpb3VzQnV0dG9uKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIDM5OlxyXG4gICAgICAgIENvcmVNZXNzYWdlLnNlbGVjdE5leHRCdXR0b24oKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVTaWRlQmFyIHtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfY29udGVudExvYWRlZENhbGxCYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgc3RhdGljIFdpbmRvd3NXaWR0aDogbnVtYmVyO1xyXG5cclxuICAgIC8vIFByb3BlcnRpZXNcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgc2VsZWN0b3IoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gJ2JvZHkgPiAuc2lkZWJhcic7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0IGVsZW1lbnQoKTogSlF1ZXJ5PEhUTUxFbGVtZW50PiB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcy5zZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzLnNlbGVjdG9yKS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBIZWFkZXJIZWlnaHQ6IHN0cmluZyB8IG51bWJlcjtcclxuXHJcbiAgICAvLyBNZXRob2RzXHJcblxyXG4gICAgc3RhdGljIHVwZGF0ZVdpbmRvd3NXaWR0aFByb3BlcnR5VmFsdWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5XaW5kb3dzV2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgb25Db250ZW50TG9hZGVkKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5fY29udGVudExvYWRlZENhbGxCYWNrID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG9wZW4oY29udGVudD86IChzdHJpbmcgfCBIVE1MRWxlbWVudCkpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuZWQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKCdmb3J3YXJkJywgbnVsbCwgJycpO1xyXG5cclxuICAgICAgICBpZiAoY29udGVudCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBjb250ZW50ID0gJ0xvYWRpbmcuLi4nO1xyXG5cclxuICAgICAgICBsZXQgaHRtbCA9IGBcclxuICAgICAgICA8YXNpZGUgY2xhc3M9XCJzaWRlYmFyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlYmFyLXZvaWRcIj5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZWJhci1sb2FkXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZWJhci1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZWJhci1iYWNrXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlYmFyLXRpdGxlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlYmFyLWNsb3NlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGluZSBzdHlsZT1cImZpbGw6IG5vbmU7IHN0cm9rZTogIzAwMDsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwO1wiIHgxPVwiMTEuNDNcIiB5MT1cIjExLjI2XCIgeDI9XCIyOC40NlwiIHkyPVwiMjguMjlcIj48L2xpbmU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpbmUgc3R5bGU9XCJmaWxsOiBub25lOyBzdHJva2U6ICMwMDA7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDtcIiB4MT1cIjExLjQzXCIgeTE9XCIyOC4yOVwiIHgyPVwiMjguNDZcIiB5Mj1cIjExLjI2XCI+PC9saW5lPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNpZGViYXItY29udGVudFwiPmBcclxuICAgICAgICAgICAgK1xyXG4gICAgICAgICAgICBjb250ZW50XHJcbiAgICAgICAgICAgICtcclxuICAgICAgICAgICAgYDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FzaWRlPlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoaHRtbCk7XHJcbiAgICAgICAgQ29yZU1haW4ucHJldmVudFNjcm9sbGluZygpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5IZWFkZXJIZWlnaHQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5zaWRlYmFyLWhlYWRlcicpLmhlaWdodCgkKCdoZWFkZXInKS5oZWlnaHQoKSArICdweCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5zaWRlYmFyLWhlYWRlcicpLmhlaWdodCh0aGlzLkhlYWRlckhlaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50TG9hZGVkQ2FsbEJhY2sgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudExvYWRlZENhbGxCYWNrKCk7XHJcblxyXG4gICAgICAgIENvcmVTaWRlQmFyLnVwZGF0ZVdpbmRvd3NXaWR0aFByb3BlcnR5VmFsdWUoKTtcclxuXHJcbiAgICAgICAgJCgnLnNpZGViYXItdm9pZCwgLnNpZGViYXItaGVhZGVyJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBDb3JlU2lkZUJhci5jbG9zZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNvZnRDbG9zZSgpO1xyXG4gICAgICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc29mdENsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIENvcmVNYWluLmFsbG93U2Nyb2xsaW5nKCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVDb250ZW50KGNvbnRlbnQ6IChzdHJpbmcgfCBIVE1MRWxlbWVudCkpOiAodm9pZCB8IHN0cmluZyB8IEhUTUxFbGVtZW50KSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcGVuIHNpZGViYXIgYmVmb3JlIHNldHRpbmcgaXRzIGNvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmZpbmQoJy5zaWRlYmFyLWNvbnRlbnQnKS5odG1sKGNvbnRlbnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY29udGVudExvYWRlZENhbGxCYWNrICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRMb2FkZWRDYWxsQmFjaygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Db3JlU2lkZUJhci51cGRhdGVXaW5kb3dzV2lkdGhQcm9wZXJ0eVZhbHVlKCk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnYm9keSA+IC5zaWRlYmFyIC5zaWRlYmFyLWNvbnRlbnQgYScsIGZ1bmN0aW9uICgpIHtcclxuICAgIENvcmVTaWRlQmFyLmNsb3NlKCk7XHJcbn0pXHJcblxyXG4kKHdpbmRvdykub24oXCJwb3BzdGF0ZVwiLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKENvcmVTaWRlQmFyLmlzT3BlbmVkKVxyXG4gICAgICAgIENvcmVTaWRlQmFyLnNvZnRDbG9zZSgpO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICgkKHRoaXMpLndpZHRoKCkgIT09IENvcmVTaWRlQmFyLldpbmRvd3NXaWR0aCkge1xyXG5cclxuICAgICAgICBDb3JlU2lkZUJhci5XaW5kb3dzV2lkdGggPSAkKHRoaXMpLndpZHRoKCk7XHJcblxyXG4gICAgICAgIGlmIChDb3JlU2lkZUJhci5pc09wZW5lZClcclxuICAgICAgICAgICAgQ29yZVNpZGVCYXIuY2xvc2UoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAoQ29yZVNpZGVCYXIuaXNPcGVuZWQpXHJcbiAgICAgICAgQ29yZVNpZGVCYXIuY2xvc2UoKTtcclxufSk7XHJcblxyXG4vLyBEb2NrIExpbmtzXHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnYVtocmVmKj1cIiNcIl06bm90KFtocmVmPVwiI1wiXSknLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgPT09IHRoaXMucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSAmJiBsb2NhdGlvbi5ob3N0bmFtZSA9PT0gdGhpcy5ob3N0bmFtZSkge1xyXG5cclxuICAgICAgICBsZXQgdGFyZ2V0ID0gJCh0aGlzLmhhc2gpO1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5sZW5ndGggPyB0YXJnZXQgOiAkKCdbbmFtZT0nICsgdGhpcy5oYXNoLnNsaWNlKDEpICsgJ10nKTtcclxuXHJcbiAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpXHJcbiAgICAgICAgICAgIENvcmVNYWluLnNjcm9sbFRvKHRhcmdldFswXSwgMjAwKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pOyJdfQ==

var exports = {};
var CoreHeader = (function () {
    function CoreHeader() {
    }
    CoreHeader.updateLayout = function () {
        this.updateMenuButton();
    };
    CoreHeader.updateMenuButton = function () {
        var menuButton = $('body > header .menu');
        var menuVisibility = menuButton.data('visibility');
        switch (menuVisibility) {
            case 'auto':
                if ($('body > header nav .navigation-item').not(':visible').length > 0)
                    menuButton.show();
                else
                    menuButton.hide();
                break;
            case 'hidden':
                menuButton.hide();
                break;
            default:
                break;
        }
    };
    return CoreHeader;
}());
{ CoreHeader };
CoreHeader.updateLayout();
$(window).on("load", function () {
    CoreHeader.updateLayout();
});
$(window).resize(function () {
    CoreHeader.updateLayout();
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUFBO0lBZ0NBLENBQUM7SUE5QlUsdUJBQVksR0FBbkI7UUFFSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRWMsMkJBQWdCLEdBQS9CO1FBRUksSUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDNUMsSUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVyRCxRQUFRLGNBQWMsRUFBRTtZQUVwQixLQUFLLE1BQU07Z0JBRVAsSUFBSSxDQUFDLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7b0JBQ2xFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7b0JBRWxCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDdEIsTUFBTTtZQUVWLEtBQUssUUFBUTtnQkFFVCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2xCLE1BQU07WUFFVjtnQkFFSSxNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQWhDQSxBQWdDQyxJQUFBOztBQUVELFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUUxQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRTtJQUNqQixVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDOUIsQ0FBQyxDQUFDLENBQUM7QUFFSCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ2IsVUFBVSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzlCLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6IkhlYWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb3JlSGVhZGVyIHtcclxuXHJcbiAgICBzdGF0aWMgdXBkYXRlTGF5b3V0KCkge1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZU1lbnVCdXR0b24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyB1cGRhdGVNZW51QnV0dG9uKCkge1xyXG5cclxuICAgICAgICBjb25zdCBtZW51QnV0dG9uID0gJCgnYm9keSA+IGhlYWRlciAubWVudScpO1xyXG4gICAgICAgIGNvbnN0IG1lbnVWaXNpYmlsaXR5ID0gbWVudUJ1dHRvbi5kYXRhKCd2aXNpYmlsaXR5Jyk7XHJcblxyXG4gICAgICAgIHN3aXRjaCAobWVudVZpc2liaWxpdHkpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2F1dG8nOlxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkKCdib2R5ID4gaGVhZGVyIG5hdiAubmF2aWdhdGlvbi1pdGVtJykubm90KCc6dmlzaWJsZScpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgbWVudUJ1dHRvbi5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgbWVudUJ1dHRvbi5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2hpZGRlbic6XHJcblxyXG4gICAgICAgICAgICAgICAgbWVudUJ1dHRvbi5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5Db3JlSGVhZGVyLnVwZGF0ZUxheW91dCgpO1xyXG5cclxuJCh3aW5kb3cpLm9uKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBDb3JlSGVhZGVyLnVwZGF0ZUxheW91dCgpO1xyXG59KTtcclxuXHJcbiQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgQ29yZUhlYWRlci51cGRhdGVMYXlvdXQoKTtcclxufSk7Il19

var exports = {};
var sidemenuContent;
var sidemenuHidden = $('#sidemenu-hidden');
if (sidemenuHidden.html() !== '')
    sidemenuContent = $('#sidemenu-hidden').html();
$('#sidemenu-hidden').remove();
$(document).on('click', 'body > header .menu', function () {
    CoreSideBar.open();
    if (sidemenuContent !== undefined) {
        var content_1 = document.createElement('div');
        content_1.id = "sidemenu";
        $(content_1).html(sidemenuContent);
        CoreSideBar.updateContent(content_1);
        if ($(content_1).find('#sidebar-shyelements').length === 0)
            return;
    }
    var content = document.createElement('div');
    $('body > header nav .shy > *').clone().each(function (index, element) {
        content.appendChild(element);
    });
    $(content).find('.header-link').removeClass('header-link');
    if (sidemenuContent !== undefined)
        $('#sidebar-shyelements').replaceWith(content.innerHTML);
    else
        CoreSideBar.updateContent(content.innerHTML);
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1ldGhvZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUzQyxJQUFJLGVBQXVCLENBQUM7QUFHNUIsSUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFN0MsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtJQUM1QixlQUFlLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFbkQsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFL0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUU7SUFFM0MsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRW5CLElBQUksZUFBZSxLQUFLLFnBQVMsRUFBRTtRQUUvQixJQUFNLFnBQU8sR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxTQUFPLENBQUMsRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUN4QixDQUFDLENBQUMsU0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBTyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLENBQUMsU0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDcEQsT0FBTztLQUNkO0lBRUQsSUFBTSxPQUFPLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsS0FBSyxFQUFFLE9BQU87UUFDeEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUMsQ0FBQztJQUVILENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTNELElBQUksZUFBZSxLQUFLLFnBQVM7UUFDN0IsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7UUFFekQsV0FBVyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckQsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiTWV0aG9kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvcmVTaWRlQmFyIH0gZnJvbSBcIi4uL2NvcmUvY29yZVwiO1xyXG5cclxubGV0IHNpZGVtZW51Q29udGVudDogc3RyaW5nO1xyXG5cclxuLy8gU2lkZW1lbnVcclxuY29uc3Qgc2lkZW1lbnVIaWRkZW4gPSAkKCcjc2lkZW1lbnUtaGlkZGVuJyk7XHJcblxyXG5pZiAoc2lkZW1lbnVIaWRkZW4uaHRtbCgpICE9PSAnJylcclxuICAgIHNpZGVtZW51Q29udGVudCA9ICQoJyNzaWRlbWVudS1oaWRkZW4nKS5odG1sKCk7XHJcblxyXG4kKCcjc2lkZW1lbnUtaGlkZGVuJykucmVtb3ZlKCk7XHJcblxyXG4kKGRvY3VtZW50KS5vbignY2xpY2snLCAnYm9keSA+IGhlYWRlciAubWVudScsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBDb3JlU2lkZUJhci5vcGVuKCk7XHJcblxyXG4gICAgaWYgKHNpZGVtZW51Q29udGVudCAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGVudC5pZCA9IFwic2lkZW1lbnVcIjtcclxuICAgICAgICAkKGNvbnRlbnQpLmh0bWwoc2lkZW1lbnVDb250ZW50KTtcclxuICAgICAgICBDb3JlU2lkZUJhci51cGRhdGVDb250ZW50KGNvbnRlbnQpO1xyXG5cclxuICAgICAgICBpZiAoJChjb250ZW50KS5maW5kKCcjc2lkZWJhci1zaHllbGVtZW50cycpLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvbnRlbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAkKCdib2R5ID4gaGVhZGVyIG5hdiAuc2h5ID4gKicpLmNsb25lKCkuZWFjaCgoaW5kZXgsIGVsZW1lbnQpID0+IHtcclxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChjb250ZW50KS5maW5kKCcuaGVhZGVyLWxpbmsnKS5yZW1vdmVDbGFzcygnaGVhZGVyLWxpbmsnKTtcclxuXHJcbiAgICBpZiAoc2lkZW1lbnVDb250ZW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgJCgnI3NpZGViYXItc2h5ZWxlbWVudHMnKS5yZXBsYWNlV2l0aChjb250ZW50LmlubmVySFRNTCk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgQ29yZVNpZGVCYXIudXBkYXRlQ29udGVudChjb250ZW50LmlubmVySFRNTCk7XHJcbn0pOyJdfQ==
