/*!
// iPhone-style Checkboxes jQuery plugin
// Copyright Thomas Reynolds, licensed GPL & MIT
*/
;(function($, iphoneStyle) {

// Constructor
$[iphoneStyle] = function(elem, options) {
  this.$elem = $(elem);
  
  // Import options into instance variables
  var obj = this;
  $.each(options, function(key, value) {
    obj[key] = value;
  });
  
  // Initialize the control
  this.wrapCheckboxWithDivs();
  this.attachEvents();
  this.disableTextSelection();
  
  if (this.resizeHandle)    { this.optionallyResize('handle'); }
  if (this.resizeContainer) { this.optionallyResize('container'); }
  
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
    if (!$.browser.msie) { return; }

    // Elements containing text should be unselectable
    $.each([this.handle, this.offLabel, this.onLabel, this.container], function(el) {
      $(el).attr("unselectable", "on");
    });
  },
  
  // Automatically resize the handle or container
  optionallyResize: function(mode) {
    var onLabelWidth  = this.onLabel.width(),
        offLabelWidth = this.offLabel.width();
        
    if (mode == 'container') {
      var newWidth = (onLabelWidth > offLabelWidth) ? onLabelWidth : offLabelWidth;
      newWidth += this.handle.width() + 15; 
    } else { 
      var newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
    }
    
    this[mode].css({ width: newWidth });
  },
  
  attachEvents: function() {
    var obj = this;
    
    // A mousedown anywhere in the control will start tracking for dragging
    this.container
      .bind('mousedown touchstart', function(event) {          
        event.preventDefault();
        
        if (obj.$elem.is(':disabled')) { return; }
          
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        $[iphoneStyle].currentlyClicking = obj.handle;
        $[iphoneStyle].dragStartPosition = x;
        $[iphoneStyle].handleLeftOffset  = parseInt(obj.handle.css('left'), 10) || 0;
      })
    
      // Utilize event bubbling to handle drag on any element beneath the container
      .bind('iPhoneDrag', function(event, x) {
        event.preventDefault();
        
        if (obj.$elem.is(':disabled')) { return; }
        
        var p = (x + $[iphoneStyle].handleLeftOffset - $[iphoneStyle].dragStartPosition) / obj.rightSide;
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        obj.handle.css({ left: p * obj.rightSide });
        obj.onLabel.css({ width: p * obj.rightSide + 4 });
        obj.offSpan.css({ marginRight: -p * obj.rightSide });
        obj.onSpan.css({ marginLeft: -(1 - p) * obj.rightSide });
      })
    
        // Utilize event bubbling to handle drag end on any element beneath the container
      .bind('iPhoneDragEnd', function(event, x) {
        if (obj.$elem.is(':disabled')) { return; }
        
        if ($[iphoneStyle].dragging) {
          var p = (x - $[iphoneStyle].dragStartPosition) / obj.rightSide;
          obj.$elem.attr('checked', (p >= 0.5));
        } else {
          obj.$elem.attr('checked', !obj.$elem.attr('checked'));
        }

        $[iphoneStyle].currentlyClicking = null;
        $[iphoneStyle].dragging = null;
        obj.$elem.change();
      });
  
    // Animate when we get a change event
    this.$elem.change(function() {
      if (obj.$elem.is(':disabled')) {
        obj.container.addClass(obj.disabledClass);
        return false;
      } else {
        obj.container.removeClass(obj.disabledClass);
      }
      
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

    var offset = ($.browser.msie && $.browser.version < 7) ? 3 : 6;
    this.rightSide = this.container.width() - this.handle.width() - offset;

    if (this.$elem.is(':checked')) {
      this.handle.css({ left: this.rightSide });
      this.onLabel.css({ width: this.rightSide + 4 });
      this.offSpan.css({ marginRight: -this.rightSide });
    } else {
      this.onLabel.css({ width: 0 });
      this.onSpan.css({ marginLeft: -this.rightSide });
    }
    
    if (this.$elem.is(':disabled')) {
      this.container.addClass(this.disabledClass);
    }
  }
});

// jQuery-specific code
$.fn[iphoneStyle] = function(options) {
  var checkboxes = this.filter(':checkbox');
  
  // Fail early if we don't have any checkboxes passed in
  if (!checkboxes.length) { return this; }
  
  // Merge options passed in with global defaults
  var opt = $.extend({}, $[iphoneStyle].defaults, options);
  
  checkboxes.each(function() {
    $(this).data(iphoneStyle, new $[iphoneStyle](this, opt));
  });

  if (!$[iphoneStyle].initComplete) {
    // As the mouse moves on the page, animate if we are in a drag state
    $(document)
      .bind('mousemove touchmove', function(event) {
        if (!$[iphoneStyle].currentlyClicking) { return; }
        event.preventDefault();
        
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        if (!$[iphoneStyle].dragging &&
            (Math.abs($[iphoneStyle].dragStartPosition - x) > opt.dragThreshold)) { 
          $[iphoneStyle].dragging = true; 
        }
    
        $(event.target).trigger('iPhoneDrag', [x]);
      })

      // When the mouse comes up, leave drag state
      .bind('mouseup touchend', function(event) {        
        if (!$[iphoneStyle].currentlyClicking) { return; }
        event.preventDefault();
    
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        $($[iphoneStyle].currentlyClicking).trigger('iPhoneDragEnd', [x]);
      });
      
    $[iphoneStyle].initComplete = true;
  }
  
  return this;
}; // End of $.fn[iphoneStyle]

$[iphoneStyle].defaults = {
  duration:          200,                       // Time spent during slide animation
  checkedLabel:      'ON',                      // Text content of "on" state
  uncheckedLabel:    'OFF',                     // Text content of "off" state
  resizeHandle:      true,                      // Automatically resize the handle to cover either label
  resizeContainer:   true,                      // Automatically resize the widget to contain the labels
  disabledClass:     'iPhoneCheckDisabled',
  containerClass:    'iPhoneCheckContainer',
  labelOnClass:      'iPhoneCheckLabelOn',
  labelOffClass:     'iPhoneCheckLabelOff',
  handleClass:       'iPhoneCheckHandle',
  handleCenterClass: 'iPhoneCheckHandleCenter',
  handleRightClass:  'iPhoneCheckHandleRight',
  dragThreshold:     5                          // Pixels that must be dragged for a click to be ignored
};

})(jQuery, 'iphoneStyle');
