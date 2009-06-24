$.iphoneStyle = {
  defaults: { 
    checkedLabel: 'ON', uncheckedLabel: 'OFF', background: '#fff',
    containerClass:    'iPhoneCheckContainer',
    labelOnClass:      'iPhoneCheckLabelOn',
    labelOffClass:     'iPhoneCheckLabelOff',
    handleClass:       'iPhoneCheckHandle',
    handleSliderClass: 'iPhoneCheckHandleSlider'
  }
}

var iPhoneStyle = function(selector_or_elem, options) {
  options = Object.extend($.iphoneStyle.defaults, options);
  
  return $$(selector_or_elem).each(function(elem) {
    
    if (!elem.match('input[type=checkbox]'))
      return;
    
    elem.setOpacity(0);
    elem.wrap('div', { 'class': options.containerClass});
    elem.insert({ 'after': '<div class="' + options.handleClass + '"><div class="' + options.handleSliderClass + '" /></div>' })
        .insert({ 'after': '<label class="' + options.labelOffClass + '">'+ options.uncheckedLabel + '</label>' })
        .insert({ 'after': '<label class="' + options.labelOnClass + '">' + options.checkedLabel   + '</label>' });
    
    var handle    = elem.up().down('.' + options.handleClass),
        handlebg  = handle.down('.' + options.handleBGClass),
        offlabel  = elem.adjacent('.' + options.labelOffClass).first(),
        onlabel   = elem.adjacent('.' + options.labelOnClass).first(),
        container = elem.up('.' + options.containerClass),
        rightside = container.getWidth() - 39;
        
    
    container.observe('mouseup', function() {
      var is_onstate = (elem.checked);
    
      new Effect.Tween(null, (is_onstate) ? 1 : 0, (is_onstate) ? 0 : 1, { duration: 0.2 }, function(p) { handle.setStyle({ left: p * rightside + 'px' }) });
      
      if (is_onstate) {
        offlabel.appear({ duration: 0.2 });
        onlabel.fade({ duration: 0.2 });
      } else {
        offlabel.fade({ duration: 0.2 });
        onlabel.appear({ duration: 0.2 });
      }
      
      elem.writeAttribute('checked', !is_onstate);
      return false;
    });
    
    // Disable text selection
    [container, onlabel, offlabel, handle].invoke('observe', 'mousedown', function(e) { Event.stop(e); return false; });
    if (Prototype.Browser.IE)
      [container, onlabel, offlabel, handle].invoke('observe', 'startselect', function(e) { Event.stop(e); return false; });
    
    // initial load
    if (elem.match(':checked')) {
      offlabel.setOpacity(0);
      onlabel.setOpacity(1);
      handle.setStyle({ left: rightside + 'px'});
    }
  });
};