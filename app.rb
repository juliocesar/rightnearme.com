require File.dirname(__FILE__) + '/config/boot'

def parse_json_request
  request.body.rewind
  JSON.parse request.body.read
end

def login_required
  unless @store = Store.find(session[:store])
    flash[:error] = "Invalid login!"
  end
end

configure :development do |config|
  require 'sinatra/reloader'
  config.also_reload "#{config.root}/config/boot.rb"
end

configure do
  enable :run
  enable :sessions
end

get '/mystore/' do
  @store = Store.last
  # login_required
  haml :mystore, layout: false
end

get '/products.json' do
  @store = Store.last
  content_type :json
  @store.products.to_json :methods => [:id]
end

delete '/products.json/:id' do
  content_type :json
  @store = Store.last
  @product = @store.products.find params[:id]
  @product.destroy
  @product.to_json :methods => [:id]
end

post '/products.json' do  
  content_type :json
  @store = Store.last
  request.body.rewind
  attributes = JSON.parse request.body.read
  product = Product.new attributes
  @store.products << product
  begin
    @store.save!
    product.to_json :methods => [:id]
  rescue Mongoid::Errors::Validations
    puts product.errors.inspect
    status 500
    product.errors.add :type, 'validation'
    product.errors.to_json :methods => [:id]
  end
end

put '/profile.json' do
  content_type :json
  @store = Store.last
  attributes = parse_json_request
  @store.update_attributes attributes
  @store.to_json :methods => [:id]
end

get '/' do
  haml :home, layout: :welcome
end

get '/signup' do
  haml :signup, layout: :welcome
end

post '/accounts' do
  begin
    @store = Store.new params
    @store.save!
    session[:store] = @store.id
  rescue Mongoid::Errors::Validations
    return haml :signup, layout: :welcome
  end
  redirect '/mystore/'
end