(function(){
  var __hasProp = Object.prototype.hasOwnProperty;
  // iPhone-style Checkboxes Coffee plugin
  // Copyright Thomas Reynolds, licensed GPL & MIT
  // Constructor
  $.iphoneStyle = function iphoneStyle(elem, options) {
    var __a, key, obj, value;
    this.elem = $(elem);
    // Import options into instance variables
    obj = this;
    __a = options;
    for (key in __a) {
      value = __a[key];
      if (__hasProp.call(__a, key)) {
        obj[key] = value;
      }
    }
    // Initialize the control
    this.wrapCheckboxWithDivs();
    this.attachEvents();
    this.disableTextSelection();
    if (this.resizeHandle) {
      this.optionallyResize('handle');
    }
    if (this.resizeContainer) {
      this.optionallyResize('container');
    }
    return this.initialPosition();
  };
  $.iphoneStyle.prototype.isDisabled = function isDisabled() {
    return this.elem.filter(':disabled').length;
  };
  // Wrap the existing input[type=checkbox] with divs for styling and grab DOM references to the created nodes
  $.iphoneStyle.prototype.wrapCheckboxWithDivs = function wrapCheckboxWithDivs() {
    this.elem.wrap('<div class="' + this.containerClass + '" />');
    this.container = this.elem.parent();
    this.offLabel = $('<label class="' + this.labelOffClass + '">' + '<span>' + this.uncheckedLabel + '</span>' + '</label>').appendTo(this.container);
    this.offSpan = this.offLabel.children('span');
    this.onLabel = $('<label class="' + this.labelOnClass + '">' + '<span>' + this.checkedLabel + '</span>' + '</label>').appendTo(this.container);
    this.onSpan = this.onLabel.children('span');
    return this.handle = $('<div class="' + this.handleClass + '">' + '<div class="' + this.handleRightClass + '">' + '<div class="' + this.handleCenterClass + '" />' + '</div>' + '</div>').appendTo(this.container);
  };
  // Disable IE text selection, other browsers are handled in CSS
  $.iphoneStyle.prototype.disableTextSelection = function disableTextSelection() {
    var __a, __b, __c, el;
    if (!$.browser.msie) {
      return null;
    }
    // Elements containing text should be unselectable
    __a = []; __b = [this.handle, this.offLabel, this.onLabel, this.container];
    for (__c = 0; __c < __b.length; __c++) {
      el = __b[__c];
      __a.push($(el).attr("unselectable", "on"));
    }
    return __a;
  };
  // Automatically resize the handle or container
  $.iphoneStyle.prototype.optionallyResize = function optionallyResize(mode) {
    var newWidth, offLabelWidth, onLabelWidth;
    onLabelWidth = this.onLabel.width();
    offLabelWidth = this.offLabel.width();
    newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
    if (mode === "container") {
      newWidth += this.handle.width() + 15;
      return this.container.css({
        width: newWidth
      });
    } else {
      return this.handle.css({
        width: newWidth
      });
    }
  };
  $.iphoneStyle.prototype.attachEvents = function attachEvents() {
    // A mousedown anywhere in the control will start tracking for dragging
    this.container.bind('mousedown touchstart', (function(__this) {
      var __func = function(event) {
        var x;
        event.preventDefault();
        if (this.isDisabled()) {
          return null;
        }
        x = event.pageX || event.changedTouches[0].pageX;
        $.iphoneStyle.currentlyClicking = this.handle;
        return $.iphoneStyle.dragStartPosition = x - (parseInt(this.handle.css('left'), 10) || 0);
      };
      return (function() {
        return __func.apply(__this, arguments);
      });
    })(this));
    // Utilize event bubbling to handle drag on any element beneath the container
    this.container.bind('iPhoneDrag', (function(__this) {
      var __func = function(event, x) {
        var p;
        event.preventDefault();
        if (this.isDisabled()) {
          return null;
        }
        p = (x - $.iphoneStyle.dragStartPosition) / this.rightSide;
        if (p < 0) {
          p = 0;
        }
        if (p > 1) {
          p = 1;
        }
        this.handle.css({
          left: p * this.rightSide
        });
        this.onLabel.css({
          width: p * this.rightSide + 4
        });
        this.offSpan.css({
          marginRight: -p * this.rightSide
        });
        return this.onSpan.css({
          marginLeft: -(1 - p) * this.rightSide
        });
      };
      return (function() {
        return __func.apply(__this, arguments);
      });
    })(this));
    // Utilize event bubbling to handle drag end on any element beneath the container
    this.container.bind('iPhoneDragEnd', (function(__this) {
      var __func = function(event, x) {
        var p;
        if (this.isDisabled()) {
          return null;
        }
        if ($.iphoneStyle.dragging) {
          p = (x - $.iphoneStyle.dragStartPosition) / this.rightSide;
          this.elem.attr('checked', (p >= 0.5));
        } else {
          this.elem.attr('checked', !this.elem.attr('checked'));
        }
        $.iphoneStyle.currentlyClicking = null;
        $.iphoneStyle.dragging = null;
        return this.elem.change();
      };
      return (function() {
        return __func.apply(__this, arguments);
      });
    })(this));
    // Animate when we get a change event
    return this.elem.change((function(__this) {
      var __func = function() {
        var new_left;
        if (this.isDisabled()) {
          this.container.addClass(this.disabledClass);
          return false;
        } else {
          this.container.removeClass(this.disabledClass);
        }
        new_left = this.elem.attr('checked') ? this.rightSide : 0;
        this.handle.animate({
          left: new_left
        }, this.duration);
        this.onLabel.animate({
          width: new_left + 4
        }, this.duration);
        this.offSpan.animate({
          marginRight: -new_left
        }, this.duration);
        return this.onSpan.animate({
          marginLeft: new_left - this.rightSide
        }, this.duration);
      };
      return (function() {
        return __func.apply(__this, arguments);
      });
    })(this));
    // Setup the control's inital position
  };
  $.iphoneStyle.prototype.initialPosition = function initialPosition() {
    var offset;
    this.offLabel.css({
      width: this.container.width() - 5
    });
    offset = $.browser.msie && $.browser.version < 7 ? 3 : 6;
    this.rightSide = this.container.width() - this.handle.width() - offset;
    if (this.elem.filter(':checked').length) {
      this.handle.css({
        left: this.rightSide
      });
      this.onLabel.css({
        width: this.rightSide + 4
      });
      this.offSpan.css({
        marginRight: -this.rightSide
      });
    } else {
      this.onLabel.css({
        width: 0
      });
      this.onSpan.css({
        marginLeft: -this.rightSide
      });
    }
    if (this.isDisabled()) {
      return this.container.addClass(this.disabledClass);
    }
  };
  $.fn.iphoneStyle = function iphoneStyle(options) {
    var __a, __b, checkbox, checkboxes, opt;
    checkboxes = this.filter(':checkbox');
    // Fail early if we don't have any checkboxes passed in
    if (!checkboxes.length) {
      return this;
    }
    // Merge options passed in with global defaults
    opt = $.extend({
    }, $.iphoneStyle.defaults, options);
    __a = checkboxes;
    for (__b = 0; __b < __a.length; __b++) {
      checkbox = __a[__b];
      $(checkbox).data("iphoneStyle", new $.iphoneStyle(checkbox, opt));
    }
    if ((!$.iphoneStyle.initComplete)) {
      // As the mouse moves on the page, animate if we are in a drag state
      $(document).bind('mousemove touchmove', (function(__this) {
        var __func = function(event) {
          var x;
          if (!$.iphoneStyle.currentlyClicking) {
            return null;
          }
          if (event.pageX !== $.iphoneStyle.dragStartPosition) {
            $.iphoneStyle.dragging = true;
          }
          event.preventDefault();
          x = event.pageX || event.changedTouches[0].pageX;
          return $(event.target).trigger('iPhoneDrag', [x]);
        };
        return (function() {
          return __func.apply(__this, arguments);
        });
      })(this));
      // When the mouse comes up, leave drag state
      $(document).bind('mouseup touchend', (function(__this) {
        var __func = function(event) {
          var x;
          if (!$.iphoneStyle.currentlyClicking) {
            return null;
          }
          event.preventDefault();
          x = event.pageX || event.changedTouches[0].pageX;
          return $($.iphoneStyle.currentlyClicking).trigger('iPhoneDragEnd', [x]);
        };
        return (function() {
          return __func.apply(__this, arguments);
        });
      })(this));
      $.iphoneStyle.initComplete = true;
    }
    return this;
  };
  $.iphoneStyle.defaults = {
    // Time spent during slide animation
    duration: 200,
    // Text content of "on" state
    checkedLabel: 'ON',
    // Text content of "off" state
    uncheckedLabel: 'OFF',
    // Automatically resize the handle to cover either label
    resizeHandle: true,
    // Automatically resize the widget to contain the labels
    resizeContainer: true,
    disabledClass: 'iPhoneCheckDisabled',
    containerClass: 'iPhoneCheckContainer',
    labelOnClass: 'iPhoneCheckLabelOn',
    labelOffClass: 'iPhoneCheckLabelOff',
    handleClass: 'iPhoneCheckHandle',
    handleCenterClass: 'iPhoneCheckHandleCenter',
    handleRightClass: 'iPhoneCheckHandleRight'
  };
})();