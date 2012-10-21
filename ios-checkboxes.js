/**
@import "compass/css3/opacity"

$iphone-style-mode: "cross-browser"
$iphone-style-font: "Helvetica Neue", Arial, Helvetica, sans-serif

=iphone-style-defaults($selector-prefix: "ios-checkbox-")
  .#{$selector-prefix}Container
    +iphone-style-container
    &, label
      +iphone-style-disable-text-selection

  .#{$selector-prefix}Disabled
    +iphone-style-disabled
      
  label
    &.#{$selector-prefix}LabelOn
      +iphone-style-label-on
    &.#{$selector-prefix}LabelOff
      +iphone-style-label-off
      
  .#{$selector-prefix}Handle
    +iphone-style-handle
    
  .#{$selector-prefix}HandleRight
    +iphone-style-handle-right
    
  .#{$selector-prefix}HandleCenter
    +iphone-style-handle-center

=iphone-style-disable-text-selection
  user-select: none
  -moz-user-select: none
  -khtml-user-select: none

=iphone-style-disabled
  +opacity(0.5)

=iphone-style-container
  position: relative
  height: 27px
  cursor: pointer
  overflow: hidden
  input
    position: absolute
    top: 5px
    left: 30px
    +opacity(0)
  label
    white-space: nowrap
    font-size: 17px
    line-height: 17px
    font-weight: bold
    font-family: $iphone-style-font
    text-transform: uppercase
    cursor: pointer
    display: block
    height: 27px
    position: absolute
    width: auto
    top: 0
    padding-top: 5px
    overflow: hidden

=iphone-style-label-on
  color: #fff
  background: image-url("iphone-style-checkboxes/on.png") no-repeat
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.6)
  left: 0
  padding-top: 5px
  span
    padding-left: 8px

=iphone-style-label-off
  color: #8B8B8B
  background: image-url("iphone-style-checkboxes/off.png") no-repeat right 0
  text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.6)
  text-align: right
  right: 0
  span
    padding-right: 8px

=iphone-style-handle
  display: block
  height: 27px
  cursor: pointer
  position: absolute
  top: 0
  left: 0
  width: 0
  background: image-url("iphone-style-checkboxes/slider_left.png") no-repeat
  padding-left: 3px

=iphone-style-handle-right
  height: 100%
  width: 100%
  padding-right: 3px
  background: image-url("iphone-style-checkboxes/slider_right.png") no-repeat right 0

=iphone-style-handle-center
  height: 100%
  width: 100%
  background: image-url("iphone-style-checkboxes/slider_center.png")
*/

