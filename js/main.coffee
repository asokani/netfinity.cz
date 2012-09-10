jQuery ->
  class Results
    constructor: ->

  class Testimonials
    constructor: ->

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

  new Form()