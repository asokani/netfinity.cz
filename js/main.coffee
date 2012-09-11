class Navigation
  constructor: (name) ->
    @element = $(".navigation-#{name} div")

  build_navigation: (pages) ->
    for page in [0..pages]
      link = $("<a>", {
        "data-page": page,
        "href": "#"
      })
      link.addClass("selected") if page == 0
      link.click(this.click)
      @element.append(link)


  click: (event) =>
    link = $(event.target)
    @element.find("a").removeClass("selected")
    link.addClass("selected")
    @element.trigger("navClick", link.attr("data-page"))
    return false

class Scroller
  constructor: (element_name, per_page, row_style) ->
    @navigation = new Navigation(element_name)
    @navigation.element.bind("navClick", this.navClick)
    @element = $('.' + element_name)
    @element.find(".holder").css("width", 8000)
    @count = @element.find("div.row").length
    @navigation.build_navigation(Math.ceil(@count / per_page) - 1)
    @current_page = 0
    @row_style = row_style
    @element.find("div.row").show()
    this.resize()
    $(window).resize(this.resize)

  navClick: (event, page, resized = false) =>
    return if !resized and page == @current_page

    @current_page = page
    total_width = @element.width()

    timing = if resized then 0.1 else 1
    TweenLite.to(@element.find("div.holder"), timing, {
      "css": {
        "left": total_width*@current_page*(-1)
      },
      "ease": Power4.easeOut
    })

  resize: =>
    total_width = @element.width()
    padding = @row_style['padding'] * total_width
    width = Math.floor(@row_style['width'] * total_width)
    current_position = 0

    $(@element.find("div.row")).css({
      "padding-left": padding,
      "padding-right": padding,
      "width": width
    })

    this.navClick(null, @current_page, true)


class Form
  fields: {
    "name": "Jméno",
    "email": "E-mail",
    "phone": "Telefon",
    "company": "Firma",
    "www": "Web",
    "notes": "Zpráva"
  }

  constructor: ->
    for name, text of @fields
      type = if name == "notes" then "textarea" else "input"
      $("#{type}[name=#{name}]").focusin(this.focusin)
      $("#{type}[name=#{name}]").focusout(this.focusout)

      $("#{type}[name=#{name}]").val(text)

    $("form").submit(this.submit)

  submit: (event) =>
    $.post("index.php", $("form").serialize(), =>
      this.form_clear()
      alert("Děkujeme. Formulář byl úspěšně odeslán.")
    )
    return false;

  form_clear: =>
    for name, text of @fields
      type = if name == "notes" then "textarea" else "input"
      $("#{type}[name=#{name}]").val(text)

    $("form select")[0].selectedIndex = 0; # return to first element

  focusin: (event) =>
      target = $(event.target)
      name = target.attr("name")
      text = @fields[name]
      if target.val() == text
        target.val("")

  focusout: (event) =>
    target = $(event.target)
    name = target.attr("name")
    text = @fields[name]
    if target.val() == ""
      target.val(text)

jQuery ->
  new Form()
  new Scroller("references", 3, {"padding": 0.02, "width": 0.29333})
  new Scroller("testimonials", 1, {"padding": 0, "width": 1})
