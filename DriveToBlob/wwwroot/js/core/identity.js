var exports = {};
var CoreIdentity = (function () {
    function CoreIdentity() {
    }
    Object.defineProperty(CoreIdentity, "headerSelector", {
        get: function () {
            return 'body > header .account';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreIdentity, "headerElement", {
        get: function () {
            return $(this.headerSelector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreIdentity, "menuSelector", {
        get: function () {
            return 'body > .sidebar .accountsidebar';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreIdentity, "menuElement", {
        get: function () {
            return $(this.menuSelector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoreIdentity, "isOpened", {
        get: function () {
            return this.menuElement.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    CoreIdentity.open = function () {
        if (this.isOpened)
            this.close();
        CoreSideBar.open();
        $.ajax({
            url: '/Account/GetSideMenu',
            cache: true,
            dataType: "html",
            success: function (data) {
                CoreSideBar.updateContent(data);
            },
            error: function () {
                CoreSideBar.updateContent('Error displaying account information.');
            }
        });
    };
    CoreIdentity.close = function () {
        CoreSideBar.close();
    };
    CoreIdentity.swap = function () {
        if (this.isOpened)
            this.close();
        else
            this.open();
    };
    return CoreIdentity;
}());
{ CoreIdentity };
$(document).on('click', CoreIdentity.headerSelector + '._user', function () {
    CoreIdentity.swap();
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIklkZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFM0M7SUFBQTtJQTBEQSxDQUFDO0lBdERHLHNCQUFXLDhCQUFjO2FBQXpCO1lBQ0ksT0FBTyx3QkFBd0IsQ0FBQztRQUNwQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFtQiw2QkFBYTthQUFoQztZQUNJLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNsQyxDQUFDOzs7T0FBQTtJQUVELHNCQUFtQiw0QkFBWTthQUEvQjtZQUNJLE9BQU8saUNBQWlDLENBQUM7UUFDN0MsQ0FBQzs7O09BQUE7SUFFRCxzQkFBbUIsMkJBQVc7YUFBOUI7WUFDSSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyx3QkFBUTthQUFuQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7OztPQUFBO0lBSU0saUJBQUksR0FBWDtRQUVJLElBQUksSUFBSSxDQUFDLFFBQVE7WUFDYixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFakIsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRW5CLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDSCxHQUFHLEVBQUUsc0JBQXNCO1lBQzNCLEtBQUssRUFBRSxJQUFJO1lBQ1gsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLFVBQVUsSUFBSTtnQkFDbkIsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsS0FBSyxFQUFFO2dCQUNILFdBQVcsQ0FBQyxhQUFhLENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUN2RSxDQUFDO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLGtCQUFLLEdBQVo7UUFDSSxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVNLGlCQUFJLEdBQVg7UUFFSSxJQUFJLElBQUksQ0FBQyxRQUFRO1lBQ2IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztZQUVaLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUwsbUJBQUM7QUFBRCxDQTFEQSxBQTBEQyxJQUFBOztBQUVELENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxjQUFjLEdBQUcsUUFBUSxFQUFFO0lBRTVELFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUV4QixDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJJZGVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvcmVTaWRlQmFyIH0gZnJvbSBcIi4uL2NvcmUvY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVJZGVudGl0eSB7XHJcblxyXG4gICAgLy8gUHJvcGVydGllc1xyXG4gICAgXHJcbiAgICBzdGF0aWMgZ2V0IGhlYWRlclNlbGVjdG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdib2R5ID4gaGVhZGVyIC5hY2NvdW50JztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgaGVhZGVyRWxlbWVudCgpOiBKUXVlcnk8SFRNTEVsZW1lbnQ+IHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzLmhlYWRlclNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgbWVudVNlbGVjdG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdib2R5ID4gLnNpZGViYXIgLmFjY291bnRzaWRlYmFyJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXQgbWVudUVsZW1lbnQoKTogSlF1ZXJ5PEhUTUxFbGVtZW50PiB7XHJcbiAgICAgICAgcmV0dXJuICQodGhpcy5tZW51U2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgaXNPcGVuZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVudUVsZW1lbnQubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNZXRob2RzXHJcblxyXG4gICAgc3RhdGljIG9wZW4oKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzT3BlbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIENvcmVTaWRlQmFyLm9wZW4oKTtcclxuXHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiAnL0FjY291bnQvR2V0U2lkZU1lbnUnLFxyXG4gICAgICAgICAgICBjYWNoZTogdHJ1ZSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgQ29yZVNpZGVCYXIudXBkYXRlQ29udGVudChkYXRhKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIENvcmVTaWRlQmFyLnVwZGF0ZUNvbnRlbnQoJ0Vycm9yIGRpc3BsYXlpbmcgYWNjb3VudCBpbmZvcm1hdGlvbi4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICBDb3JlU2lkZUJhci5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzd2FwKCk6IHZvaWQge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc09wZW5lZClcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG5cclxuICAgICAgICBlbHNlIHRoaXMub3BlbigpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuJChkb2N1bWVudCkub24oJ2NsaWNrJywgQ29yZUlkZW50aXR5LmhlYWRlclNlbGVjdG9yICsgJy5fdXNlcicsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBDb3JlSWRlbnRpdHkuc3dhcCgpO1xyXG5cclxufSk7Il19
