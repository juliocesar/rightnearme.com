$(document).ready(function() {

  setTimeout(function() { window.scrollTo(0, 0); }, 1000);
    
  Tooltip = function(message, type) {
    var id = 'tip-' + new Date().getTime();
    $('body').append('<div class="tooltip floating notice" id="' + id + '">' + message + '</div');
    $('#' + id).show();
  }
  
  Tip = function(options) {
    var opts = _.extend({ 
      id: 'tip-' + new Date().getTime(), 
      icon: '!',
      classes: 'notice',
      duration: 2000
    }, options);
    if (!Tip.template) Tip.template = _.template($('#tooltip-template').html());
    $('body').append(Tip.template(opts));
    $('#' + opts.id).addClass('visible');
    setTimeout(function() { $('#' + opts.id).removeClass('visible'); }, opts.duration);
    setTimeout(function() { $('#' + opts.id).remove(); }, opts.duration + 250);
  }

  MobileSettings = Backbone.Model.extend({
    sync: function(method, model, options) {
      switch(method) {
        case 'create':
        case 'update':
          localStorage.setItem('Settings', JSON.stringify(model));
          break;
        case 'delete':
          localStorage.removeItem('Settings');
          break;
        case 'read':
          var settings = localStorage.getItem('Settings');
          model.attributes = (settings && JSON.parse(settings) || {});
          return model;
      }
      return this;
    },
    exists: function() {
      return !_.isEmpty(this.fetch().attributes);
    }
  });
  
  Settings = new MobileSettings;
  Settings.fetch();

  var HomeView = Backbone.View.extend({
    el              : $('#home'),
    resultTemplate  : _.template($('#result-template').html()),
    initialize: function() {
      if (true) $('#getting-started').show();
    },

    loadResult: function(store) {
      var li = $(this.resultTemplate(store));
      li.css('display', 'block');
      $('#results').show().append(li);
      setTimeout(function() { li.addClass('visible'); }, 1);
    }
  });

  HomePage = new HomeView;
  
  var SettingsView = Backbone.View.extend({
    el      :   $('#settings'),
    events  :   {
      'submit form': 'update'
    },
    
    initialize  : function () {
      Settings.bind('change', function() { tooltip('Settings updated!', 'notice'); });
    },

    update      : function(event) {
      event.preventDefault();
      var field = $(this.el).find('input');
      Settings.save({'keywords': field.val() });
      $('body').trigger('focus');
    }
  });
  
  SettingsPage = new SettingsView;

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
      window.scrollTo(0, 0);
    }
  });

  $('a.back').live('touchstart', function() { history.go(-1); });

  Controller = new ApplicationController;
  Backbone.history.start();


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
          setTimeout(function() { HomePage.loadResult(result); }, i * 250);
        })(seed[i]);
      }
    },
    3000
  );
});
