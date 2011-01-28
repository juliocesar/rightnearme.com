require File.dirname(__FILE__) + '/config/boot'

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

get '/mystore' do
  @store = Store.last
  # login_required
  haml :mystore, :layout => false
end

get '/' do
  haml :home, :layout => :welcome
end

get '/signup' do
  haml :signup, :layout => :welcome
end

post '/accounts' do
  begin
    @store = Store.new params
    @store.save!
    puts @store.inspect
    session[:store] = @store.id
  rescue Mongoid::Errors::Validations
    return haml :signup, layout: :welcome
  end
  redirect '/mystore'
end