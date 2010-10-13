require File.dirname(__FILE__) + '/config/boot'

configure :development do |config|
  require 'sinatra/reloader'
  config.also_reload "#{config.root}/config/boot.rb"
end

configure do
  enable :run
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
  rescue Mongoid::Errors::Validations
    return haml :signup, :layout => :welcome
  end
  redirect '/mystore'
end