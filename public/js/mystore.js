$(document).ready(function() {
  
  Product = Backbone.Model.extend({
    initialize: function() {
      this.bind('error', this.error);
    },
    clear: function() {
      this.destroy();
      this.view.remove();
    },
    validate: function(attributes) {
      if (attributes.price) {
        if (!parseFloat(attributes.price)) {
          return "price needs to be a number";
        }
      }
    },
    error: function(model, error) {
      alert('invalid');
      window.mod = model;
      window.err = error;      
    }
  });
  
  ProductList = Backbone.Collection.extend({
    model: Product,
    // url: '/products.json'
    localStorage: new Store('products')
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
        price: $('#product-price').val(),
        collection: Products
      };
    },
    addOne: function(product) {
      var view = new ProductView({model: product});
      this.$("#products-list").append(view.render().el);
    },
    addAll: function() {
      Products.each(this.addOne);
    }
  });
  
  Admin = new Application;
});