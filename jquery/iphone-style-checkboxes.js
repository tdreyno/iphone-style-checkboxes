/*!
// iPhone-style Checkboxes jQuery plugin
// Copyright Thomas Reynolds, licensed GPL & MIT
*/
;(function($, iphoneStyle) {

// One big, nasty global for keeping track of drag state
iPhoneCheckbox = {
  currentlyClicking: null,
  dragStartPosition: null,
};

// Constructor
$[iphoneStyle] = function(elem, options) {
  this.$elem = $(elem);
  
  // Import options into instance variables
  var obj = this;
  $.each(options, function(key, value) {
    obj[key] = value;
  });
  
  this.wrapCheckboxWithDivs();
  this.attachEvents();
  this.disableTextSelection();
  this.optionallyResizeHandler();
  this.optionallyResizeContainer();
  this.initialPosition();
};

$.extend($[iphoneStyle].prototype, {
  // Wrap the existing input[type=checkbox] with divs for styling and grab DOM references to the created nodes
  wrapCheckboxWithDivs: function() {
    this.$elem.wrap('<div class="' + this.containerClass + '" />');
    this.container = this.$elem.parent();
    
    this.offLabel  = $('<label class="'+ this.labelOffClass +'">' +
                         '<span>'+ this.uncheckedLabel +'</span>' +
                       '</label>').appendTo(this.container);
    this.offSpan   = this.offLabel.children('span');
    
    this.onLabel   = $('<label class="'+ this.labelOnClass +'">' +
                         '<span>'+ this.checkedLabel +'</span>' +
                       '</label>').appendTo(this.container);
    this.onSpan    = this.onLabel.children('span');
    
    this.handle    = $('<div class="' + this.handleClass + '">' +
                         '<div class="' + this.handleRightClass + '">' +
                           '<div class="' + this.handleCenterClass + '" />' +
                         '</div>' +
                       '</div>').appendTo(this.container);
  },
  
  // Disable IE text selection, other browsers are handled in CSS
  disableTextSelection: function() {
    if (!$.browser.msie) return;

    // Elements containing text should be unselectable
    $.each([this.handle, this.offLabel, this.onLabel, this.container], function(el) {
      el.attr("unselectable", "on");
    });
  },
  
  // Automatically resize the handle
  optionallyResizeHandler: function() {
    if (!this.resizeHandle) return;
    var min = (this.onLabel.width() < this.offLabel.width()) ? 
                this.onLabel.width() :
                this.offLabel.width();
    this.handle.css({ width: min });
  },
  
  // Automatically resize the control
  optionallyResizeContainer: function() {
    if (!this.resizeContainer) return;
    var max = (this.onLabel.width() > this.offLabel.width()) ? 
                this.onLabel.width() : 
                this.offLabel.width();
    this.container.css({ width: max + this.handle.width() + 15 });
  },
  
  attachEvents: function() {
    var obj = this;
    
    // A mousedown anywhere in the control will start tracking for dragging
    this.container.bind('mousedown touchstart', function(event) {
      event.preventDefault();
      var x = event.pageX || event.changedTouches[0].pageX;
      iPhoneCheckbox.currentlyClicking = obj.handle;
      iPhoneCheckbox.dragStartPosition = x - (parseInt(obj.handle.css('left')) || 0);
    });
    
    // As the mouse moves on the page, animate if we are in a drag state
    $(document).bind('mousemove touchmove', function(event) {
      if (iPhoneCheckbox.currentlyClicking != obj.handle) return;
      if (event.pageX != iPhoneCheckbox.dragStartPosition) iPhoneCheckbox.dragging = true;
      event.preventDefault();

      var x = event.pageX || event.changedTouches[0].pageX;
      var p = (x - iPhoneCheckbox.dragStartPosition) / obj.rightSide;
      if (p < 0) { p = 0; }
      if (p > 1) { p = 1; }

      obj.handle.css({ left: p * obj.rightSide });
      obj.onLabel.css({ width: p * obj.rightSide + 4 });
      obj.offSpan.css({ marginRight: -p * obj.rightSide });
      obj.onSpan.css({ marginLeft: -(1 - p) * obj.rightSide });
    });
    
    // When the mouse comes up, leave drag state
    $(document).bind('mouseup touchend', function(event) {
      if (iPhoneCheckbox.currentlyClicking != obj.handle) return;
      event.preventDefault();

      if (iPhoneCheckbox.dragging) {
        var x = event.pageX || event.changedTouches[0].pageX,
            p = (x - iPhoneCheckbox.dragStartPosition) / obj.rightSide;
        obj.$elem.attr('checked', (p >= 0.5));
      } else {
        obj.$elem.attr('checked', !obj.$elem.attr('checked'));
      }

      iPhoneCheckbox.currentlyClicking = null;
      iPhoneCheckbox.dragging = null;
      obj.$elem.change();
    });
  
    // Animate when we get a change event
    this.$elem.change(function() {
      var new_left = obj.$elem.attr('checked') ? obj.rightSide : 0;

      obj.handle.animate({         left: new_left },                 obj.duration);
      obj.onLabel.animate({       width: new_left + 4 },             obj.duration);
      obj.offSpan.animate({ marginRight: -new_left },                obj.duration);
      obj.onSpan.animate({   marginLeft: new_left - obj.rightSide }, obj.duration);
    });
  },
  
  // Setup the control's inital position
  initialPosition: function() {
    this.offLabel.css({ width: this.container.width() - 5 });

    this.rightSide = this.container.width() - this.handle.width() - 6;

    if (this.$elem.is(':checked')) {
      this.handle.css({ left: this.rightSide });
      this.onLabel.css({ width: this.rightSide + 4 });
      this.offSpan.css({ marginRight: -this.rightSide });
    } else {
      this.onLabel.css({ width: 0 });
      this.onSpan.css({ marginLeft: -this.rightSide });
    }
  }
});

// jQuery-specific code
$.fn[iphoneStyle] = function(options) {
  var checkboxes = this.filter(':checkbox');
  
  // Fail early if we don't have any checkboxes passed in
  if (!checkboxes.length) return this;
  
  // Merge options passed in with global defaults
  var opt = $.extend({}, $[iphoneStyle].defaults, options);
  
  checkboxes.each(function() {
    new $[iphoneStyle](this, opt);
  });  

  return this;
}; // End of $.fn[iphoneStyle]

$[iphoneStyle].defaults = {
  duration:          200,                       // Time spent during slide animation
  checkedLabel:      'ON',                      // Text content of "on" state
  uncheckedLabel:    'OFF',                     // Text content of "off" state
  resizeHandle:      true,                      // Automatically resize the handle to cover either label
  resizeContainer:   true,                      // Automatically resize the widget to contain the labels
  containerClass:    'iPhoneCheckContainer',
  labelOnClass:      'iPhoneCheckLabelOn',
  labelOffClass:     'iPhoneCheckLabelOff',
  handleClass:       'iPhoneCheckHandle',
  handleCenterClass: 'iPhoneCheckHandleCenter',
  handleRightClass:  'iPhoneCheckHandleRight'
};

})(jQuery, 'iphoneStyle');