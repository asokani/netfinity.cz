// Generated by CoffeeScript 1.3.3
(function() {
  var Form, Navigation, Scroller,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Navigation = (function() {

    function Navigation(name) {
      this.click = __bind(this.click, this);
      this.element = $(".navigation-" + name + " div");
    }

    Navigation.prototype.build_navigation = function(pages) {
      var link, page, _i, _results;
      _results = [];
      for (page = _i = 0; 0 <= pages ? _i <= pages : _i >= pages; page = 0 <= pages ? ++_i : --_i) {
        link = $("<a>", {
          "data-page": page,
          "href": "#"
        });
        if (page === 0) {
          link.addClass("selected");
        }
        link.click(this.click);
        _results.push(this.element.append(link));
      }
      return _results;
    };

    Navigation.prototype.click = function(event) {
      var link;
      link = $(event.target);
      this.element.find("a").removeClass("selected");
      link.addClass("selected");
      this.element.trigger("navClick", link.attr("data-page"));
      return false;
    };

    return Navigation;

  })();

  Scroller = (function() {

    function Scroller(element_name, per_page, row_style) {
      this.resize = __bind(this.resize, this);

      this.navClick = __bind(this.navClick, this);
      this.navigation = new Navigation(element_name);
      this.navigation.element.bind("navClick", this.navClick);
      this.element = $('.' + element_name);
      this.element.find(".holder").css("width", 8000);
      this.count = this.element.find("div.row").length;
      this.navigation.build_navigation(Math.ceil(this.count / per_page) - 1);
      this.current_page = 0;
      this.row_style = row_style;
      this.element.find("div.row").show();
      this.resize();
      $(window).resize(this.resize);
    }

    Scroller.prototype.navClick = function(event, page, resized) {
      var timing, total_width;
      if (resized == null) {
        resized = false;
      }
      if (!resized && page === this.current_page) {
        return;
      }
      this.current_page = page;
      total_width = this.element.width();
      timing = resized ? 0.1 : 1;
      return TweenLite.to(this.element.find("div.holder"), timing, {
        "css": {
          "left": total_width * this.current_page * (-1)
        },
        "ease": Power4.easeOut
      });
    };

    Scroller.prototype.resize = function() {
      var current_position, padding, total_width, width;
      total_width = this.element.width();
      padding = this.row_style['padding'] * total_width;
      width = Math.floor(this.row_style['width'] * total_width);
      current_position = 0;
      $(this.element.find("div.row")).css({
        "padding-left": padding,
        "padding-right": padding,
        "width": width
      });
      return this.navClick(null, this.current_page, true);
    };

    return Scroller;

  })();

  Form = (function() {

    Form.prototype.fields = {
      "name": "Jméno",
      "email": "E-mail",
      "phone": "Telefon",
      "company": "Firma",
      "www": "Web",
      "notes": "Zpráva"
    };

    function Form() {
      this.focusout = __bind(this.focusout, this);

      this.focusin = __bind(this.focusin, this);

      this.form_clear = __bind(this.form_clear, this);

      this.submit = __bind(this.submit, this);

      var name, text, type, _ref;
      _ref = this.fields;
      for (name in _ref) {
        text = _ref[name];
        type = name === "notes" ? "textarea" : "input";
        $("" + type + "[name=" + name + "]").focusin(this.focusin);
        $("" + type + "[name=" + name + "]").focusout(this.focusout);
        $("" + type + "[name=" + name + "]").val(text);
      }
      $("form").submit(this.submit);
    }

    Form.prototype.submit = function(event) {
      var _this = this;
      $.post("index.php", $("form").serialize(), function() {
        _this.form_clear();
        return alert("Děkujeme. Formulář byl úspěšně odeslán.");
      });
      return false;
    };

    Form.prototype.form_clear = function() {
      var name, text, type, _ref;
      _ref = this.fields;
      for (name in _ref) {
        text = _ref[name];
        type = name === "notes" ? "textarea" : "input";
        $("" + type + "[name=" + name + "]").val(text);
      }
      return $("form select")[0].selectedIndex = 0;
    };

    Form.prototype.focusin = function(event) {
      var name, target, text;
      target = $(event.target);
      name = target.attr("name");
      text = this.fields[name];
      if (target.val() === text) {
        return target.val("");
      }
    };

    Form.prototype.focusout = function(event) {
      var name, target, text;
      target = $(event.target);
      name = target.attr("name");
      text = this.fields[name];
      if (target.val() === "") {
        return target.val(text);
      }
    };

    return Form;

  })();

  jQuery(function() {
    new Form();
    new Scroller("references", 3, {
      "padding": 0.02,
      "width": 0.29333
    });
    new Scroller("testimonials", 1, {
      "padding": 0,
      "width": 1
    });
    return $('.more-see').click(function(event) {
      var more_id, node;
      node = $(event.target).closest("a");
      more_id = node.attr("data-more");
      node.hide();
      $("#" + more_id).show();
      return false;
    });
  });

}).call(this);
