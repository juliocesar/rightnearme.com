$(document).ready(function() {

  Product = Backbone.Model.extend({
    initialize: function() {
      // window.deeze = this;
      // this.id = this.attributes._id;
    }
  });

  ProductList = Backbone.Collection.extend({
    model: Product,
    url: '/products.json',
    selected: function() {
      return this.filter(function(product) { return $(product.view.el).find(':input:checked').length });
    },
    remove: function() {
      _.each(Products.selected(), function(product) { product.destroy(); });
    }
  });

  Products = new ProductList;

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
      console.log(this.model.toJSON());
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

  Application = Backbone.View.extend({
    el: $('#panel'),
    profileTemplate: _.template($('#profile-template').html()),
    events: {
      'submit #new-product' :   'createProduct',
      'click #add-new'      :   'addNew',
      'click #delete'       :   'delete'
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
    clearForm: function() {
      $('#new-product :input').val('');
    },
    addAll: function() {
      Products.each(this.addOne);
    },
    delete: function() {
      Products.remove(Products.selected());
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