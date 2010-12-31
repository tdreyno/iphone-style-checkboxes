# iPhone-style Checkboxes Coffee plugin
# Copyright Thomas Reynolds, licensed GPL & MIT

# Constructor
$.iphoneStyle = (elem, options) ->
  @elem = $(elem)
  
  # Import options into instance variables
  obj = this
  
  for key, value of options
    obj[key] = value

  # Initialize the control
  @wrapCheckboxWithDivs()
  @attachEvents()
  @disableTextSelection()
  
  @optionallyResize('handle') if @resizeHandle
  @optionallyResize('container') if @resizeContainer
  
  @initialPosition()

$.iphoneStyle::isDisabled = ->
  return @elem.filter(':disabled').length

# Wrap the existing input[type=checkbox] with divs for styling and grab DOM references to the created nodes
$.iphoneStyle::wrapCheckboxWithDivs = ->
  @elem.wrap("<div class='$@containerClass' />");
  
  @container = @elem.parent()
  
  @offLabel  = $("<label class='$@labelOffClass'>" +
                   "<span>$@uncheckedLabel</span>" +
                 "</label>").appendTo(@container)
                     
  @offSpan   = @offLabel.children('span')
  
  @onLabel   = $("<label class='$@labelOnClass'>" +
                  "<span>$@checkedLabel</span>" +
                "</label>").appendTo(@container)
                     
  @onSpan    = @onLabel.children('span')
  
  @handle    = $("<div class='$@handleClass'>" +
                   "<div class='$@handleRightClass'>" +
                     "<div class='$@handleCenterClass' />" +
                   "</div>" +
                 "</div>").appendTo(this.container)
  
# Disable IE text selection, other browsers are handled in CSS
$.iphoneStyle::disableTextSelection = ->
  return if not $.browser.msie

  # Elements containing text should be unselectable
  for el in [@handle, @offLabel, @onLabel, @container]
    $(el).attr("unselectable", "on")

# Automatically resize the handle or container
$.iphoneStyle::optionallyResize = (mode) -> 
  onLabelWidth  = @onLabel.width()
  offLabelWidth = @offLabel.width()
  newWidth      = if (onLabelWidth < offLabelWidth) then onLabelWidth else offLabelWidth

  if mode is "container"
    newWidth += @handle.width() + 15 
    @container.css width: newWidth
  else
    @handle.css width: newWidth

$.iphoneStyle::attachEvents = ->
  # A mousedown anywhere in the control will start tracking for dragging
  @container.bind 'mousedown touchstart', (event) =>
    event.preventDefault()
    
    return if @isDisabled()
      
    x: event.pageX || event.originalEvent.changedTouches[0].pageX
    $.iphoneStyle.currentlyClicking = @handle
    $.iphoneStyle.dragStartPosition = x
    $.iphoneStyle.handleLeftOffset  = parseInt(@handle.css('left'), 10) || 0
    
  
  # Utilize event bubbling to handle drag on any element beneath the container
  @container.bind 'iPhoneDrag', (event, x) => 
    event.preventDefault()
    
    return if @isDisabled()
    
    p = (x + $.iphoneStyle.handleLeftOffset - $.iphoneStyle.dragStartPosition) / @rightSide
    p = 0 if p < 0
    p = 1 if p > 1
  
    @handle.css({         left: p * @rightSide        })
    @onLabel.css({       width: p * @rightSide + 4    })
    @offSpan.css({ marginRight: -p * @rightSide       })
    @onSpan.css({   marginLeft: -(1 - p) * @rightSide })
  
  # Utilize event bubbling to handle drag end on any element beneath the container
  @container.bind 'iPhoneDragEnd', (event, x) =>
    return if @isDisabled()
    
    if $.iphoneStyle.dragging
      p = (x - $.iphoneStyle.dragStartPosition) / @rightSide
      @elem.attr('checked', (p >= 0.5))
    else
      @elem.attr('checked', !@elem.attr('checked'))

    $.iphoneStyle.currentlyClicking = null
    $.iphoneStyle.dragging          = null
    @elem.change()
    
  # Animate when we get a change event
  @elem.change =>
    if @isDisabled()
      @container.addClass(@disabledClass)
      return false
    else
      @container.removeClass(@disabledClass)
    
    new_left: if @elem.attr('checked') then @rightSide else 0

    @handle.animate({         left: new_left              }, @duration)
    @onLabel.animate({       width: new_left + 4          }, @duration)
    @offSpan.animate({ marginRight: -new_left             }, @duration)
    @onSpan.animate({   marginLeft: new_left - @rightSide }, @duration)
    
  # Setup the control's inital position
$.iphoneStyle::initialPosition = ->
  @offLabel.css({ width: @container.width() - 5 })

  offset     = if $.browser.msie and $.browser.version < 7 then 3 else 6
  @rightSide = @container.width() - @handle.width() - offset

  if @elem.filter(':checked').length
    @handle.css({         left: @rightSide     })
    @onLabel.css({       width: @rightSide + 4 })
    @offSpan.css({ marginRight: -@rightSide    })
  else
    @onLabel.css({     width: 0           })
    @onSpan.css({ marginLeft: -@rightSide })
    
  @container.addClass(@disabledClass) if @isDisabled()

$.fn.iphoneStyle = (options) ->
  checkboxes = this.filter(':checkbox')
  
  # Fail early if we don't have any checkboxes passed in
  return this if not checkboxes.length
  
  # Merge options passed in with global defaults
  opt = $.extend({}, $.iphoneStyle.defaults, options)
  
  for checkbox in checkboxes
    $(checkbox).data("iphoneStyle", new $.iphoneStyle(checkbox, opt))

  if not $.iphoneStyle.initComplete
    # As the mouse moves on the page, animate if we are in a drag state
    $(document).bind 'mousemove touchmove', (event) =>
      return if not $.iphoneStyle.currentlyClicking
      event.preventDefault()
  
      x = event.pageX || event.originalEvent.changedTouches[0].pageX
      
      if (not $.iphoneStyle.dragging &&
          (Math.abs($.iphoneStyle.dragStartPosition - x) > opt.dragThreshold))
        $.iphoneStyle.dragging = true
      
      $(event.target).trigger 'iPhoneDrag', [x]

    # When the mouse comes up, leave drag state
    $(document).bind 'mouseup touchend', (event) =>
      return if not $.iphoneStyle.currentlyClicking
      event.preventDefault()
  
      x = event.pageX || event.originalEvent.changedTouches[0].pageX
      $($.iphoneStyle.currentlyClicking).trigger 'iPhoneDragEnd', [x]
      
    $.iphoneStyle.initComplete = true
  
  this
  
$.iphoneStyle.defaults = {
  # Time spent during slide animation
  duration:          200
  
  # Text content of "on" state
  checkedLabel:      'ON'
  
  # Text content of "off" state
  uncheckedLabel:    'OFF'
  
  # Automatically resize the handle to cover either label
  resizeHandle:      true
  
  # Automatically resize the widget to contain the labels
  resizeContainer:   true
  
  disabledClass:     'iPhoneCheckDisabled'
  containerClass:    'iPhoneCheckContainer'
  labelOnClass:      'iPhoneCheckLabelOn'
  labelOffClass:     'iPhoneCheckLabelOff'
  handleClass:       'iPhoneCheckHandle'
  handleCenterClass: 'iPhoneCheckHandleCenter'
  handleRightClass:  'iPhoneCheckHandleRight'
  
  # Pixels that must be dragged for a click to be ignored
  dragThreshold:     5                          
}
