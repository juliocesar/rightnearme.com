require 'bundler/setup'
Bundler.require :default, :test
require 'rspec'
require 'machinist'
require 'machinist/mongoid'
require File.dirname(__FILE__) + '/../config/boot'

RSpec.configure do |config|
  config.before(:each) { Machinist.reset_before_test }
end

Store.blueprint do
  name        { Faker::Company.name }
  email       { Faker::Internet.email }
  description { Faker::Lorem.paragraph(1 + rand(3)) }
  location    { Faker::Address.street_address }
end