(function($){
  $.iphoneStyle = {
    defaults: { 
      duration:          200,
      checkedLabel:      'ON', 
      uncheckedLabel:    'OFF', 
      resizeHandle:      true,
      resizeContainer:   true,
      background:        '#fff',
      containerClass:    'iPhoneCheckContainer',
      labelOnClass:      'iPhoneCheckLabelOn',
      labelOffClass:     'iPhoneCheckLabelOff',
      handleClass:       'iPhoneCheckHandle',
      handleCenterClass: 'iPhoneCheckHandleCenter',
      handleRightClass:  'iPhoneCheckHandleRight'
    }
  };
  
  $.fn.iphoneStyle = function(options) {
    options = $.extend({}, $.iphoneStyle.defaults, options);
    
    return this.each(function() {
      var elem = $(this);
      
      if (!elem.is(':checkbox')) {
        return;
      }
      
      elem.css({ opacity: 0 });
      elem.wrap('<div class="' + options.containerClass + '" />');
      elem.after('<div class="' + options.handleClass + '"><div class="' + options.handleRightClass + '"><div class="' + options.handleCenterClass + '" /></div></div>')
          .after('<label class="' + options.labelOffClass + '">'+ options.uncheckedLabel + '</label>')
          .after('<label class="' + options.labelOnClass + '">' + options.checkedLabel   + '</label>');
      
      var handle    = elem.siblings('.' + options.handleClass),
          offlabel  = elem.siblings('.' + options.labelOffClass),
          onlabel   = elem.siblings('.' + options.labelOnClass),
          container = elem.parent('.' + options.containerClass);
      
      // Automatically resize the handle
      if (options.resizeHandle) {
        var min = (onlabel.width() < offlabel.width()) ? onlabel.width() : offlabel.width();
        handle.css({ width: min });
      }
      
      // Automatically resize the control
      if (options.resizeContainer) {
        var max = (onlabel.width() > offlabel.width()) ? onlabel.width() : offlabel.width();
        container.css({ width: max + handle.width() + 24 });
      }
      
      offlabel.css({ width: container.width() - 12 });
      
      var rightside = container.width() - handle.width() - 8;
      
      if (elem.is(':checked')) {
        handle.css({   left: rightside });
        onlabel.css({ width: rightside });
      } else {
        handle.css({   left: 0 });
        onlabel.css({ width: 0 });
      }
      
      container.mouseup(function() {
        var is_onstate = (handle.position().left <= 0);
        elem.attr('checked', is_onstate).change();
        return false;
      });
      
      elem.change(function() {
        var is_onstate = (handle.position().left <= 0),
            new_left   = (is_onstate) ? rightside : 0;

        handle.animate({   left: new_left }, options.duration);
        onlabel.animate({ width: new_left }, options.duration);
      });
      
      // Disable text selection
      $(container, onlabel, offlabel, handle).mousedown(function() { return false; });
      if ($.browser.ie) {
        $(container, onlabel, offlabel, handle).bind('startselect', function() { return false; });
      }
    });
  };
})(jQuery);