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
    
    return(this.each(function() {
      var elem = $(this);
      
      if (!elem.is(':checkbox')) {
        return;
      }
      
      elem.css({ opacity: 0 });
      elem.wrap('<div class="' + options.containerClass + '" />');
      elem.after('<div class="' + options.handleClass + '"><div class="' + options.handleRightClass + '"><div class="' + options.handleCenterClass + '" /></div></div>')
          .after('<label class="' + options.labelOffClass + '"><span>'+ options.uncheckedLabel + '</span></label>')
          .after('<label class="' + options.labelOnClass + '"><span>' + options.checkedLabel   + '</span></label>');
      
      var handle    = elem.siblings('.' + options.handleClass),
          offlabel  = elem.siblings('.' + options.labelOffClass),
          offspan   = offlabel.children('span'),
          onlabel   = elem.siblings('.' + options.labelOnClass),
          onspan    = onlabel.children('span'),
          container = elem.parent('.' + options.containerClass);
      
      // Automatically resize the handle
      if (options.resizeHandle) {
        var min = (onlabel.width() < offlabel.width()) ? onlabel.width() : offlabel.width();
        handle.css({ width: min });
      }
      
      // Automatically resize the control
      if (options.resizeContainer) {
        var max = (onlabel.width() > offlabel.width()) ? onlabel.width() : offlabel.width();
        container.css({ width: max + handle.width() + 15 });
      }
      
      offlabel.css({ width: container.width() - 5 });
      
      var rightside = container.width() - handle.width() - 6;
      
      if (elem.is(':checked')) {
        handle.css({   left: rightside });
        onlabel.css({ width: rightside + 4 });
        offspan.css({ marginRight: -rightside });
      } else {
        handle.css({   left: 0 });
        onlabel.css({ width: 0 });
        onspan.css({ marginLeft: -rightside });
      }
      
      // A mousedown anywhere in the control will start tracking for dragging
      var down = function(e) {
        e.preventDefault();
        $.iphoneStyle.clicking = handle;
        var x = e.pageX || e.changedTouches[0].pageX;
        $.iphoneStyle.dragStartPosition = x - (parseInt(handle.css('left')) || 0);
        return false;
      };
      
      container.mousedown(down);
      container.each(function() { this.addEventListener('touchstart', down, false); });
      
      
      // As the mouse moves on the page, animate if we are in a drag state
      var move = function(e) {
        if ($.iphoneStyle.clicking != handle) { return }
        e.preventDefault();

        if (e.pageX != $.iphoneStyle.dragStartPosition) {
          $.iphoneStyle.dragging = true;
        }
        
        var x = e.pageX || e.changedTouches[0].pageX;
        
        var p = (x - $.iphoneStyle.dragStartPosition) / rightside;
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        
        handle.css({ left: p * rightside });
        onlabel.css({ width: p * rightside + 4 });
        offspan.css({ 'marginRight': -p * rightside });
        onspan.css({ 'marginLeft': -(1 - p) * rightside });
        
        return false;
      };
      
      $(document).mousemove(move);
      document.addEventListener('touchmove', move, false);

      
      // When the mouse comes up, leave drag state
      var up = function(e) {
        if ($.iphoneStyle.clicking != handle) { return false }
        e.preventDefault();
        
        if (!$.iphoneStyle.dragging) {
          var is_onstate = elem.attr('checked');
          elem.attr('checked', !is_onstate);
        } else {
          var x = e.pageX || e.changedTouches[0].pageX;

          var p = (x - $.iphoneStyle.dragStartPosition) / rightside;
          elem.attr('checked', (p >= 0.5));
        }
        
        $.iphoneStyle.clicking = null;
        $.iphoneStyle.dragging = null;
        elem.change();
        
        return false;
      };

      $(document).mouseup(up);
      document.addEventListener('touchend', up, false);


      // Animate when we get a change event
      elem.change(function() {
        var is_onstate = elem.attr('checked'),
            new_left   = (is_onstate) ? rightside : 0;

        handle.animate({   left: new_left }, options.duration);
        onlabel.animate({ width: new_left + 4 }, options.duration);
        onspan.animate({ marginLeft: new_left - rightside }, options.duration);
        offspan.animate({ marginRight: -new_left }, options.duration);
      });
      
      // Disable text selection
      $(container, onlabel, offlabel, handle).mousedown(function(e) { e.preventDefault(); return false; });
      if ($.browser.ie) {
        $(container, onlabel, offlabel, handle).bind('startselect', function() { return false; });
      }
    }));
  };
})(jQuery);