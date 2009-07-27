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
}

var iPhoneStyle = function(selector_or_elems, options) {
  options = Object.extend(Object.clone($.iphoneStyle.defaults), options || {});
  
  if (Object.isString(selector_or_elems)) {
    var elems = $$(selector_or_elems);
  } else {
    var elems = [selector_or_elems].flatten();
  }
  return elems.each(function(elem) {
    
    if (!elem.match('input[type=checkbox]'))
      return;
    
    elem.setOpacity(0);
    elem.wrap('div', { 'class': options.containerClass});
    elem.insert({ 'after': '<div class="' + options.handleClass + '"><div class="' + options.handleRightClass + '"><div class="' + options.handleCenterClass + '" /></div></div>' })
        .insert({ 'after': '<label class="' + options.labelOffClass + '">'+ options.uncheckedLabel + '</label>' })
        .insert({ 'after': '<label class="' + options.labelOnClass + '">' + options.checkedLabel   + '</label>' });
    
    var handle    = elem.up().down('.' + options.handleClass),
      offlabel  = elem.adjacent('.' + options.labelOffClass).first(),
      onlabel   = elem.adjacent('.' + options.labelOnClass).first(),
      container = elem.up('.' + options.containerClass);
      
    if (options.resizeHandle) {
      var min = (onlabel.getWidth() < offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
      handle.setStyle({width: min - 8 + 'px'});
    }
    if (options.resizeContainer) {
      var max = (onlabel.getWidth() > offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
      container.setStyle({width: max + handle.getWidth() + 12 + 'px'});
    }
    offlabel.setStyle({width: container.getWidth() - 12  + 'px'});

    var rightside = container.getWidth() - handle.getWidth() - 4;

    if (elem.checked) {
      handle.setStyle({ left: rightside + 'px' });
      onlabel.setStyle({ width: rightside + 'px' });
    } else {
      handle.setStyle({ left: 0 });
      onlabel.setStyle({ width: 0 });
    }    

    elem.change = function() {
      var is_onstate = (elem.checked);
      new Effect.Tween(null, (is_onstate) ? 0 : 1, (is_onstate) ? 1 : 0, { duration: options.duration / 1000 }, function(p) {
        handle.setStyle({ left: p * rightside + 'px' });
        onlabel.setStyle({ width: p * rightside + 'px' });
      });
    }

    container.observe('mouseup', function() {
      var is_onstate = elem.checked;
      elem.writeAttribute('checked', !is_onstate);
      elem.change();
      return false;
    });
    
    // Disable text selection
    [container, onlabel, offlabel, handle].invoke('observe', 'mousedown', function(e) { Event.stop(e); return false; });
    if (Prototype.Browser.IE)
      [container, onlabel, offlabel, handle].invoke('observe', 'startselect', function(e) { Event.stop(e); return false; });
    
  });
};