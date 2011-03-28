require 'bundler/setup'
require 'sinatra'
Sinatra::Application.environment = :test
Bundler.require :default, Sinatra::Application.environment
require 'rspec'
require 'machinist'
require 'machinist/mongoid'
require File.dirname(__FILE__) + '/../config/boot'

Mongoid.logger.level = 5 # sshhhh

RSpec.configure do |config|
  config.before(:each) do 
    Machinist.reset_before_test
  end
  
  config.after :all do
    Store.delete_all
  end
end

Store.blueprint do
  name        { Faker::Company.name }
  email       { Faker::Internet.email }
  description { Faker::Lorem.paragraph(1 + rand(3)) }
  location    { Faker::Address.street_address }
  latlng      { [150.15, 150.15] }
end

Store.blueprint :empty do
  name        { nil }
  email       { nil }
  description { nil }
  location    { nil }
end