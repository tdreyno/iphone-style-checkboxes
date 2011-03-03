/*!
 * jQuery UI Widget 1.8.10
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);

/*
 * jQuery Templates Plugin 1.0.0pre
 * http://github.com/jquery/jquery-tmpl
 * Requires jQuery 1.4.2
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function(a){var r=a.fn.domManip,d="_tmplitem",q=/^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,b={},f={},e,p={key:0,data:{}},i=0,c=0,l=[];function g(g,d,h,e){var c={data:e||(e===0||e===false)?e:d?d.data:{},_wrap:d?d._wrap:null,tmpl:null,parent:d||null,nodes:[],calls:u,nest:w,wrap:x,html:v,update:t};g&&a.extend(c,g,{nodes:[],parent:d});if(h){c.tmpl=h;c._ctnt=c._ctnt||c.tmpl(a,c);c.key=++i;(l.length?f:b)[i]=c}return c}a.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(f,d){a.fn[f]=function(n){var g=[],i=a(n),k,h,m,l,j=this.length===1&&this[0].parentNode;e=b||{};if(j&&j.nodeType===11&&j.childNodes.length===1&&i.length===1){i[d](this[0]);g=this}else{for(h=0,m=i.length;h<m;h++){c=h;k=(h>0?this.clone(true):this).get();a(i[h])[d](k);g=g.concat(k)}c=0;g=this.pushStack(g,f,i.selector)}l=e;e=null;a.tmpl.complete(l);return g}});a.fn.extend({tmpl:function(d,c,b){return a.tmpl(this[0],d,c,b)},tmplItem:function(){return a.tmplItem(this[0])},template:function(b){return a.template(b,this[0])},domManip:function(d,m,k){if(d[0]&&a.isArray(d[0])){var g=a.makeArray(arguments),h=d[0],j=h.length,i=0,f;while(i<j&&!(f=a.data(h[i++],"tmplItem")));if(f&&c)g[2]=function(b){a.tmpl.afterManip(this,b,k)};r.apply(this,g)}else r.apply(this,arguments);c=0;!e&&a.tmpl.complete(b);return this}});a.extend({tmpl:function(d,h,e,c){var i,k=!c;if(k){c=p;d=a.template[d]||a.template(null,d);f={}}else if(!d){d=c.tmpl;b[c.key]=c;c.nodes=[];c.wrapped&&n(c,c.wrapped);return a(j(c,null,c.tmpl(a,c)))}if(!d)return[];if(typeof h==="function")h=h.call(c||{});e&&e.wrapped&&n(e,e.wrapped);i=a.isArray(h)?a.map(h,function(a){return a?g(e,c,d,a):null}):[g(e,c,d,h)];return k?a(j(c,null,i)):i},tmplItem:function(b){var c;if(b instanceof a)b=b[0];while(b&&b.nodeType===1&&!(c=a.data(b,"tmplItem"))&&(b=b.parentNode));return c||p},template:function(c,b){if(b){if(typeof b==="string")b=o(b);else if(b instanceof a)b=b[0]||{};if(b.nodeType)b=a.data(b,"tmpl")||a.data(b,"tmpl",o(b.innerHTML));return typeof c==="string"?(a.template[c]=b):b}return c?typeof c!=="string"?a.template(null,c):a.template[c]||a.template(null,q.test(c)?c:a(c)):null},encode:function(a){return(""+a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")}});a.extend(a.tmpl,{tag:{tmpl:{_default:{$2:"null"},open:"if($notnull_1){__=__.concat($item.nest($1,$2));}"},wrap:{_default:{$2:"null"},open:"$item.calls(__,$1,$2);__=[];",close:"call=$item.calls();__=call._.concat($item.wrap(call,__));"},each:{_default:{$2:"$index, $value"},open:"if($notnull_1){$.each($1a,function($2){with(this){",close:"}});}"},"if":{open:"if(($notnull_1) && $1a){",close:"}"},"else":{_default:{$1:"true"},open:"}else if(($notnull_1) && $1a){"},html:{open:"if($notnull_1){__.push($1a);}"},"=":{_default:{$1:"$data"},open:"if($notnull_1){__.push($.encode($1a));}"},"!":{open:""}},complete:function(){b={}},afterManip:function(f,b,d){var e=b.nodeType===11?a.makeArray(b.childNodes):b.nodeType===1?[b]:[];d.call(f,b);m(e);c++}});function j(e,g,f){var b,c=f?a.map(f,function(a){return typeof a==="string"?e.key?a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,"$1 "+d+'="'+e.key+'" $2'):a:j(a,e,a._ctnt)}):e;if(g)return c;c=c.join("");c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,function(f,c,e,d){b=a(e).get();m(b);if(c)b=k(c).concat(b);if(d)b=b.concat(k(d))});return b?b:k(c)}function k(c){var b=document.createElement("div");b.innerHTML=c;return a.makeArray(b.childNodes)}function o(b){return new Function("jQuery","$item","var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('"+a.trim(b).replace(/([\\'])/g,"\\$1").replace(/[\r\t\n]/g," ").replace(/\$\{([^\}]*)\}/g,"{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,function(m,l,k,g,b,c,d){var j=a.tmpl.tag[k],i,e,f;if(!j)throw"Unknown template tag: "+k;i=j._default||[];if(c&&!/\w$/.test(b)){b+=c;c=""}if(b){b=h(b);d=d?","+h(d)+")":c?")":"";e=c?b.indexOf(".")>-1?b+h(c):"("+b+").call($item"+d:b;f=c?e:"(typeof("+b+")==='function'?("+b+").call($item):("+b+"))"}else f=e=i.$1||"null";g=h(g);return"');"+j[l?"close":"open"].split("$notnull_1").join(b?"typeof("+b+")!=='undefined' && ("+b+")!=null":"true").split("$1a").join(f).split("$1").join(e).split("$2").join(g||i.$2||"")+"__.push('"})+"');}return __;")}function n(c,b){c._wrap=j(c,true,a.isArray(b)?b:[q.test(b)?b:a(b).html()]).join("")}function h(a){return a?a.replace(/\\'/g,"'").replace(/\\\\/g,"\\"):null}function s(b){var a=document.createElement("div");a.appendChild(b.cloneNode(true));return a.innerHTML}function m(o){var n="_"+c,k,j,l={},e,p,h;for(e=0,p=o.length;e<p;e++){if((k=o[e]).nodeType!==1)continue;j=k.getElementsByTagName("*");for(h=j.length-1;h>=0;h--)m(j[h]);m(k)}function m(j){var p,h=j,k,e,m;if(m=j.getAttribute(d)){while(h.parentNode&&(h=h.parentNode).nodeType===1&&!(p=h.getAttribute(d)));if(p!==m){h=h.parentNode?h.nodeType===11?0:h.getAttribute(d)||0:0;if(!(e=b[m])){e=f[m];e=g(e,b[h]||f[h]);e.key=++i;b[i]=e}c&&o(m)}j.removeAttribute(d)}else if(c&&(e=a.data(j,"tmplItem"))){o(e.key);b[e.key]=e;h=a.data(j.parentNode,"tmplItem");h=h?h.key:0}if(e){k=e;while(k&&k.key!=h){k.nodes.push(j);k=k.parent}delete e._ctnt;delete e._wrap;a.data(j,"tmplItem",e)}function o(a){a=a+n;e=l[a]=l[a]||g(e,b[e.parent.key+n]||e.parent)}}}function u(a,d,c,b){if(!a)return l.pop();l.push({_:a,tmpl:d,item:this,data:c,options:b})}function w(d,c,b){return a.tmpl(a.template(d),c,b,this)}function x(b,d){var c=b.options||{};c.wrapped=d;return a.tmpl(a.template(b.tmpl),b.data,c,b.item)}function v(d,c){var b=this._wrap;return a.map(a(a.isArray(b)?b.join(""):b).filter(d||"*"),function(a){return c?a.innerText||a.textContent:a.outerHTML||s(a)})}function t(){var b=this.nodes;a.tmpl(null,null,null,this).insertBefore(b[0]);a(b).remove()}})(jQuery);

/*!
// iPhone-style Checkboxes jQuery plugin
// Copyright Thomas Reynolds, licensed GPL & MIT
*/
;(function($, iphoneStyle) {

$.widget(iphoneStyle + "." + iphoneStyle, {
  options: {
    // Time spent during slide animation
    duration:          200,
    
    // Text content of "on" state
    checkedLabel:      'ON',
    
    // Text content of "off" state
    uncheckedLabel:    'OFF',
    
    // Automatically resize the handle to cover either label
    resizeHandle:      true,
    
    // Automatically resize the widget to contain the labels
    resizeContainer:   true,
    
    // Pixels that must be dragged for a click to be ignored
    dragThreshold:     5,
    
    // The class assigned the container div
    containerClass:    'iPhoneCheckContainer',
    
    // The class assigned the container div when disabled
    disabledClass:     'iPhoneCheckDisabled',
    
    // The class assigned the "on" label
    labelOnClass:      'iPhoneCheckLabelOn',
    
    // The class assigned the "off" label
    labelOffClass:     'iPhoneCheckLabelOff',
    
    // The class assigned the drag handle
    handleClass:       'iPhoneCheckHandle',
    
    // The class assigned the center div inside the drag handle
    handleCenterClass: 'iPhoneCheckHandleCenter',
    
    // The class assigned the right div inside the drag handle
    handleRightClass:  'iPhoneCheckHandleRight',
    
    // Template HTML to be wrapper around the input:checkbox
    template:          '<div class="${containerClass}">' +
                         '<label class="${labelOffClass}">' +
                           '<span>${uncheckedLabel}</span>' +
                         '</label>' +
                         '<label class="${labelOnClass}">' +
                           '<span>${checkedLabel}</span>' +
                         '</label>' +
                         '<div class="${handleClass}">' +
                           '<div class="${handleRightClass}">' +
                             '<div class="${handleCenterClass}"></div>' +
                           '</div>' +
                         '</div>' +
                       '</div>'
  },
  
  _create: function() {
    // Should we check to make sure the element is a checkbox
    if (!this.element.is(":checkbox")) {
      return;
    }
  
    // Initialize the control
    this._wrapCheckboxWithDivs();
    this._attachEvents();
    this._globalEvents();
    this._disableTextSelection();
    
    if (this.options.resizeHandle)    { this._optionallyResize('handle'); }
    if (this.options.resizeContainer) { this._optionallyResize('container'); }
    
    this._initialPosition();
  },
  
  // Wrap the existing input[type=checkbox] with divs for styling and grab 
  // DOM references to the created nodes
  _wrapCheckboxWithDivs: function() {
    this.$container = $.tmpl(this.options.template, this.options);
    
    this.element.after(this.$container);
    this.element.remove();
    this.$container.append(this.element);
    
    this.$offLabel = this.$container.children('.' + this.options.labelOffClass);
    this.$offSpan  = this.$offLabel.children('span');
    this.$onLabel  = this.$container.children('.' + this.options.labelOnClass);
    this.$onSpan   = this.$onLabel.children('span');
    this.$handle  = this.$container.children('.' + this.options.handleClass);
  },
  
  _attachEvents: function() {
    var obj = this;
    
    // A mousedown anywhere in the control will start tracking for dragging
    this.$container
      .bind('mousedown touchstart', function(event) {          
        event.preventDefault();
        
        if (obj.element.is(':disabled')) { return; }
        
        var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
        $[iphoneStyle].currentlyClicking = obj.$handle;
        $[iphoneStyle].dragStartPosition = x;
        $[iphoneStyle].handleLeftOffset  = parseInt(obj.$handle.css('left'), 10) || 0;
        $[iphoneStyle].dragStartedOn     = obj.element;
      })
    
      // Utilize event bubbling to handle drag on any element beneath the container
      .bind('iPhoneDrag', function(event, x) {
        event.preventDefault();
        
        if (obj.element.is(':disabled')) { return; }
        if (obj.element != $[iphoneStyle].dragStartedOn) { return; }
        
        var p = (x + $[iphoneStyle].handleLeftOffset - $[iphoneStyle].dragStartPosition) / obj.rightSide;
        if (p < 0) { p = 0; }
        if (p > 1) { p = 1; }
        obj.$handle.css({         left: p * obj.rightSide });
        obj.$onLabel.css({       width: p * obj.rightSide + 4 });
        obj.$offSpan.css({ marginRight: -p * obj.rightSide });
        obj.$onSpan.css({   marginLeft: -(1 - p) * obj.rightSide });
      })
    
        // Utilize event bubbling to handle drag end on any element beneath the container
      .bind('iPhoneDragEnd', function(event, x) {
        if (obj.element.is(':disabled')) { return; }
        
        var willChangeEvent = jQuery.Event("willChange");
        obj.element.trigger(willChangeEvent);
        if (willChangeEvent.isDefaultPrevented()) {
          checked = obj.element.attr('checked');
        } else {
          var checked;
          if ($[iphoneStyle].dragging) {
            var p = (x - $[iphoneStyle].dragStartPosition) / obj.rightSide;
            checked = (p < 0) ? Math.abs(p) < 0.5 : p >= 0.5;
          } else {
            checked = !obj.element.attr('checked');
          }
        }
        
        $[iphoneStyle].currentlyClicking = null;
        $[iphoneStyle].dragging = null;
        
        obj.element.attr('checked', checked);
        obj.element.change();
        obj.element.trigger("didChange");
      });
  
    // Animate when we get a change event
    this.element.change(function() {
      if (obj.element.is(':disabled')) {
        obj.$container.addClass(obj.options.disabledClass);
        return false;
      } else {
        obj.$container.removeClass(obj.options.disabledClass);
      }
      
      var new_left = obj.element.attr('checked') ? obj.rightSide : 0;

      obj.$handle.animate({         left: new_left },                 obj.options.duration);
      obj.$onLabel.animate({       width: new_left + 4 },             obj.options.duration);
      obj.$offSpan.animate({ marginRight: -new_left },                obj.options.duration);
      obj.$onSpan.animate({   marginLeft: new_left - obj.rightSide }, obj.options.duration);
    });
  },
  
  // Disable IE text selection, other browsers are handled in CSS
  _disableTextSelection: function() {
    if (!$.browser.msie) { return; }

    // Elements containing text should be unselectable
    $([this.$handle, this.$offLabel, this.$onLabel, this.$container])
      .attr("unselectable", "on");
  },
  
  // Automatically resize the handle or container
  _optionallyResize: function(mode) {
    var onLabelWidth  = this.$onLabel.width(),
        offLabelWidth = this.$offLabel.width();
        
    if (mode == 'container') {
      var newWidth = (onLabelWidth > offLabelWidth) ? onLabelWidth : offLabelWidth;
      newWidth += this.$handle.width() + 15; 
    } else { 
      var newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
    }
    
    this['$' + mode].css({ width: newWidth });
  },
  
  // Setup the control's inital position
  _initialPosition: function() {
    this.$offLabel.css({ width: this.$container.width() - 5 });

    var offset = ($.browser.msie && $.browser.version < 7) ? 3 : 6;
    this.rightSide = this.$container.width() - this.$handle.width() - offset;

    if (this.element.is(':checked')) {
      this.$handle.css({ left: this.rightSide });
      this.$onLabel.css({ width: this.rightSide + 4 });
      this.$offSpan.css({ marginRight: -this.rightSide });
    } else {
      this.$onLabel.css({ width: 0 });
      this.$onSpan.css({ marginLeft: -this.rightSide });
    }
    
    if (this.element.is(':disabled')) {
      this.$container.addClass(this.options.disabledClass);
    }
  },
  
  _globalEvents: function() {
    if ($[iphoneStyle].initComplete) {
      return;
    }
    
    var opt = this.options;
    
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
  }
  
  //destroy: function() {}
});

})(jQuery, 'iphoneStyle');

