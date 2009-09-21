;(function($) {
  $.iphoneStyle = {
    defaults: {
      duration:          200,
      checkedLabel:      'ON',
      uncheckedLabel:    'OFF',
      resizeHandle:      true,
      resizeContainer:   true,
      containerClass:    'iPhoneCheckContainer',
      labelOnClass:      'iPhoneCheckLabelOn',
      labelOffClass:     'iPhoneCheckLabelOff',
      handleClass:       'iPhoneCheckHandle',
      handleCenterClass: 'iPhoneCheckHandleCenter',
      handleRightClass:  'iPhoneCheckHandleRight'
    }
  };

  $.fn.iphoneStyle = function(o) {
    o = $.extend({}, $.iphoneStyle.defaults, o);

    this.filter(':checkbox')
        .css({ opacity: 0 })
        .wrap('<div class="'+o.containerClass+'" />')
        .after('<div class="'+o.handleClass+'"><div class="'+o.handleRightClass+'"><div class="'+o.handleCenterClass+'" /></div></div>')
        .after('<label class="'+ o.labelOffClass +'"><span>'+ o.uncheckedLabel +'</span></label>')
        .after('<label class="'+ o.labelOnClass +'"><span>'+ o.checkedLabel +'</span></label>')
        .each(function() {

      var elem      = $(this),
          handle    = elem.siblings('.' + o.handleClass),
          offLabel  = elem.siblings('.' + o.labelOffClass),
          offSpan   = offLabel.children('span'),
          onLabel   = elem.siblings('.' + o.labelOnClass),
          onSpan    = onLabel.children('span'),
          container = elem.parent();

      // Automatically resize the handle
      if (o.resizeHandle) {
        var min = (onLabel.width() < offLabel.width()) ? onLabel.width() : offLabel.width();
        handle.css({ width: min });
      }

      // Automatically resize the control
      if (o.resizeContainer) {
        var max = (onLabel.width() > offLabel.width()) ? onLabel.width() : offLabel.width();
        container.css({ width: max + handle.width() + 15 });
      }

      offLabel.css({ width: container.width() - 5 });

      var rightSide = container.width() - handle.width() - 6;

      if (elem.is(':checked')) {
        handle.css({ left: rightSide });
        onLabel.css({ width: rightSide + 4 });
        offSpan.css({ marginRight: -rightSide });
      } else {
        handle.css({ left: 0 });
        onLabel.css({ width: 0 });
        onSpan.css({ marginLeft: -rightSide });
      }

      // Disable text selection
      $(container, onLabel, offLabel, handle).bind('mousedown startselect', function(event) {
        event.preventDefault();
      });

      // A mousedown anywhere in the control will start tracking for dragging
      container.bind('mousedown touchstart', function(event) {
        event.preventDefault();
        $.iphoneStyle.clicking = handle;
        var x = event.pageX || event.changedTouches[0].pageX;
        $.iphoneStyle.dragStartPosition = x - (parseInt(handle.css('left')) || 0);
      });

      $(document)
        // As the mouse moves on the page, animate if we are in a drag state
        .bind('mousemove touchmove', function(event) {
          event.preventDefault();

          if ($.iphoneStyle.clicking != handle) { return; }

          if (event.pageX != $.iphoneStyle.dragStartPosition) {
            $.iphoneStyle.dragging = true;
          }

          var x = event.pageX || event.changedTouches[0].pageX,
              p = (x - $.iphoneStyle.dragStartPosition) / rightSide;

          if (p < 0) { p = 0; }
          if (p > 1) { p = 1; }

          handle.css({ left: p * rightSide });
          onLabel.css({ width: p * rightSide + 4 });
          offSpan.css({ marginRight: -p * rightSide });
          onSpan.css({ marginLeft: -(1 - p) * rightSide });
        })

        // When the mouse comes up, leave drag state
        .bind('mouseup touchend', function(event) {
          event.preventDefault();

          if ($.iphoneStyle.clicking != handle) { return; }

          if ($.iphoneStyle.dragging) {
            var x = event.pageX || event.changedTouches[0].pageX,
                p = (x - $.iphoneStyle.dragStartPosition) / rightSide;
            elem.attr('checked', (p >= 0.5));
          } else {
            elem.attr('checked', !elem.attr('checked'));
          }

          $.iphoneStyle.clicking = null;
          $.iphoneStyle.dragging = null;
          elem.change();
        });

      // Animate when we get a change event
      elem.change(function() {
        var new_left   = elem.attr('checked') ? rightSide : 0;

        handle.animate({         left: new_left },             o.duration);
        onLabel.animate({       width: new_left + 4 },         o.duration);
        onSpan.animate({   marginLeft: new_left - rightSide }, o.duration);
        offSpan.animate({ marginRight: -new_left },            o.duration);
      });
    });

    return this;
  };
})(jQuery);