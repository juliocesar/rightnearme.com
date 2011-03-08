$(document).ready(function() {

  var HomeView = Backbone.View.extend({
    el: $('#home')
  });

  var ApplicationController = Backbone.Controller.extend({
    routes: {
      '!/'                  :   'root',
      '!/stores/:username'  :   'store'
    },

    root: function() {
      this.navigate('#home');
    },

    store: function(username) {
      this.navigate('#' + username);
    },

    navigate: function(id) {
      $('.current').removeClass('current').addClass('reverse');
      $(id).addClass('current');
      if (id !== '#home') $(".current .toolbar").prepend('<a class="back">Back</a>');
    }
  });

  $('a.back').live('touchstart', function() { history.go(-1); });
  
  Controller = new ApplicationController;
  Backbone.history.start();

  // $("body > section").first().addClass("current");
  // $("a.back").live('touchstart', function(event) {
  //  var current = $(event.currentTarget).attr("href");
  //   $(".current").removeClass("current").addClass("reverse");
  //   $(current).addClass("current");
  // });
  //
  // $(".menu a[href]").live('touchstart', function(event) {
  //   var section = $(event.currentTarget).closest('section'),
  //     link = $(event.currentTarget),
  //     prev_element = "#"+(section.removeClass("current").addClass("reverse").attr("id"));
  //   $(link.attr("href")).addClass("current");
  //   $(".current .back").remove();
  //   $(".current .toolbar").prepend("<a href=\""+prev_element+"\" class=\"back\">Back</a>");
  // });


});
