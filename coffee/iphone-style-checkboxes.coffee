# iPhone-style Checkboxes Coffee plugin
# Copyright Thomas Reynolds, licensed GPL & MIT

class iOSCheckbox
  constructor: (elem, options) ->
    @elem = $(elem)
  
    opts = $.extend({}, iOSCheckbox.defaults, options)
    
    # Import options into instance variables
    for key, value of opts
      @[key] = value

    # Initialize the control
    @wrapCheckboxWithDivs()
    @attachEvents()
    @disableTextSelection()
  
    @optionallyResize('handle') if @resizeHandle
    @optionallyResize('container') if @resizeContainer
  
    @initialPosition()

  isDisabled: -> @elem.is(':disabled')

  # Wrap the existing input[type=checkbox] with divs for styling and grab 
  # DOM references to the created nodes
  wrapCheckboxWithDivs: ->
    @elem.wrap("<div class='#{@containerClass}' />")
  
    @container = @elem.parent()
  
    @offLabel  = $("""<label class='#{@labelOffClass}'>
                        <span>#{@uncheckedLabel}</span>
                      </label>""").appendTo(@container)
                     
    @offSpan   = @offLabel.children('span')
  
    @onLabel   = $("""<label class='#{@labelOnClass}'>
                        <span>#{@checkedLabel}</span>
                      </label>""").appendTo(@container)
                     
    @onSpan    = @onLabel.children('span')
  
    @handle    = $("""<div class='#{@handleClass}'>
                        <div class='#{@handleRightClass}'>
                          <div class='#{@handleCenterClass}' />
                        </div>
                      </div>""").appendTo(this.container)
  
  # Disable IE text selection, other browsers are handled in CSS
  disableTextSelection: ->
    # Elements containing text should be unselectable
    if $.browser.msie
      $([@handle, @offLabel, @onLabel, @container]).attr("unselectable", "on")

  # Automatically resize the handle or container
  optionallyResize: (mode) -> 
    onLabelWidth  = @onLabel.width()
    offLabelWidth = @offLabel.width()
    
    newWidth      = if (onLabelWidth < offLabelWidth)
      onLabelWidth
    else 
      offLabelWidth

    if mode == "container"
      newWidth += @handle.width() + 15 
      @container.css(width: newWidth)
    else
      @handle.css(width: newWidth)

  onMouseDown: (event) ->
    event.preventDefault()

    return if @isDisabled()

    x = event.pageX || event.originalEvent.changedTouches[0].pageX
    iOSCheckbox.currentlyClicking = @handle
    iOSCheckbox.dragStartPosition = x
    iOSCheckbox.handleLeftOffset  = parseInt(@handle.css('left'), 10) || 0

  onDragMove: (event, x) ->
    return unless iOSCheckbox.currentlyClicking == @handle  
    return if @isDisabled()
    
    p = (x + iOSCheckbox.handleLeftOffset - iOSCheckbox.dragStartPosition) / @rightSide
    p = 0 if p < 0
    p = 1 if p > 1

    @handle.css(left: p * @rightSide)
    @onLabel.css(width: p * @rightSide + 4)
    @offSpan.css(marginRight: -p * @rightSide)
    @onSpan.css(marginLeft: -(1 - p) * @rightSide)

  onDragEnd: (event, x) ->
    return unless iOSCheckbox.currentlyClicking == @handle
    return if @isDisabled()
  
    if iOSCheckbox.dragging
      p = (x - iOSCheckbox.dragStartPosition) / @rightSide
      @elem.prop('checked', (p >= 0.5))
    else
      @elem.prop('checked', !@elem.prop('checked'))

    iOSCheckbox.currentlyClicking = null
    iOSCheckbox.dragging          = null
    @elem.change()

  onChange: ->  
    if @isDisabled()
      @container.addClass(@disabledClass)
      return false
    else
      @container.removeClass(@disabledClass)
  
    new_left = if @elem.prop('checked') then @rightSide else 0

    @handle.animate(left: new_left, @duration)
    @onLabel.animate(width: new_left + 4, @duration)
    @offSpan.animate(marginRight: -new_left, @duration)
    @onSpan.animate(marginLeft: new_left - @rightSide, @duration)
  
  attachEvents: ->
    self = this
    
    # A mousedown anywhere in the control will start tracking for dragging
    @container.bind 'mousedown touchstart', (event) ->
      self.onMouseDown.apply(self, arguments)
  
    # As the mouse moves on the page, animate if we are in a drag state
    $(document).bind 'mousemove touchmove', (event) ->
      self.onGlobalMove.apply(self, arguments)

    # When the mouse comes up, leave drag state
    $(document).bind 'mouseup touchend', (event) ->
      self.onGlobalUp.apply(self, arguments)
      
    # Animate when we get a change event
    @elem.bind "change", ->
      self.onChange.apply(self, arguments)
    
  # Setup the control's inital position
  initialPosition: ->
    @offLabel.css(width: @container.width() - 5)

    offset     = if $.browser.msie and $.browser.version < 7 then 3 else 6
    @rightSide = @container.width() - @handle.width() - offset

    if @elem.is(':checked')
      @handle.css(left: @rightSide)
      @onLabel.css(width: @rightSide + 4)
      @offSpan.css(marginRight: -@rightSide)
    else
      @onLabel.css(width: 0)
      @onSpan.css(marginLeft: -@rightSide)
    
    @container.addClass(@disabledClass) if @isDisabled()

  onGlobalMove: (event) ->
    return unless iOSCheckbox.currentlyClicking
    event.preventDefault()

    x = event.pageX || event.originalEvent.changedTouches[0].pageX

    if (!iOSCheckbox.dragging &&
        (Math.abs(iOSCheckbox.dragStartPosition - x) > @dragThreshold))
      iOSCheckbox.dragging = true
    
    @onDragMove(event, x)
    
  onGlobalUp: (event) ->
    return unless iOSCheckbox.currentlyClicking
    event.preventDefault()

    x = event.pageX || event.originalEvent.changedTouches[0].pageX
    @onDragEnd(event, x)

  @defaults: 
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

$.iphoneStyle = @iOSCheckbox = iOSCheckbox

$.fn.iphoneStyle = (options) ->
  for checkbox in @filter(':checkbox')
    $(checkbox).data("iphoneStyle", new iOSCheckbox(checkbox, options))

  return @
  
$.fn.iOSCheckbox = (options={}) ->
  # iOS5 style only supports circular handle
  opts = $.extend({}, options, {
    resizeHandle:      false
    disabledClass:     'iOSCheckDisabled'
    containerClass:    'iOSCheckContainer'
    labelOnClass:      'iOSCheckLabelOn'
    labelOffClass:     'iOSCheckLabelOff'
    handleClass:       'iOSCheckHandle'
    handleCenterClass: 'iOSCheckHandleCenter'
    handleRightClass:  'iOSCheckHandleRight'
  })
  
  for checkbox in @filter(':checkbox')
    $(checkbox).data("iOSCheckbox", new iOSCheckbox(checkbox, opts))

  return @