(function($){
  $.iphoneStyle = {
    defaults: { 
      checkedLabel:      'ON', 
      uncheckedLabel:    'OFF', 
      background:        '#fff',
      containerClass:    'iPhoneCheckContainer',
      labelOnClass:      'iPhoneCheckLabelOn',
      labelOffClass:     'iPhoneCheckLabelOff',
      handleClass:       'iPhoneCheckHandle',
      handleBGClass:     'iPhoneCheckHandleBG',
      handleSliderClass: 'iPhoneCheckHandleSlider'
    }
  }
  
  $.fn.iphoneStyle = function(options) {
    options = $.extend($.iphoneStyle.defaults, options);
    
    return this.each(function() {
      var elem = $(this);
      
      if (!elem.is(':checkbox'))
        return;
      
      elem.css({ opacity: 0 });
      elem.wrap('<div class="' + options.containerClass + '" />');
      elem.after('<div class="' + options.handleClass + '"><div class="' + options.handleBGClass + '" style="background: ' + options.background + '"/><div class="' + options.handleSliderClass + '" /></div>')
          .after('<label class="' + options.labelOffClass + '">'+ options.uncheckedLabel + '</label>')
          .after('<label class="' + options.labelOnClass + '">' + options.checkedLabel   + '</label>');
      
      var handle    = elem.siblings('.' + options.handleClass),
          handlebg  = handle.children('.' + options.handleBGClass),
          offlabel  = elem.siblings('.' + options.labelOffClass),
          onlabel   = elem.siblings('.' + options.labelOnClass),
          container = elem.parent('.' + options.containerClass),
          rightside = container.width() - 39;
      
      container.mouseup(function() {
        var is_onstate = (handle.position().left <= 0);
            new_left   = (is_onstate) ? rightside : 0,
            bgleft     = (is_onstate) ? 34 : 0;

        handlebg.hide();
        handle.animate({ left: new_left }, 100, function() {
          handlebg.css({ left: bgleft }).show();
        });
        
        if (is_onstate) {
          offlabel.animate({ opacity: 0 }, 200);
          onlabel.animate({ opacity: 1 }, 200);
        } else {
          offlabel.animate({ opacity: 1 }, 200);
          onlabel.animate({ opacity: 0 }, 200);
        }
        
        elem.attr('checked', !is_onstate).change();
        return false;
      });
      
      // Disable text selection
      $(container, onlabel, offlabel, handle).mousedown(function() { return false; });
      if ($.browser.ie)
        $(container, onlabel, offlabel, handle).bind('startselect', function() { return false; });
      
      // initial load
      if (elem.is(':checked')) {
        offlabel.css({ opacity: 0 });
        onlabel.css({ opacity: 1 });
        handle.css({ left: rightside });
        handlebg.css({ left: 34 });
      }
    });
  };
})(jQuery);