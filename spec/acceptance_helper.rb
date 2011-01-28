require File.dirname(__FILE__) + '/spec_helper'
require Sinatra::Application.root + '/app'
disable :run

require 'steak'
require 'capybara'
require 'capybara/dsl'

Capybara.app = Sinatra::Application

RSpec.configure do |config|
  config.include Capybara
end

# Helpers
def signup store
  visit '/signup'
  fill_in 'email',  :with => store.email
  fill_in 'name',   :with => store.name
  fill_in 'description',  :with => store.description
  fill_in 'location',     :with => store.location
  click_button 'Create my account'
end

