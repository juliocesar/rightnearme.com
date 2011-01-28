$(document).ready(function() {
  Product = Backbone.Model.extend({
    clear: function() {
      this.destroy();
      this.view.remove();
    }
  });
  
  ProductList = Backbone.Collection.extend({
    model: Product,
    localStorage: new Store('products')
  });
  
  Products = new ProductList;
  
  ProductView = Backbone.View.extend({
    tagName: 'li',
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
      'submit #new-product':  "createProduct"
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
    newAttributes: function() {
      return {
        name: $('#product-name').val(),
        description: $('#product-description').val(),
        price: $('#product-price').val()
      };
    },
    addOne: function(product) {
      window.foo = product;
      var view = new ProductView({model: product});
      window.bar = view;
      this.$("#products-list").append(view.render().el);
    },
    addAll: function() {
      Products.each(this.addOne);
    }
  });
  
  Admin = new Application;
});