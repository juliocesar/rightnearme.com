$(document).ready(function() {
  Product = Backbone.Model.extend();

  ProductsCollection = Backbone.Collection.extend({
    model: Product,
    url: '/products.json',
    selected: function() {
      return this.filter(function(product) { return $(product.view.el).find(':input:checked').length; });
    },
    remove: function() {
      _.each(Products.selected(), function(product) { product.destroy(); });
    }
  });
  Products = new ProductsCollection;

  ProductView = Backbone.View.extend({
    tagName: 'tr',
    events: {
      'click input[type="checkbox"]' :  'toggleSelect'
    },
    template: _.template($('#product-template').html()),
    initialize: function() {
      _.bindAll(this, 'render', 'remove');
      this.model.bind('change', this.render);
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
    remove: function() {
      $(this.el).remove();
      this.toggleSelect();
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
      Products.remove(Products.selected());
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
    events    : {
      'submit #edit-profile' :  'updateStore'
    },
    initialize: function() {
      _.bindAll(this, 'updateStore', 'render');
      this.model.bind('change', this.render);
      var attributes = $('#profile-template').data('current-store');
      Store.set(attributes);
    },
    render: function() {
      $('#current-store').html(this.template(Store.toJSON()));
    },
    updateStore: function(e) {
      e.preventDefault();
      Store.set({
        email       :   this.form.find('#store-email').val(),
        name        :   this.form.find('#store-name').val(),
        description :   this.form.find('#store-description').val(),
        location    :   this.form.find('#store-location').val()
      });
      Store.save();
    }
  });
  
  ProfileView = new ProfileUI({model: Store});
  
  ApplicationController = Backbone.Controller.extend({
    routes: { 
      '!/':           'root',
      '!/profile':    'profile',
      '!/statistics': 'statistics'      
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

    statistics: function() {
      $('#currently').animate({left: $('#main a').outerWidth() * 2}, 200);
      $('.section.active').removeClass('active');
      $('#main a.active').removeClass('active');
      $('#go-stats').addClass('active');
      $('#statistics').addClass('active');
    }
  });
  Controller = new ApplicationController;
  Backbone.history.start();
});