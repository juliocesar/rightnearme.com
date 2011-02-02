$(document).ready(function() {

  Product = Backbone.Model.extend({
    initialize: function() {
      this.bind('error', this.error);
    },
    clear: function() {
      this.destroy();
      this.view.remove();
    },
    error: function(model, xhr) {
      
    }
  });

  ProductList = Backbone.Collection.extend({
    model: Product,
    url: '/products.json'
  });

  Products = new ProductList;

  ProductView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#product-template').html()),
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.view = this;
    },
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  Application = Backbone.View.extend({
    el: $('#panel'),
    profileTemplate: _.template($('#profile-template').html()),
    events: {
      'submit #new-product':  'createProduct',
      'click #add-new':       'addNew'
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
    addNew: function(e) {
      $('#new-product:visible').length ? $('#new-product').fadeOut(100) :
        $('#new-product').fadeIn();
    },
    newAttributes: function() {
      return {
        name: $('#product-name').val(),
        description: $('#product-description').val(),
        price: $('#product-price').val()
      };
    },
    addOne: function(product) {
      var view = new ProductView({model: product});
      this.$("#products-list").append(view.render().el);
    },
    showUndo: function(product) {
      
    },
    clearForm: function() {
      $('#new-product :input').val('');
    },
    addAll: function() {
      Products.each(this.addOne);
    }
  });

  Admin = new Application;
  
  AdminController = Backbone.Controller.extend({
    routes: { 
      '!/':           'default',
      '!/profile':    'profile',
      '!/statistics': 'statistics'      
    },
    
    default: function() {
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
    },
    
    
  });
  
  Controler = new AdminController;
  Backbone.history.start()
  
});