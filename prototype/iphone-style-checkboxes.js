$.iphoneStyle = {
  defaults: { checkedLabel: 'ON', uncheckedLabel: 'OFF', background: '#fff' }
}

$.fn.iphoneStyle = function(selector_or_elem, options) {
  options = $.extend($.iphoneStyle.defaults, options);
  
  return $$(selector_or_elem).each(function() {
    var elem = $$(this);
    
    if (!elem.match('input[type=checkbox]'))
      return;
    
    elem.setOpacity(0);
    elem.wrap('<div class="container" />');
    elem.insert({ after: '<div class="handle"><div class="bg" style="background: ' + options.background + '"/><div class="slider" /></div>' })
        .insert({ after: '<label class="off">'+ options.uncheckedLabel + '</label>' })
        .insert({ after: '<label class="on">' + options.checkedLabel   + '</label>' });
    
    var handle    = elem.adjacent('.handle'),
        handlebg  = handle.down('.bg'),
        offlabel  = elem.adjacent('.off'),
        onlabel   = elem.adjacent('.on'),
        container = elem.parent('.container'),
        rightside = container.getWidth() - 39;
    
    container.observe('mouseup', function() {
      var is_onstate = (handle.position().left <= 0);
          new_left   = (is_onstate) ? rightside : 0,
          bgleft     = (is_onstate) ? 34 : 0;

      handlebg.hide();
      handle.animate({ left: new_left }, 100, function() {
        handlebg.setStyle({ left: bgleft }).show();
      });
      
      if (is_onstate) {
        offlabel.animate({ opacity: 0 }, 200);
        onlabel.animate({ opacity: 1 }, 200);
      } else {
        offlabel.animate({ opacity: 1 }, 200);
        onlabel.animate({ opacity: 0 }, 200);
      }
      
      elem.writeAttribute('checked', !is_onstate);
      return false;
    });
    
    // Disable text selection
    $(container, onlabel, offlabel, handle).observe('mousedown', function(e) { Event.stop(e); return false; });
    if ($.browser.ie)
      $(container, onlabel, offlabel, handle).observe('startselect', function(e) { Event.stop(e); return false; });
    
    // initial load
    if (elem.match(':checked')) {
      offlabel.setOpacity(0);
      onlabel.setOpacity(1);
      handle.setStyle({ left: rightside });
      handlebg.setStyle({ left: 34 });
    }
  });
};