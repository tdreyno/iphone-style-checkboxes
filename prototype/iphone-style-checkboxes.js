var iPhoneStyle = function(selector_or_elems, options) {
  options = Object.extend(Object.clone(iPhoneStyle.defaults), options || {});
  var elems;
  if (Object.isString(selector_or_elems)) {
    elems = $$(selector_or_elems);
  } else {
    elems = [selector_or_elems].flatten();
  }
  return(elems.each(function(elem) {
    
    if (!elem.match('input[type=checkbox]')) {
      return;
    }
    
    if (elem.hasClassName(options.statusClass)) {
        return;
    }
    
    elem.addClassName(options.statusClass);
    elem.setOpacity(0);
    elem.wrap('div', { 'class': options.containerClass});
    elem.insert({ 'after': '<div class="' + options.handleClass + '"><div class="' + options.handleRightClass + '"><div class="' + options.handleCenterClass + '"></div></div></div>' })
        .insert({ 'after': '<label class="' + options.labelOnClass + '"><span>' + options.checkedLabel   + '</span></label>' })
        .insert({ 'after': '<label class="' + options.labelOffClass + '"><span>'+ options.uncheckedLabel + '</span></label>' });
    
    var handle  = elem.up().down('.' + options.handleClass),
      offlabel  = elem.adjacent('.' + options.labelOffClass).first(),
      offspan   = offlabel.down('span'),
      onlabel   = elem.adjacent('.' + options.labelOnClass).first(),
      onspan    = onlabel.down('span'),
      container = elem.up();
      
    if (options.resizeHandle) {
      var min = (onlabel.getWidth() < offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
      handle.setStyle({width: min + 'px'});
    }
    if (options.resizeContainer) {
      var max = (onlabel.getWidth() > offlabel.getWidth()) ? onlabel.getWidth() : offlabel.getWidth();
      container.setStyle({width: max + handle.getWidth() + 12 + 'px'});
    }
    offlabel.setStyle({width: container.getWidth() - 5  + 'px'});

    var rightside = container.getWidth() - handle.getWidth() - 3;

    if (elem.checked) {
      handle.setStyle({ left: rightside + 'px' });
      onlabel.setStyle({ width: rightside + 4 + 'px' });
      offspan.setStyle({ 'marginRight': rightside + 'px' });
    } else {
      handle.setStyle({ left: 0 });
      onlabel.setStyle({ width: 0 });
      onspan.setStyle({ 'marginLeft': -rightside + 'px' });
    }    

    elem.change = function() {
      var is_onstate = elem.checked;
      var p = handle.positionedOffset()[0] / rightside;
      new Effect.Tween(null, p, Number(is_onstate), { duration: options.duration / 1000 }, function(p) {
        handle.setStyle({ left: p * rightside + 'px' });
        onlabel.setStyle({ width: p * rightside + 4 + 'px' });
        offlabel.setStyle({ width: (1 - p) * rightside + 4 + 'px' });
        offspan.setStyle({ 'marginRight': -p * rightside + 'px' });
        onspan.setStyle({ 'marginLeft': -(1 - p) * rightside + 'px' });
      });
      options.statusChange(elem);
    };
    elem.observe('change', elem.change);
    
    var down = function(e) {
      e.stop();
      iPhoneStyle.clicking = handle;
      var x = Event.pointerX(e) || e.changedTouches[0].pageX;
      iPhoneStyle.dragStartPosition = x - (Number(handle.style.left.replace(/px$/, "")) || 0);
      Event.stop(e);
    };

    container.observe('mousedown', down);
    container.observe('touchstart', down);
    
    
    var move = function(e) {
      if (iPhoneStyle.clicking == handle) {
        e.stop();
        var x = Event.pointerX(e) || e.changedTouches[0].pageX;
        if (x != iPhoneStyle.dragStartPosition) {
          iPhoneStyle.dragging = true;
        }
        var p = (x - iPhoneStyle.dragStartPosition) / rightside;
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        handle.setStyle({ left: p * rightside + 'px' });
        onlabel.setStyle({ width: p * rightside + 4 + 'px' });
        offlabel.setStyle({ width: (1 - p) * rightside + 4 + 'px' });
        offspan.setStyle({ 'marginRight': -p * rightside + 'px' });
        onspan.setStyle({ 'marginLeft': -(1 - p) * rightside + 'px' });
      }
    };

    document.observe('mousemove', move);
    document.observe('touchmove', move);
    
    container.observe('mousedown', function(e) {
      e.stop();
      iPhoneStyle.clicking = handle;
      iPhoneStyle.dragStartPosition = Event.pointerX(e) - (Number(handle.style.left.replace(/px$/, "")) || 0);
      return false;
    });
    
    var up = function(e) {
      if (iPhoneStyle.clicking == handle) {
        e.stop();
        if (!iPhoneStyle.dragging) {
          var is_onstate = elem.checked;
          elem.writeAttribute('checked', !is_onstate);
        } else {
          var x = Event.pointerX(e) || e.changedTouches[0].pageX;
          var p = (x - iPhoneStyle.dragStartPosition) / rightside;
          elem.writeAttribute('checked', (p >= 0.5));
        }
        iPhoneStyle.clicking = null;
        iPhoneStyle.dragging = null;
        elem.change();
      }
    };
    document.observe('touchend', up);
    document.observe('mouseup', up);

    // Disable text selection
    [container, onlabel, offlabel, handle].invoke('observe', 'mousedown', function(e) { e.preventDefault(); return false; });
    if (Prototype.Browser.IE) {
      [container, onlabel, offlabel, handle].invoke('observe', 'startselect', function(e) { Event.stop(e); return false; });
    }
  }));
};

iPhoneStyle.defaults = {
  duration:          200,
  checkedLabel:      'ON', 
  uncheckedLabel:    'OFF', 
  resizeHandle:      true,
  resizeContainer:   true,
  background:        '#fff',
  statusClass:       'checkRendered',
  containerClass:    'iPhoneCheckContainer',
  labelOnClass:      'iPhoneCheckLabelOn',
  labelOffClass:     'iPhoneCheckLabelOff',
  handleClass:       'iPhoneCheckHandle',
  handleCenterClass: 'iPhoneCheckHandleCenter',
  handleRightClass:  'iPhoneCheckHandleRight',
  statusChange: function(){}
};
