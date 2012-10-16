/**
@import "compass/css3/opacity"

$iphone-style-mode: "cross-browser"
$iphone-style-font: "Helvetica Neue", Arial, Helvetica, sans-serif

=iphone-style-defaults($selector-prefix: "iPhoneCheck")
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

    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };

  /**
   * iOSCheckbox sets up a checkbox to behave and appear as an iOS-styled
   * slider.
   *
   * Examples:
   *
   *   var slider = new iOSCheckbox('my_checkbox', {
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
   */
  function iOSCheckbox(elem, options) {
    // Save options for later.
    this._opts = options;

    // If elem is a string, treat it as a selector.
    if ('string' === typeof elem) {
      elem = $(elem);
    }

    // Store the element we are acting on.
    this.elem = elem;

    // Read the options and initialize other opts to their defaults.
    this._initializeOptions(options);

    // Prepare for onChange listeners.
    this._setupChangeEvents();

    // Convert the checkbox into widget.
    this.prepare();
  }

  /**
   * Actually change the original element into our new widget.
   */
  iOSCheckbox.prototype.prepare = function prepare() {
    // Whether we've already done this step.
    this._prepared = ('undefined' !== this._prepared) ? this._prepared : false;

    // Don't run this after it's already happened.
    if (this._prepared) {
      return;
    }

    // Attach a reference to this controller to the element.
    this.elem.data(this.dataName, this);

    // Build HTML.
    this._wrapCheckboxWithDivs();

    // Bind events.
    this._attachEvents();

    // Block text selection.
    this._disableTextSelection();

    // If the handle is resizable, do it.
    if (this.resizeHandle) {
      this._optionallyResize('handle');
    }

    // If the container is resizable, do it.
    if (this.resizeContainer) {
      this._optionallyResize('container');
    }

    // Setup initial CSS position.
    this.initialPosition();

    // Mark the preparation as complete.
    this._prepared = true;
  };

  /**
   * Tear down the widget, can be re-initialized later.
   */
  iOSCheckbox.prototype.teardown = function teardown() {
    if (!this._prepared) {
      return;
    }

    // Detach data reference.
    $.removeData(this.elem, this.dataName);

    // Remove event listeners
    // Revert HTML

    this._prepared = false;
  };

  /**
   * Teardown and cleanup the widget.
   */
  iOSCheckbox.prototype.destroy = function destroy() {
    this.teardown();

    // Destroy any garbage we may be holding on to.
    for (var key in this) {
      if (this.hasOwnProperty(key)) {
        if ('function' === typeof this[key]) {
          // Make all future function calls, no-ops.
          this[key] = function() {};
        } else {
          this[key] = null;
        }
      }
    }
  };

  /**
   * Initialize configurable options.
   */
  iOSCheckbox.prototype._initializeOptions = function _initializeOptions() {
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
    this.disabledClass = 'iPhoneCheckDisabled';

    // CSS class on the container.
    this.containerClass = 'iPhoneCheckContainer';

    // CSS class on the "on" label.
    this.labelOnClass = 'iPhoneCheckLabelOn';

    // CSS class on the "off" label.
    this.labelOffClass = 'iPhoneCheckLabelOff';

    // CSS class on the handle container.
    this.handleClass = 'iPhoneCheckHandle';

    // CSS class on the center tile of the handle.
    this.handleCenterClass = 'iPhoneCheckHandleCenter';

    // CSS class on the right edge of the handle.
    this.handleRightClass = 'iPhoneCheckHandleRight';

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

    // Take the incoming options
    if ('undefined' !== typeof this._opts) {
      for (var key of this._opts) {
        if (this._opts.hasOwnProperty(key) && this.hasOwnProperty(key)) {
          this[key] = this._opts[key];
        }
      }
    }
  };

  /**
   * Setup the list of change callbacks, including the one passed in to
   * the initial options if given.
   */
  iOSCheckbox.prototype._setupChangeEvents = function _setupChangeEvents() {
    this._onChangeEvents = [];

    if ('function' === typeof this.onChange) {
      this._onChangeEvents.push(this.onChange);
    }
  };

  /**
   * Add onChange listener.
   * @param {Function} cb The function to call on change.
   */
  iOSCheckbox.prototype.change = function change(cb) {
    if (indexOf(cb) === -1) {
      this._onChangeEvents.push(cb);
    }
  };

  /**
   * Remove onChange listener.
   * @param {Function} cb The function to remove on change callback.
   */
  iOSCheckbox.prototype.removeChangeCallback = function removeChangeCallback(cb) {
    var idx = indexOf(cb);
    if (idx !== -1) {
      this._onChangeEvents.splice(idx, 1);
    }
  };

  /**
   * Whether the checkbox is disabled.
   * @return {Boolean} Whether the checkbox is disabled.
   */
  iOSCheckbox.prototype.isDisabled = function() {
    return this.elem.disabled === true;
  };

  iOSCheckbox.prototype._wrapCheckboxWithDivs = function() {
    this.elem.wrap("<div class='" + this.containerClass + "' />");
    this.container = this.elem.parent();
    this.offLabel = $("<label class='" + this.labelOffClass + "'>\n  <span>" + this.uncheckedLabel + "</span>\n</label>").appendTo(this.container);
    this.offSpan = this.offLabel.children('span');
    this.onLabel = $("<label class='" + this.labelOnClass + "'>\n  <span>" + this.checkedLabel + "</span>\n</label>").appendTo(this.container);
    this.onSpan = this.onLabel.children('span');
    return this.handle = $("<div class='" + this.handleClass + "'>\n  <div class='" + this.handleRightClass + "'>\n    <div class='" + this.handleCenterClass + "' />\n  </div>\n</div>").appendTo(this.container);
  };

  iOSCheckbox.prototype._disableTextSelection = function() {
    if ($.browser.msie) {
      return $([this.handle, this.offLabel, this.onLabel, this.container]).attr("unselectable", "on");
    }
  };

  iOSCheckbox.prototype._getDimension = function(elem, dimension) {
      return elem.actual(dimension);
/*
  $.fn.extend({
    actual : function ( method, options ){
      // check if the jQuery method exist
      if( !this[ method ]){
        throw '$.actual => The jQuery method "' + method + '" you called does not exist';
      }

      var defaults = {
        absolute      : false,
        clone         : false,
        includeMargin : false
      };

      var configs = $.extend( defaults, options );

      var $target = this;
      var fix, restore;

      if( configs.clone === true ){
        fix = function (){
          var style = 'position: absolute !important; top: -1000 !important; ';

          // this is useful with css3pie
          $target = $target.
            filter( ':first' ).
            clone().
            attr( 'style', style ).
            appendTo( 'body' );
        };

        restore = function (){
          // remove DOM element after getting the width
          $target.remove();
        };
      }else{
        var tmp = [];
        var $hidden, style;

        fix = function (){
          // get all hidden parents
          $hidden = $target.
            parents().
            andSelf().
            filter( ':hidden' );

          style += 'visibility: hidden !important; display: block !important; ';

          if( configs.absolute === true ) style += 'position: absolute !important; ';

          // save the origin style props
          // set the hidden el css to be got the actual value later
          $hidden.each( function (){
            var $this = $( this );

            // Save original style. If no style was set, attr() returns undefined
            tmp.push( $this.attr( 'style' ));
            $this.attr( 'style', style );
          });
        };

        restore = function (){
          // restore origin style values
          $hidden.each( function ( i ){
            var $this = $( this );
            var _tmp  = tmp[ i ];

            if( _tmp === undefined ){
              $this.removeAttr( 'style' );
            }else{
              $this.attr( 'style', _tmp );
            }
          });
        };
      }

      fix();
      // get the actual value with user specific methed
      // it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
      // configs.includeMargin only works for 'outerWidth' and 'outerHeight'
      var actual = /(outer)/g.test( method ) ?
        $target[ method ]( configs.includeMargin ) :
        $target[ method ]();

      restore();
      // IMPORTANT, this plugin only return the value of the first element
      return actual;
    }
  });
*/
  };

  iOSCheckbox.prototype._optionallyResize = function(mode) {
    var newWidth;
    var onLabelWidth = this._getDimension(this.onLabel, 'width');
    var offLabelWidth = this._getDimension(this.offLabel, 'width');

    if (mode === 'container') {
      newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
      newWidth += this._getDimension(this.handle, 'width') + this.handleMargin;
      this.container.style.width = newWidth + 'px';
    } else {
      newWidth = onLabelWidth > offLabelWidth ? onLabelWidth : offLabelWidth;
      this.handle.style.width = newWidth + 'px';

    }
  };

  iOSCheckbox.prototype.onMouseDown = function(event) {
    var x;
    event.preventDefault();
    if (this.isDisabled()) return;
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    iOSCheckbox.currentlyClicking = this.handle;
    iOSCheckbox.dragStartPosition = x;
    return iOSCheckbox.handleLeftOffset = parseInt(this.handle.css('left'), 10) || 0;
  };

  iOSCheckbox.prototype.onDragMove = function(event, x) {
    var newWidth, p;
    if (iOSCheckbox.currentlyClicking !== this.handle) return;
    p = (x + iOSCheckbox.handleLeftOffset - iOSCheckbox.dragStartPosition) / this.rightSide;
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

  iOSCheckbox.prototype.onDragEnd = function(event, x) {
    var p;
    if (iOSCheckbox.currentlyClicking !== this.handle) return;
    if (this.isDisabled()) return;
    if (iOSCheckbox.dragging) {
      p = (x - iOSCheckbox.dragStartPosition) / this.rightSide;
      this.elem.prop('checked', p >= 0.5);
    } else {
      this.elem.prop('checked', !this.elem.prop('checked'));
    }
    iOSCheckbox.currentlyClicking = null;
    iOSCheckbox.dragging = null;
    return this.didChange();
  };

  iOSCheckbox.prototype.refresh = function() {
    return this.didChange();
  };

  iOSCheckbox.prototype.didChange = function() {
    var new_left;
    if (typeof this.onChange === 'function') {
      this.onChange(this.elem, this.elem.prop('checked'));
    }
    if (this.isDisabled()) {
      this.container.addClass(this.disabledClass);
      return false;
    } else {
      this.container.removeClass(this.disabledClass);
    }
    new_left = this.elem.prop('checked') ? this.rightSide : 0;
    this.handle.animate({
      left: new_left
    }, this.duration);
    this.onLabel.animate({
      width: new_left + this.handleRadius
    }, this.duration);
    this.offSpan.animate({
      marginRight: -new_left
    }, this.duration);
    return this.onSpan.animate({
      marginLeft: new_left - this.rightSide
    }, this.duration);
  };

  iOSCheckbox.prototype._attachEvents = function() {
    var localMouseMove, localMouseUp, self;
    self = this;
    localMouseMove = function(event) {
      return self.onGlobalMove.apply(self, arguments);
    };
    localMouseUp = function(event) {
      self.onGlobalUp.apply(self, arguments);
      $(document).unbind('mousemove touchmove', localMouseMove);
      return $(document).unbind('mouseup touchend', localMouseUp);
    };
    this.elem.change(function() {
      return self.refresh();
    });
    return this.container.bind('mousedown touchstart', function(event) {
      self.onMouseDown.apply(self, arguments);
      $(document).bind('mousemove touchmove', localMouseMove);
      return $(document).bind('mouseup touchend', localMouseUp);
    });
  };

  iOSCheckbox.prototype.initialPosition = function() {
    var containerWidth, offset;
    containerWidth = this._getDimension(this.container, "width");
    this.offLabel.css({
      width: containerWidth - this.containerRadius
    });
    offset = this.containerRadius + 1;
    if ($.browser.msie && $.browser.version < 7) offset -= 3;
    this.rightSide = containerWidth - this._getDimension(this.handle, "width") - offset;
    if (this.elem.is(':checked')) {
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

  iOSCheckbox.prototype.onGlobalMove = function(event) {
    var x;
    if (!(!this.isDisabled() && iOSCheckbox.currentlyClicking)) return;
    event.preventDefault();
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    if (!iOSCheckbox.dragging && (Math.abs(iOSCheckbox.dragStartPosition - x) > this.dragThreshold)) {
      iOSCheckbox.dragging = true;
    }
    return this.onDragMove(event, x);
  };

  iOSCheckbox.prototype.onGlobalUp = function(event) {
    var x;
    if (!iOSCheckbox.currentlyClicking) return;
    event.preventDefault();
    x = event.pageX || event.originalEvent.changedTouches[0].pageX;
    this.onDragEnd(event, x);
    return false;
  };

  $.fn.iphoneStyle = function jQueryIphoneStyle() {
    var args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    var dataName = (_ref = (_ref2 = args[0]) != null ? _ref2.dataName : void 0) != null ? _ref : iOSCheckbox.defaults.dataName;

    for (var i = 0, len = this.length; i < len; i++) {
      var checkbox = this[i];
      var existingControl = $(checkbox).data(dataName);

      if (existingControl != null) {
        var method = args[0], params = 2 <= args.length ? slice.call(args, 1) : [];
        if ((var control = existingControl[method]) != null) {
          control.apply(existingControl, params);
        }
      } else {
        new iOSCheckbox(checkbox, args[0]);
      }
    }
    return this;
  };

}).call(this, window, jQuery, undefined);