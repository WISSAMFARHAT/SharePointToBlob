/**
 * Hi :-) This is a class representing a Siema.
 */
  class Siema {
  /**
   * Create a Siema.
   * @param {Object} options - Optional settings object.
   */
  constructor(options) {
    // Merge defaults with user's settings
    this.config = Siema.mergeSettings(options);

    // Resolve selector's type
    this.selector = typeof this.config.selector === 'string' ? document.querySelector(this.config.selector) : this.config.selector;

    // Early throw if selector doesn't exists
    if (this.selector === null) {
      throw new Error('Something wrong with your selector 😭');
    }

    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // Create global references
    this.selectorWidth = this.selector.offsetWidth;
    this.innerElements = [].slice.call(this.selector.children);
    this.currentSlide = this.config.loop ?
      this.config.startIndex % this.innerElements.length :
      Math.max(0, Math.min(this.config.startIndex, this.innerElements.length - this.perPage));
    this.transformProperty = Siema.webkitOrNot();

    // Bind all event handlers for referencability
    ['resizeHandler', 'touchstartHandler', 'touchendHandler', 'touchmoveHandler', 'mousedownHandler', 'mouseupHandler', 'mouseleaveHandler', 'mousemoveHandler', 'clickHandler'].forEach(method => {
      this[method] = this[method].bind(this);
    });

    // Build markup and apply required styling to elements
    this.init();
  }


  /**
   * Overrides default settings with custom ones.
   * @param {Object} options - Optional settings object.
   * @returns {Object} - Custom Siema settings.
   */
  static mergeSettings(options) {
    const settings = {
      selector: '.siema',
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      multipleDrag: true,
      threshold: 20,
      loop: false,
      rtl: false,
      onInit: () => {},
      onChange: () => {},
    };

    const userSttings = options;
    for (const attrname in userSttings) {
      settings[attrname] = userSttings[attrname];
    }

    return settings;
  }


  /**
   * Determine if browser supports unprefixed transform property.
   * Google Chrome since version 26 supports prefix-less transform
   * @returns {string} - Transform property supported by client.
   */
  static webkitOrNot() {
    const style = document.documentElement.style;
    if (typeof style.transform === 'string') {
      return 'transform';
    }
    return 'WebkitTransform';
  }

  /**
   * Attaches listeners to required events.
   */
  attachEvents() {
    // Resize element on window resize
    window.addEventListener('resize', this.resizeHandler);

    // If element is draggable / swipable, add event handlers
    if (this.config.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false;
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: false,
      };

      // Touch events
      this.selector.addEventListener('touchstart', this.touchstartHandler);
      this.selector.addEventListener('touchend', this.touchendHandler);
      this.selector.addEventListener('touchmove', this.touchmoveHandler);

      // Mouse events
      this.selector.addEventListener('mousedown', this.mousedownHandler);
      this.selector.addEventListener('mouseup', this.mouseupHandler);
      this.selector.addEventListener('mouseleave', this.mouseleaveHandler);
      this.selector.addEventListener('mousemove', this.mousemoveHandler);

      // Click
      this.selector.addEventListener('click', this.clickHandler);
    }
  }


  /**
   * Detaches listeners from required events.
   */
  detachEvents() {
    window.removeEventListener('resize', this.resizeHandler);
    this.selector.removeEventListener('touchstart', this.touchstartHandler);
    this.selector.removeEventListener('touchend', this.touchendHandler);
    this.selector.removeEventListener('touchmove', this.touchmoveHandler);
    this.selector.removeEventListener('mousedown', this.mousedownHandler);
    this.selector.removeEventListener('mouseup', this.mouseupHandler);
    this.selector.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.selector.removeEventListener('mousemove', this.mousemoveHandler);
    this.selector.removeEventListener('click', this.clickHandler);
  }


  /**
   * Builds the markup and attaches listeners to required events.
   */
  init() {
    this.attachEvents();

    // hide everything out of selector's boundaries
    this.selector.style.overflow = 'hidden';

    // rtl or ltr
    this.selector.style.direction = this.config.rtl ? 'rtl' : 'ltr';

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    this.config.onInit.call(this);
  }


  /**
   * Build a sliderFrame and slide to a current item.
   */
  buildSliderFrame() {
    const widthItem = this.selectorWidth / this.perPage;
    const itemsToBuild = this.config.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length;

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div');
    this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`;
    this.enableTransition();

    if (this.config.draggable) {
      this.selector.style.cursor = '-webkit-grab';
    }

    // Create a document fragment to put slides into it
    const docFragment = document.createDocumentFragment();

    // Loop through the slides, add styling and add them to document fragment
    if (this.config.loop) {
      for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }
    for (let i = 0; i < this.innerElements.length; i++) {
      const element = this.buildSliderFrameItem(this.innerElements[i]);
      docFragment.appendChild(element);
    }
    if (this.config.loop) {
      for (let i = 0; i < this.perPage; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true));
        docFragment.appendChild(element);
      }
    }

    // Add fragment to the frame
    this.sliderFrame.appendChild(docFragment);

    // Clear selector (just in case something is there) and insert a frame
    this.selector.innerHTML = '';
    this.selector.appendChild(this.sliderFrame);

    // Go to currently active slide after initial build
    this.slideToCurrent();
  }

  buildSliderFrameItem(elm) {
    const elementContainer = document.createElement('div');
    elementContainer.style.cssFloat = this.config.rtl ? 'right' : 'left';
    elementContainer.style.float = this.config.rtl ? 'right' : 'left';
    elementContainer.style.width = `${this.config.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`;
    elementContainer.appendChild(elm);
    return elementContainer;
  }


  /**
   * Determinates slides number accordingly to clients viewport.
   */
  resolveSlidesNumber() {
    if (typeof this.config.perPage === 'number') {
      this.perPage = this.config.perPage;
    }
    else if (typeof this.config.perPage === 'object') {
      this.perPage = 1;
      for (const viewport in this.config.perPage) {
        if (window.innerWidth >= viewport) {
          this.perPage = this.config.perPage[viewport];
        }
      }
    }
  }


  /**
   * Go to previous slide.
   * @param {number} [howManySlides=1] - How many items to slide backward.
   * @param {function} callback - Optional callback function.
   */
  prev(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.config.loop) {
      const isNewIndexClone = this.currentSlide - howManySlides < 0;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide + this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex - howManySlides;
      }
      else {
        this.currentSlide = this.currentSlide - howManySlides;
      }
    }
    else {
      this.currentSlide = Math.max(this.currentSlide - howManySlides, 0);
    }

    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.config.loop);
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Go to next slide.
   * @param {number} [howManySlides=1] - How many items to slide forward.
   * @param {function} callback - Optional callback function.
   */
  next(howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return;
    }

    const beforeChange = this.currentSlide;

    if (this.config.loop) {
      const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage;
      if (isNewIndexClone) {
        this.disableTransition();

        const mirrorSlideIndex = this.currentSlide - this.innerElements.length;
        const mirrorSlideIndexOffset = this.perPage;
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset;
        const offset = (this.config.rtl ? 1 : -1) * moveTo * (this.selectorWidth / this.perPage);
        const dragDistance = this.config.draggable ? this.drag.endX - this.drag.startX : 0;

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`;
        this.currentSlide = mirrorSlideIndex + howManySlides;
      }
      else {
        this.currentSlide = this.currentSlide + howManySlides;
      }
    }
    else {
      this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage);
    }
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.config.loop);
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Disable transition on sliderFrame.
   */
  disableTransition() {
    this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;
  }


  /**
   * Enable transition on sliderFrame.
   */
  enableTransition() {
    this.sliderFrame.style.webkitTransition = `all ${this.config.duration}ms ${this.config.easing}`;
    this.sliderFrame.style.transition = `all ${this.config.duration}ms ${this.config.easing}`;
  }


  /**
   * Go to slide with particular index
   * @param {number} index - Item index to slide to.
   * @param {function} callback - Optional callback function.
   */
  goTo(index, callback) {
    if (this.innerElements.length <= this.perPage) {
      return;
    }
    const beforeChange = this.currentSlide;
    this.currentSlide = this.config.loop ?
      index % this.innerElements.length :
      Math.min(Math.max(index, 0), this.innerElements.length - this.perPage);
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent();
      this.config.onChange.call(this);
      if (callback) {
        callback.call(this);
      }
    }
  }


  /**
   * Moves sliders frame to position of currently active slide
   */
  slideToCurrent(enableTransition) {
    const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
    const offset = (this.config.rtl ? 1 : -1) * currentSlide * (this.selectorWidth / this.perPage);

    if (enableTransition) {
      // This one is tricky, I know but this is a perfect explanation:
      // https://youtu.be/cCOL7MC4Pl0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.enableTransition();
          this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
        });
      });
    }
    else {
      this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`;
    }
  }


  /**
   * Recalculate drag /swipe event and reposition the frame of a slider
   */
  updateAfterDrag() {
    const movement = (this.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX);
    const movementDistance = Math.abs(movement);
    const howManySliderToSlide = this.config.multipleDrag ? Math.ceil(movementDistance / (this.selectorWidth / this.perPage)) : 1;

    const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0;
    const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage;

    if (movement > 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
      this.prev(howManySliderToSlide);
    }
    else if (movement < 0 && movementDistance > this.config.threshold && this.innerElements.length > this.perPage) {
      this.next(howManySliderToSlide);
    }
    this.slideToCurrent(slideToNegativeClone || slideToPositiveClone);
  }


  /**
   * When window resizes, resize slider components as well
   */
  resizeHandler() {
    // update perPage number dependable of user value
    this.resolveSlidesNumber();

    // relcalculate currentSlide
    // prevent hiding items when browser width increases
    if (this.currentSlide + this.perPage > this.innerElements.length) {
      this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage;
    }

    this.selectorWidth = this.selector.offsetWidth;

    this.buildSliderFrame();
  }


  /**
   * Clear drag after touchend and mouseup event
   */
  clearDrag() {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    };
  }


  /**
   * touchstart event handler
   */
  touchstartHandler(e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    e.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = e.touches[0].pageX;
    this.drag.startY = e.touches[0].pageY;
  }


  /**
   * touchend event handler
   */
  touchendHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  /**
   * touchmove event handler
   */
  touchmoveHandler(e) {
    e.stopPropagation();

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX);
    }

    if (this.pointerDown && this.drag.letItGo) {
      e.preventDefault();
      this.drag.endX = e.touches[0].pageX;
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

      const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }


  /**
   * mousedown event handler
   */
  mousedownHandler(e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignoreSiema = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1;
    if (ignoreSiema) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    this.pointerDown = true;
    this.drag.startX = e.pageX;
  }


  /**
   * mouseup event handler
   */
  mouseupHandler(e) {
    e.stopPropagation();
    this.pointerDown = false;
    this.selector.style.cursor = '-webkit-grab';
    this.enableTransition();
    if (this.drag.endX) {
      this.updateAfterDrag();
    }
    this.clearDrag();
  }


  /**
   * mousemove event handler
   */
  mousemoveHandler(e) {
    e.preventDefault();
    if (this.pointerDown) {
      // if dragged element is a link
      // mark preventClick prop as a true
      // to detemine about browser redirection later on
      if (e.target.nodeName === 'A') {
        this.drag.preventClick = true;
      }

      this.drag.endX = e.pageX;
      this.selector.style.cursor = '-webkit-grabbing';
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.config.easing}`;
      this.sliderFrame.style.transition = `all 0ms ${this.config.easing}`;

      const currentSlide = this.config.loop ? this.currentSlide + this.perPage : this.currentSlide;
      const currentOffset = currentSlide * (this.selectorWidth / this.perPage);
      const dragOffset = (this.drag.endX - this.drag.startX);
      const offset = this.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset;
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.config.rtl ? 1 : -1) * offset}px, 0, 0)`;
    }
  }


  /**
   * mouseleave event handler
   */
  mouseleaveHandler(e) {
    if (this.pointerDown) {
      this.pointerDown = false;
      this.selector.style.cursor = '-webkit-grab';
      this.drag.endX = e.pageX;
      this.drag.preventClick = false;
      this.enableTransition();
      this.updateAfterDrag();
      this.clearDrag();
    }
  }


  /**
   * click event handler
   */
  clickHandler(e) {
    // if the dragged element is a link
    // prevent browsers from folowing the link
    if (this.drag.preventClick) {
      e.preventDefault();
    }
    this.drag.preventClick = false;
  }


  /**
   * Remove item from carousel.
   * @param {number} index - Item index to remove.
   * @param {function} callback - Optional callback to call after remove.
   */
  remove(index, callback) {
    if (index < 0 || index >= this.innerElements.length) {
      throw new Error('Item to remove doesn\'t exist 😭');
    }

    // Shift sliderFrame back by one item when:
    // 1. Item with lower index than currenSlide is removed.
    // 2. Last item is removed.
    const lowerIndex = index < this.currentSlide;
    const lastItem = this.currentSlide + this.perPage - 1 === index;

    if (lowerIndex || lastItem) {
      this.currentSlide--;
    }

    this.innerElements.splice(index, 1);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Insert item to carousel at particular index.
   * @param {HTMLElement} item - Item to insert.
   * @param {number} index - Index of new new item insertion.
   * @param {function} callback - Optional callback to call after insert.
   */
  insert(item, index, callback) {
    if (index < 0 || index > this.innerElements.length + 1) {
      throw new Error('Unable to inset it at this index 😭');
    }
    if (this.innerElements.indexOf(item) !== -1) {
      throw new Error('The same item in a carousel? Really? Nope 😭');
    }

    // Avoid shifting content
    const shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length;
    this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide;

    this.innerElements.splice(index, 0, item);

    // build a frame and slide to a currentSlide
    this.buildSliderFrame();

    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Prepernd item to carousel.
   * @param {HTMLElement} item - Item to prepend.
   * @param {function} callback - Optional callback to call after prepend.
   */
  prepend(item, callback) {
    this.insert(item, 0);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Append item to carousel.
   * @param {HTMLElement} item - Item to append.
   * @param {function} callback - Optional callback to call after append.
   */
  append(item, callback) {
    this.insert(item, this.innerElements.length + 1);
    if (callback) {
      callback.call(this);
    }
  }


  /**
   * Removes listeners and optionally restores to initial markup
   * @param {boolean} restoreMarkup - Determinants about restoring an initial markup.
   * @param {function} callback - Optional callback function.
   */
  destroy(restoreMarkup = false, callback) {
    this.detachEvents();

    this.selector.style.cursor = 'auto';

    if (restoreMarkup) {
      const slides = document.createDocumentFragment();
      for (let i = 0; i < this.innerElements.length; i++) {
        slides.appendChild(this.innerElements[i]);
      }
      this.selector.innerHTML = '';
      this.selector.appendChild(slides);
      this.selector.removeAttribute('style');
    }

    if (callback) {
      callback.call(this);
    }
  }
}

var exports = {};
var CoreCarousel = (function () {
    function CoreCarousel() {
    }
    CoreCarousel.open = function (elements, index) {
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var slide = document.createElement('div');
            slide.className = "carousel-slide";
            slide.append(element);
            CoreCarousel._items.push(slide);
        }
        CorePopup.open(CoreCarousel.html());
        CoreMain.reinitializeLazyLoadingImages();
        var updateArrows = function () {
            var leftArrow = $('.carousel-leftarrow');
            var rightArrow = $('.carousel-rightarrow');
            leftArrow.removeClass('_disabled');
            rightArrow.removeClass('_disabled');
            if (CoreCarousel.currentSlide === 0)
                leftArrow.addClass('_disabled');
            if (CoreCarousel.currentSlide + 1 === CoreCarousel.count)
                rightArrow.addClass('_disabled');
        };
        CoreCarousel._siema = new Siema({
            selector: '.carousel-content',
            onChange: function () {
                updateArrows();
            }
        });
        document.querySelector('.carousel-leftarrow span').addEventListener('click', function () {
            CoreCarousel.prev();
        });
        document.querySelector('.carousel-rightarrow span').addEventListener('click', function () {
            CoreCarousel.next();
        });
        document.querySelector('.carousel-header span').addEventListener('click', function () {
            CoreCarousel.close();
        });
        if (index)
            CoreCarousel.goTo(index);
        else
            updateArrows();
    };
    CoreCarousel.close = function () {
        CoreCarousel._siema = undefined;
        CoreCarousel._items = [];
        CorePopup.close();
    };
    Object.defineProperty(CoreCarousel, "currentSlide", {
        get: function () {
            return this._siema.currentSlide;
        },
        enumerable: true,
        configurable: true
    });
    CoreCarousel.html = function () {
        var carouselElement = "<div class='carousel'>\n                                <div class='carousel-header'><span>\u00D7</span></div>\n                                <div class='carousel-leftarrow'><span>\u2039</span></div>\n                                <div class='carousel-content'>";
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            carouselElement += "<div>" + item.outerHTML + "</div>";
        }
        carouselElement += "</div>\n                            <div class='carousel-rightarrow'><span>\u203A</span></div>\n                            </div>";
        return carouselElement;
    };
    CoreCarousel.goTo = function (index) {
        this._siema.goTo(index);
    };
    CoreCarousel.prev = function () {
        this._siema.prev();
    };
    CoreCarousel.next = function () {
        this._siema.next();
    };
    CoreCarousel.isOpened = function () {
        return this._siema !== undefined;
    };
    Object.defineProperty(CoreCarousel, "count", {
        get: function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    CoreCarousel._items = [];
    return CoreCarousel;
}());
{ CoreCarousel };
$(document).on('keydown', 'body', function (e) {
    if (!CoreCarousel.isOpened())
        return;
    switch (e.keyCode) {
        case 37:
            CoreCarousel.prev();
            break;
        case 39:
            CoreCarousel.next();
            break;
        case 27:
            CoreCarousel.close();
            break;
        default: break;
    }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,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SCxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDckIsTUFBTTtRQUVWLE9BQU8sQ0FBQyxDQUFDLE1BQU07S0FDbEI7QUFDTCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJjYXJvdXNlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNpZW1hIH0gZnJvbSAnLi9TaWVtYSc7XHJcbmltcG9ydCB7IENvcmVNYWluLCBDb3JlUG9wdXAgfSBmcm9tICcuL2NvcmUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvcmVDYXJvdXNlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2l0ZW1zOiBIVE1MRWxlbWVudFtdID0gW107XHJcbiAgICBwcml2YXRlIHN0YXRpYyBfc2llbWE7XHJcblxyXG4gICAgc3RhdGljIG9wZW4oZWxlbWVudHM6IEhUTUxFbGVtZW50W10sIGluZGV4PzogbnVtYmVyKTogdm9pZHtcclxuXHJcbiAgICAgICAgZm9yKGNvbnN0IGVsZW1lbnQgb2YgZWxlbWVudHMpe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgc2xpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc2xpZGUuY2xhc3NOYW1lID0gXCJjYXJvdXNlbC1zbGlkZVwiO1xyXG4gICAgICAgICAgICBzbGlkZS5hcHBlbmQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICBDb3JlQ2Fyb3VzZWwuX2l0ZW1zLnB1c2goc2xpZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQ29yZVBvcHVwLm9wZW4oQ29yZUNhcm91c2VsLmh0bWwoKSk7XHJcbiAgICAgICAgQ29yZU1haW4ucmVpbml0aWFsaXplTGF6eUxvYWRpbmdJbWFnZXMoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlQXJyb3dzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRBcnJvdyA9ICQoJy5jYXJvdXNlbC1sZWZ0YXJyb3cnKTtcclxuICAgICAgICAgICAgY29uc3QgcmlnaHRBcnJvdyA9ICQoJy5jYXJvdXNlbC1yaWdodGFycm93Jyk7XHJcblxyXG4gICAgICAgICAgICBsZWZ0QXJyb3cucmVtb3ZlQ2xhc3MoJ19kaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICByaWdodEFycm93LnJlbW92ZUNsYXNzKCdfZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChDb3JlQ2Fyb3VzZWwuY3VycmVudFNsaWRlID09PSAwKVxyXG4gICAgICAgICAgICAgICAgbGVmdEFycm93LmFkZENsYXNzKCdfZGlzYWJsZWQnKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChDb3JlQ2Fyb3VzZWwuY3VycmVudFNsaWRlICsgMSA9PT0gQ29yZUNhcm91c2VsLmNvdW50KVxyXG4gICAgICAgICAgICAgICAgcmlnaHRBcnJvdy5hZGRDbGFzcygnX2Rpc2FibGVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBDb3JlQ2Fyb3VzZWwuX3NpZW1hID0gbmV3IFNpZW1hKHtcclxuICAgICAgICAgICAgc2VsZWN0b3I6ICcuY2Fyb3VzZWwtY29udGVudCcsXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlOiAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgdXBkYXRlQXJyb3dzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBpZiAob25DaGFuZ2UpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgb25DaGFuZ2UuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2Fyb3VzZWwtbGVmdGFycm93IHNwYW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIENvcmVDYXJvdXNlbC5wcmV2KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbC1yaWdodGFycm93IHNwYW4nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIENvcmVDYXJvdXNlbC5uZXh0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJvdXNlbC1oZWFkZXIgc3BhbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgQ29yZUNhcm91c2VsLmNsb3NlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChpbmRleClcclxuICAgICAgICAgICAgQ29yZUNhcm91c2VsLmdvVG8oaW5kZXgpO1xyXG4gICAgICAgIGVsc2UgdXBkYXRlQXJyb3dzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNsb3NlKCl7XHJcbiAgICAgICAgQ29yZUNhcm91c2VsLl9zaWVtYSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBDb3JlQ2Fyb3VzZWwuX2l0ZW1zID0gW107XHJcbiAgICAgICAgQ29yZVBvcHVwLmNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldCBjdXJyZW50U2xpZGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2llbWEuY3VycmVudFNsaWRlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGh0bWwoKTogc3RyaW5nIHtcclxuXHJcbiAgICAgICAgbGV0IGNhcm91c2VsRWxlbWVudCA9IGA8ZGl2IGNsYXNzPSdjYXJvdXNlbCc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nY2Fyb3VzZWwtaGVhZGVyJz48c3Bhbj7Dlzwvc3Bhbj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjYXJvdXNlbC1sZWZ0YXJyb3cnPjxzcGFuPuKAuTwvc3Bhbj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjYXJvdXNlbC1jb250ZW50Jz5gO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5faXRlbXMpXHJcbiAgICAgICAgICAgIGNhcm91c2VsRWxlbWVudCArPSBcIjxkaXY+XCIgKyBpdGVtLm91dGVySFRNTCArIFwiPC9kaXY+XCI7XHJcblxyXG4gICAgICAgIGNhcm91c2VsRWxlbWVudCArPSBgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdjYXJvdXNlbC1yaWdodGFycm93Jz48c3Bhbj7igLo8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG5cclxuICAgICAgICByZXR1cm4gY2Fyb3VzZWxFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnb1RvKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaWVtYS5nb1RvKGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgcHJldigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaWVtYS5wcmV2KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG5leHQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2llbWEubmV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2llbWEgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IGNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcclxuICAgIH1cclxufVxyXG5cclxuJChkb2N1bWVudCkub24oJ2tleWRvd24nLCAnYm9keScsIGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgaWYgKCFDb3JlQ2Fyb3VzZWwuaXNPcGVuZWQoKSlcclxuICAgICAgICByZXR1cm47XHJcblxyXG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuXHJcbiAgICAgICAgY2FzZSAzNzpcclxuICAgICAgICAgICAgQ29yZUNhcm91c2VsLnByZXYoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgMzk6XHJcbiAgICAgICAgICAgIENvcmVDYXJvdXNlbC5uZXh0KCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIDI3OlxyXG4gICAgICAgICAgICBDb3JlQ2Fyb3VzZWwuY2xvc2UoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xyXG4gICAgfVxyXG59KTsiXX0=
