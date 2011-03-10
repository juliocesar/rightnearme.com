$(document).ready(function() {

  setTimeout(function() { window.scrollTo(0, 0) }, 1000);

  var HomeView = Backbone.View.extend({
    el: $('#home'),
    resultTemplate: _.template($('#result-template').html()),
    initialize: function() {
      if (true) this.askKeywords(); // if Preferences.new
    },

    askKeywords: function() {
      setTimeout(
        function() {
          $('#getting-started').css('display', 'block');
          setTimeout(function() { $('#getting-started').addClass('visible'); }, 1);
        },
        2000
      );
    },

    loadResult: function(store) {
      var li = $(this.resultTemplate(store));
      li.css('display', 'block');
      $('#results').show().append(li);
      setTimeout(function() { li.addClass('visible') }, 1);
    }
  });

  Home = new HomeView;

  setTimeout(
    function() {
      var seed = [];
      seed.push({name: 'Taste Cafe', street: 'Foveaux Street', username: 'taste'});
      seed.push({name: 'RTA Staff Credit Union', street: 'Kippax Street', username: 'rta'});
      seed.push({name: 'Rona Leather Fashions', street: 'Foveaux Street', username: 'rona'});
      seed.push({name: 'BodyMindLife Yoga', street: 'Foveaux Street', username: 'yoga'});
      seed.push({name: 'Forresters Hotel', street: 'Fitzroy Road', username: 'forresters'});
      seed.push({name: 'Zante Cafe', street: 'Foveaux Street', username: 'zante'});
      seed.push({name: 'Evening Star Hotel', street: 'Elizabeth Street', username: 'evening'});
      for (var i = 0; i < seed.length; i++) {
        (function(result) {
          setTimeout(function() { Home.loadResult(result); }, i * 250);
        })(seed[i]);
      }
    },
    3000
  );

  var ApplicationController = Backbone.Controller.extend({
    routes: {
      '!/'                  :   'root',
      '!/settings'          :   'settings',
      '!/stores/:username'  :   'store'
    },

    root: function() {
      this.navigate('#home');
    },

    store: function(username) {
      this.navigate('#' + username);
    },

    settings: function() {
      this.navigate('#settings');
    },

    navigate: function(id) {
      $('.current').removeClass('current').addClass('reverse');
      var section = $(id);
      $(id).addClass('current');
      if (id !== '#home' && !section.find('a.back').length) $(".current .toolbar").prepend('<a class="back">Back</a>');
      $('.current').css('min-height', window.innerHeight);
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
