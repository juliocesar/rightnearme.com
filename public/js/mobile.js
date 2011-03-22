$(document).ready(function() {
  Session = {};

  Tip = function(options) {
    var opts = _.extend({ id: 'tip-' + new Date().getTime(), icon: '!', classes: 'notice', duration: 2000 }, options);
    if (!Tip.template) Tip.template = _.template($('#tooltip-template').html());
    var tip = $(Tip.template(opts));
    $(window).bind('scroll', function() {
      tip.css('top', ((document.body.scrollTop + window.innerHeight) - (tip.height() + 60)) + 'px');
    });
    $(window).trigger('scroll');
    $('section.current').append(tip);
    setTimeout(function() {
      tip.addClass('visible');
      setTimeout(function() { tip.removeClass('visible'); }, opts.duration);
      setTimeout(function() { tip.remove(); }, opts.duration + 250);
    }, 250);
  };

  setTimeout(function() { window.scrollTo(0, 0); }, 1000);
  $(window).bind('orientationchange', function() { scrollTo(0, 0); });

  var Store = Backbone.Model.extend();
  
  StoreListView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#result-template').html()),
    initialize: function() {
      this.model.view = this;
    },
    
    render: function() {
      $(this.el).html(this.template(this.model.toJSON())).addClass('arrow');
      return this;
    }    
  });

  var StoreCollection = Backbone.Collection.extend({
    model : Store,
    url   : '/stores'
  });

  Stores = new StoreCollection;

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
  Settings.bind('change', function() {
    HomePage.refresh();
  })

  var HomeView = Backbone.View.extend({
    el              : $('#home'),
    resultTemplate  : _.template($('#result-template').html()),
    initialize: function() {
      _.bindAll(this, 'search', 'clear', 'refresh', 'addOne', 'addAll');
      Settings.exists() ? $('#settings input').val(Settings.get('keywords')) : $('menu').hide() && $('#getting-started').show();
      var self = this;
      navigator.geolocation.getCurrentPosition(function(position) {
        Session.position = position.coords;
        self.refresh();
      });
      Stores.bind('add',      this.addOne);
      Stores.bind('refresh',  this.addAll);
      Stores.bind('all',      this.render);
    },
    
    render: function() {
      var showing = _.template($('#now-showing-template').html());
      $('#now-showing').html(showing({count: Stores.length}));
    },

    refresh: function() {
      this.showLoading();
      this.clear();
      Stores.fetch({
        success :   this.hideLoading,
        url     :   '/stores?latlng=' + [Session.position.latitude, Session.position.longitude].join(',') + '&keywords=' + Settings.attributes.keywords
      });
    },
    
    addOne: function(store) {
      var view = new StoreListView({model: store});
      this.$('#results').show().append(view.render().el);
    },
    
    addAll: function() {
      Stores.each(this.addOne);
    },

    showLoading: function() {
      $('#results-wrapper').removeClass('visible');
      setTimeout(function() {
        $('#loading').show();
        $('#loading').addClass('visible');
      }, 260);
    },

    hideLoading: function() {
      $('#loading').removeClass('visible');
      setTimeout(function() {
        $('#loading').hide();
        $('#results-wrapper').show().addClass('visible')
      }, 260);
    },

    clear: function() {
      $('#results li').remove();
    }
  });

  HomePage = new HomeView;

  var SettingsView = Backbone.View.extend({
    el      :   $('#settings'),
    events  :   {
      'submit form': 'update'
    },

    initialize  : function () {
      Settings.bind('change', function() {
        $('#getting-started').hide();
        $('menu').css('display', '-webkit-box');
        Tip({ message: 'Settings updated!', duration: 3000 });
        HomePage.shouldUpdate = true;
      });
    },

    update      : function(event) {
      event.preventDefault();
      var field = $(this.el).find('input');
      Settings.save({'keywords': field.val() });
      field.get(0).blur();
    }
  });

  SettingsPage = new SettingsView;

  var ApplicationController = Backbone.Controller.extend({
    routes: {
      '!/'                  :   'root',
      '!/settings'          :   'settings',
      '!/get-your-own'      :   'yourown',
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

    yourown: function() {
      this.navigate('#get-your-own');
    },

    navigate: function(id, callback) {
      $('.current').removeClass('current').addClass('reverse');
      var section = $(id);
      section.addClass('current');
      if (id !== '#home' && !section.find('a.back').length) $(".current .toolbar").prepend('<a class="back"">Back</a>');
      setTimeout(function() {
        scrollTo(0, 0);
        if (_.isFunction(callback)) callback();
      }, 250);
    }
  });

  $('a.back').live('touchstart', function() { history.go(-1); });

  Controller = new ApplicationController;
  Backbone.history.start();
});
