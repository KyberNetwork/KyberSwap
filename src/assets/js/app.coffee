# init foundation
$ document
  .foundation()

# init rate slider
$ document
  .ready () ->
    slider = $ '#rate-bar ul.rates'
    slider
      .show()
      .bxSlider
        mode: 'horizontal'
        minSlides: 2
        maxSlides: 22
        moveSlides: 1
        slideWidth: 150
        pager: false
        controls: false
        responsive: true
        auto: true
        autoHover: false
        pause: 2000
        useCSS: false

# notifications
$ document
  .on 'click', '.notifications-toggle', (e) ->
    e.preventDefault()
    $ 'ul.notifications'
      .toggleClass 'hide'

# token-input
$ document
  .on 'click', '.token-input .info', (e) ->
    e.preventDefault()

# exchange select token pair
$ document
  .on 'click', '#exchange.choose-token-pair .next', (e) ->
    e.preventDefault()
    $ '#exchange'
      .removeClass 'choose-token-pair'
      .find 'input'
      .first()
      .focus()

# advanced
$ document
  .on 'change', '#advanced', (e) ->
    val = $ e.target
      .is ':checked'
    $ '.advanced-content'
      .attr 'disabled', not val