(function(window, $, undefined) {
  "use strict";

  var slice = [].slice;

  var indexOf = Array.prototype.indexOf || function _indexOf(searchElement) {
    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;

    var n = 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n) // shortcut for verifying if it's NaN
        n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    if (n >= len)
      return -1;

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };

  /**
   * Shared controller and options for all instances.
   */
  var iOSCheckboxes = {
    /**
     * An array of current instances.
     * @type {Array}
     */
    instances: [],

    /**
     * Add another instance to the list.
     * @param {IOSCheckbox} instance The instance to add.
     */
    push: function _pushInstance(instance) {
      iOSCheckboxes.instances.push(instance);
      
      // Start polling on first init.
      if (iOSCheckboxes.instances.length === 1) {
        iOSCheckboxes.poll();
      }
    },

    /**
     * How often to poll for changes.
     * @type {Number}
     */
    pollFrequency: 200,

    /**
     * Poll the current checkboxes to see if they changes.
     */
    poll: function _pollCheckboxes() {
      var keepPolling = false;

      for (var i = 0; i < iOSCheckboxes.instances.length; i++) {
        if (iOSCheckboxes.instances[i].polling) {
          keepPolling = true;
          iOSCheckboxes.instances[i].refresh();
        }
      }

      if (keepPolling) {
        setTimeout(iOSCheckboxes.poll, iOSCheckboxes.pollFrequency);
      }
    }
  };

  /**
   * IOSCheckbox sets up a checkbox to behave and appear as an iOS-styled
   * slider.
   *
   * Examples:
   *
   *   var slider = new IOSCheckbox('my_checkbox', {
   *     checkedLabel: 'Hello',
   *     uncheckedLabel: 'World'
   *   });
   *
   * @param {Element|String} elem The element to operate on or the selector of the element.
   * @param {Object} options Configuration options.
   * @param {Number} options.duration Time to animate on or off.
   * @param {String} options.checkedLabel Text label for "on" state.
   * @param {String} options.uncheckedLabel Text label for "off" state.
   * @param {Boolean} options.resizeHandle Whether the handle resizes to cover the text.
   * @param {Boolean} options.resizeContainer Whether the container resizes to fit the text.
   * @param {String} options.disabledClass CSS class when the input is disabled.
   * @param {String} options.containerClass CSS class on the container.
   * @param {String} options.labelOnClass CSS class on the "on" label.
   * @param {String} options.labelOffClass CSS class on the "off" label.
   * @param {String} options.handleClass CSS class on the handle container.
   * @param {String} options.handleCenterClass CSS class on the center tile of the handle.
   * @param {String} options.handleRightClass CSS class on the right edge of the handle.
   * @param {Number} options.dragThreshold Minium number of pixels which the handle must be dragged, or else it will revert to its original state.
   * @param {Number} options.handleMargin Margin in pixels between the handle and the text.
   * @param {Number} options.handleRadius Radius of the border of the handle in pixels.
   * @param {Number} options.containerRaidus Radius of the container in pixels.
   * @param {String} options.dataName Local cache name.
   * @param {Function} options.onChange The default onChange callback.
   * @param {Boolean} options.polling Whether we should poll for updates.
   */
  function IOSCheckbox(elem, options) {
    // Save options for later.
    this._opts = $.extend({}, options);

    // If elem is a string, treat it as a selector.
    if ('string' === typeof elem) {
      elem = $(elem).eq(0);
    }

    // Store the element we are acting on.
    this._elem = elem;

    // Read the options and initialize other opts to their defaults.
    this._initializeOptions(options);

    // Prepare for onChange listeners.
    this._setupChangeEvents();

    // Convert the checkbox into widget.
    this.prepare();

    iOSCheckboxes.push(this);
  }

  /**
   * Actually change the original element into our new widget.
   */
  IOSCheckbox.prototype.prepare = function prepare() {
    // Whether we've already done this step.
    this._prepared = ('undefined' !== this._prepared) ? this._prepared : false;

    // Don't run this after it's already happened.
    if (this._prepared) {
      return;
    }

    this._isChecked = this._elem.prop('checked');

    // Attach a reference to this controller to the element.
    // this._elem.data(this.dataName, this);

    // Build HTML.
    this._wrapCheckboxWithDivs();

    // on events.
    this._attachEvents();

    // Block text selection.
    this._disableTextSelection();

    // If the handle is resizable, do it.
    if (this.resizeHandle) {
      this._resize('handle');
    }

    // If the container is resizable, do it.
    if (this.resizeContainer) {
      this._resize('container');
    }

    // Setup initial CSS position.
    this._initialPosition();

    // Mark the preparation as complete.
    this._prepared = true;
  };

  /**
   * Tear down the widget, can be re-initialized later.
   */
  IOSCheckbox.prototype.teardown = function teardown() {
    if (!this._prepared) {
      return;
    }

    // Detach data reference.
    $.removeData(this._elem, this.dataName);

    // Remove event listeners
    // Revert HTML

    this._prepared = false;
  };

  /**
   * Teardown and cleanup the widget.
   */
  IOSCheckbox.prototype.destroy = function destroy() {
    this.teardown();

    // Remove from instances.
    var idx = indexOf(iOSCheckboxes, this);
    if (idx > -1) {
      iOSCheckboxes.splice(idx, 1);
    }

    var doNothing = function() {};
    // Destroy any garbage we may be holding on to.
    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        if ('function' === typeof this[key]) {
          // Make all future function calls, no-ops.
          this[key] = doNothing;
        } else {
          this[key] = null;
        }
      }
    }
  };

  /**
   * Initialize configurable options.
   */
  IOSCheckbox.prototype._initializeOptions = function _initializeOptions() {
    // Time to animate on or off.
    this.duration = 200;

    // Text label for "on" state.
    this.checkedLabel = 'ON';

    // Text label for "off" state.
    this.uncheckedLabel = 'OFF';

    // Whether the handle resizes to cover the text.
    this.resizeHandle = true;

    // Whether the container resizes to fit the text.
    this.resizeContainer = true;

    // CSS class when the input is disabled.
    this.disabledClass = 'ios-checkbox-disabled';

    // CSS class on the container.
    this.containerClass = 'ios-checkbox-container';

    // CSS class on the "on" label.
    this.labelOnClass = 'ios-checkbox-on';

    // CSS class on the "off" label.
    this.labelOffClass = 'ios-checkbox-off';

    // CSS class on the handle container.
    this.handleClass = 'ios-checkbox-handle-container';

    // CSS class on the center tile of the handle.
    this.handleCenterClass = 'ios-checkbox-handle-center';

    // CSS class on the right edge of the handle.
    this.handleRightClass = 'ios-checkbox-handle-right';

    // Minium number of pixels which the handle must be dragged,
    // or else it will revert to its original state.
    this.dragThreshold = 5;

    // Margin in pixels between the handle and the text.
    this.handleMargin = 15;

    // Radius of the border of the handle in pixels.
    this.handleRadius = 4;

    // Radius of the container in pixels.
    this.containerRadius = 5;

    // Local cache name.
    this.dataName = "iphoneStyle";

    // The default onChange callback.
    this.onChange = null;

    // Whether we should poll for updates.
    this.polling = true;

    // Take the incoming options
    if ('undefined' !== typeof this._opts) {
      for (var key in this._opts) {
        if (this._opts.hasOwnProperty(key) && this.hasOwnProperty(key)) {
          this[key] = this._opts[key];
        }
      }
    }
  };

  /**
   * Setup the list of change callbacks, including the one passed in to
   * the initial options if given.
   * @private
   */
  IOSCheckbox.prototype._setupChangeEvents = function _setupChangeEvents() {
    this._onChangeEvents = [];

    if ('function' === typeof this.onChange) {
      this._onChangeEvents.push(this.onChange);
    }
  };

  /**
   * Add onChange listener.
   * @param {Function} cb The function to call on change.
   */
  IOSCheckbox.prototype.change = function change(cb) {
    if (indexOf(cb) === -1) {
      this._onChangeEvents.push(cb);
    }
  };

  /**
   * Notify listens of a change.
   * @private
   */
  IOSCheckbox.prototype._didChange = function _didChange() {
    for (var i = 0; i < this._onChangeEvents.length; i++) {
      this._onChangeEvents[i](this._elem, this._isChecked);
    }
  };

  /**
   * Remove onChange listener.
   * @param {Function} cb The function to remove on change callback.
   */
  IOSCheckbox.prototype.removeChangeCallback = function removeChangeCallback(cb) {
    var idx = indexOf(cb);
    if (idx !== -1) {
      this._onChangeEvents.splice(idx, 1);
    }
  };

  /**
   * Whether the checkbox is disabled.
   * @return {Boolean} Whether the checkbox is disabled.
   */
  IOSCheckbox.prototype.isDisabled = function isDisabled() {
    return this._elem.disabled === true;
  };

  /**
   * Add styling and control elements to dom.
   * @private
   */
  IOSCheckbox.prototype._wrapCheckboxWithDivs = function _wrapCheckboxWithDivs() {
    this._elem.wrap("<div class='" + this.containerClass + "' />");
    this.container = this._elem.parent();
    this.offLabel = $("<label class='" + this.labelOffClass + "'><span>" + this.uncheckedLabel + "</span></label>").appendTo(this.container);
    this.offSpan = this.offLabel.children('span');
    this.onLabel = $("<label class='" + this.labelOnClass + "'><span>" + this.checkedLabel + "</span></label>").appendTo(this.container);
    this.onSpan = this.onLabel.children('span');
    this.handle = $("<div class='" + this.handleClass + "'><div class='" + this.handleRightClass + "'><div class='" + this.handleCenterClass + "' /></div></div>").appendTo(this.container);
  };

  /**
   * Disable text selection of elements.
   * @private
   */
  IOSCheckbox.prototype._disableTextSelection = function _disableTextSelection() {
    if (!$.browser.msie) { return; }

    $([this.handle, this.offLabel, this.onLabel, this.container]).attr("unselectable", "on");
  };

  /**
   * Calculate the dimension of an element.
   * @private
   * @return {Number} The dimension in pixels.
   */
  IOSCheckbox.prototype._getDimension = function _getDimension(elem, dimension) {
    var hiddenParents = elem.parents().andSelf().filter(':hidden');
    var tmp = [];

    hiddenParents.each(function() {
      var $this = $(this);
      tmp.push($this.attr('style'));
      $this.attr('style', 'visibility: hidden !important; display: block !important;');
    });

    var value = elem[dimension]();

    // restore origin style values
    hiddenParents.each(function(i) {
      if('undefined' === typeof tmp[i]) {
        $(this).removeAttr('style');
      } else {
        $(this).attr('style', tmp[i]);
      }
    });

    return value;
  };

  /**
   * Resize control to fit.
   * @private
   * @param {String} mode Which element to resize.
   */
  IOSCheckbox.prototype._resize = function _resize(mode) {
    var newWidth;
    var onLabelWidth = this._getDimension(this.onLabel, 'width');
    var offLabelWidth = this._getDimension(this.offLabel, 'width');

    if (mode === 'container') {
      newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
      newWidth += this._getDimension(this.handle, 'width') + this.handleMargin;
      this.container.css('width', newWidth + 'px');
    } else {
      newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
      this.handle.css('width', newWidth + 'px');
    }
  };

  IOSCheckbox.prototype._onMouseDown = function(event) {
    var x;
    event.preventDefault();
    if (this.isDisabled()) return;
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    IOSCheckbox.currentlyClicking = this.handle;
    IOSCheckbox.dragStartPosition = x;
    return IOSCheckbox.handleLeftOffset = parseInt(this.handle.css('left'), 10) || 0;
  };

  IOSCheckbox.prototype.onDragMove = function(event, x) {
    var newWidth, p;
    if (IOSCheckbox.currentlyClicking !== this.handle) return;
    p = (x + IOSCheckbox.handleLeftOffset - IOSCheckbox.dragStartPosition) / this.rightSide;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    newWidth = p * this.rightSide;
    this.handle.css({
      left: newWidth
    });
    this.onLabel.css({
      width: newWidth + this.handleRadius
    });
    this.offSpan.css({
      marginRight: -newWidth
    });
    return this.onSpan.css({
      marginLeft: -(1 - p) * this.rightSide
    });
  };

  IOSCheckbox.prototype.onDragEnd = function(event, x) {
    if (IOSCheckbox.currentlyClicking !== this.handle) { return; }
    if (this.isDisabled()) { return; }

    if (IOSCheckbox.dragging) {
      var p = (x - IOSCheckbox.dragStartPosition) / this.rightSide;
      this._elem.prop('checked', p >= 0.5);
    } else {
      this._elem.prop('checked', !this._elem.prop('checked'));
    }

    IOSCheckbox.currentlyClicking = null;
    IOSCheckbox.dragging = null;

    this.refresh();
  };

  IOSCheckbox.prototype.refresh = function() {
    var elemIsChecked = this._elem.prop('checked');

    if (this._isChecked === elemIsChecked) { return; }

    this._isChecked = elemIsChecked;
    this._didChange();

    if (this.isDisabled()) {
      this.container.addClass(this.disabledClass);
      return false;
    } else {
      this.container.removeClass(this.disabledClass);
    }

    var new_left = this._elem.prop('checked') ? this.rightSide : 0;

    this.handle.animate({
      left: new_left
    }, this.duration);

    this.onLabel.animate({
      width: new_left + this.handleRadius
    }, this.duration);

    this.offSpan.animate({
      marginRight: -new_left
    }, this.duration);

    this.onSpan.animate({
      marginLeft: new_left - this.rightSide
    }, this.duration);
  };

  IOSCheckbox.prototype._attachEvents = function() {
    var self = this;

    this._elem.change(function() {
      self.refresh();
    });

    function localMouseMove(event) {
      return self._onGlobalMove.apply(self, arguments);
    }

    function localMouseUp(event) {
      self._onGlobalUp.apply(self, arguments);
      $(document).off('mousemove touchmove', localMouseMove);
      $(document).off('mouseup touchend', localMouseUp);
    }
    this.container.on('mousedown touchstart', function(event) {
      self._onMouseDown.apply(self, arguments);
      $(document).on('mousemove touchmove', localMouseMove);
      return $(document).on('mouseup touchend', localMouseUp);
    });
  };

  IOSCheckbox.prototype._initialPosition = function() {
    var containerWidth, offset;
    containerWidth = this._getDimension(this.container, "width");
    this.offLabel.css({
      width: containerWidth - this.containerRadius
    });
    offset = this.containerRadius + 1;
    if ($.browser.msie && $.browser.version < 7) offset -= 3;
    this.rightSide = containerWidth - this._getDimension(this.handle, "width") - offset;
    if (this._elem.is(':checked')) {
      this.handle.css({
        left: this.rightSide
      });
      this.onLabel.css({
        width: this.rightSide + this.handleRadius
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
    if (this.isDisabled()) return this.container.addClass(this.disabledClass);
  };

  IOSCheckbox.prototype._onGlobalMove = function(event) {
    var x;
    if (!(!this.isDisabled() && IOSCheckbox.currentlyClicking)) return;
    event.preventDefault();
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    if (!IOSCheckbox.dragging && (Math.abs(IOSCheckbox.dragStartPosition - x) > this.dragThreshold)) {
      IOSCheckbox.dragging = true;
    }
    return this.onDragMove(event, x);
  };

  IOSCheckbox.prototype._onGlobalUp = function(event) {
    var x;
    if (!IOSCheckbox.currentlyClicking) return;
    event.preventDefault();
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    this.onDragEnd(event, x);
    return false;
  };

  $.fn.iOSCheckbox = $.fn.iphoneStyle = function iOSCheckboxJQuery() {
    var args = 1 <= arguments.length ? slice.call(arguments, 0) : [];

    return $(this).each(function() {
      var checkbox = $(this);

      var existingControl = false;
      for (var j = 0; j < iOSCheckboxes.length; j++) {
        if (checkbox == iOSCheckboxes[j].elem) {
          existingControl = iOSCheckboxes[j];
          break;
        }
      }

      if (existingControl) {
        var method = args[0], params = 2 <= args.length ? slice.call(args, 1) : [];
        var control = existingControl[method];
        if (control != null) {
          control.apply(existingControl, params);
        }
      } else {
        new IOSCheckbox(checkbox, args[0]);
      }
    });
  };

}).call(this, window, jQuery, undefined);