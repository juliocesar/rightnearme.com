$(document).ready(function() {
  Product = Backbone.Model.extend();

  ProductsCollection = Backbone.Collection.extend({
    model: Product,
    url: '/products.json',
    selected: function() {
      return this.filter(function(product) { return $(product.view.el).find(':input:checked').length; });
    },
    removeSelected: function() {
      _.each(Products.selected(), function(product) { product.destroy(); });
    }
  });
  Products = new ProductsCollection;

  ProductView = Backbone.View.extend({
    tagName: 'tr',
    editing: false,
    events: {
      'click input[type="checkbox"]'  :   'toggleSelect',
      'click a'                       :   'toggleEdit',
      'submit form'                   :   'updateProduct'
    },
    template: _.template($('#product-template').html()),
    initialize: function() {
      _.bindAll(this, 'render', 'remove', 'toggleEdit', 'doneEditing');
      // this.model.bind('change', this.doneEditing);
      this.model.bind('remove', this.remove);
      this.model.view = this;
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },
    toggleSelect: function() {
      var total = Products.selected().length;
      total ? $('#delete').text('- Delete (' + total + ')') : $('#delete').text('- Delete');
    },
    toggleEdit: function(event) {
      var form = $(event.target).siblings('form');
      if (form.is(':visible')) {
        form.fadeOut(100);
        this.editing = false;
      } else {
        form.fadeIn();
        this.editing = true;
      }
    },
    remove: function() {
      $(this.el).remove();
      this.toggleSelect();
    },
    updateProduct: function(event) {
      event.preventDefault();
      var form = $(this.el).find('form'), ui = this;
      this.model.save(
        {
          name        : form.find('input.name').val(),
          description : form.find('textarea').val(),
          price       : form.find('input.price').val()
        },
        {
          success: ui.doneEditing,
          error:   ui.handleError
        }
      );
    },
    doneEditing: function() {
      var ui = this;
      $(this.el).find('form').fadeOut(function() { ui.render(); });
    },
    handleError: function(model, response) {
      var error = JSON.parse(response.responseText), ui = model.view;
      switch(error.type) {
        case 'validation':
          var form = $(ui.el).find('form');
          for (var property in error) {
            if (property == 'type') continue;
            var field = form.find('.' + property);
            field.siblings('span.error').remove();
            field.after('<span class="error invisible">← ' + error[property] + '</span>');
            field.siblings('span').animate({opacity: 'toggle', marginLeft: '0.5em'});
          }
      }
    }
  });

  ProductsUI = Backbone.View.extend({
    el: $('#panel'),
    events: {
      'submit #new-product' :   'createProduct',
      'click #add-new'      :   'addNew',
      'click #delete'       :   'remove'
    },
    initialize: function() {
      _.bindAll(this, 'addOne', 'addAll', 'render');
      this.input = this.$('#new-product-name');
      Products.bind('add', this.addOne);
      Products.bind('add', this.clearForm);
      Products.bind('refresh', this.addAll);
      Products.bind('all', this.render);
      Products.fetch();
    },
    render: function() {
      var all = Products.all();
    },
    createProduct: function(e) {
      e.preventDefault();
      Products.create(this.newAttributes());
    },
    addNew: function() {
      $('#new-product:visible').length ? $('#new-product').fadeOut(100) :
        $('#new-product').fadeIn();
    },
    newAttributes: function() {
      return {
        name        : $('#product-name').val(),
        description : $('#product-description').val(),
        price       : $('#product-price').val()
      };
    },
    addOne: function(product) {
      var view = new ProductView({model: product});
      this.$("#products-list").append(view.render().el);
    },
    clearForm: function() {
      $('#new-product :input').val('');
    },
    addAll: function() {
      Products.each(this.addOne);
    },
    remove: function() {
      Products.removeSelected(Products.selected());
    }
  });

  ProductsView = new ProductsUI;

  Profile = Backbone.Model.extend({
    clear :   $.noop,
    url   :   '/profile.json'
  });

  Store = new Profile;

  ProfileUI = Backbone.View.extend({
    el        :   $('#panel'),
    template  :   _.template($('#profile-template').html()),
    form      :   $('#edit-profile'),
    initialize: function() {
      _.bindAll(this, 'updateStore', 'render');
      this.model.bind('change', this.render);
      var attributes = $('#profile-template').data('current-store');
      Store.set(attributes);
    },
    render: function() {
      $('#current-store').html(this.template(Store.toJSON()));
    },
    renderWith: function(attributes) {
      window.those = attributes;
      $('#current-store').html(this.template(attributes));
    }
  });

  ProfileView = new ProfileUI({model: Store});

  ApplicationController = Backbone.Controller.extend({
    routes: {
      '!/':           'root',
      '!/profile':    'profile',
      '!/settings':   'settings'
    },

    root: function() {
      $('#currently').animate({left: 0}, 200);
      $('.section.active').removeClass('active');
      $('#main a.active').removeClass('active');
      $('#go-products').addClass('active');
      $('#products').addClass('active');
    },

    profile: function() {
      $('#currently').animate({left: $('#main a').outerWidth() * 1}, 200);
      $('.section.active').removeClass('active');
      $('#main a.active').removeClass('active');
      $('#go-profile').addClass('active');
      $('#profile').addClass('active');
    },

    settings: function() {
      $('#currently').animate({left: $('#main a').outerWidth() * 2}, 200);
      $('.section.active').removeClass('active');
      $('#main a.active').removeClass('active');
      $('#go-settings').addClass('active');
      $('#settings').addClass('active');
    }
  });
  Controller = new ApplicationController;
  Backbone.history.start();
});