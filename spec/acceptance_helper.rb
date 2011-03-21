require File.dirname(__FILE__) + '/spec_helper'
require Sinatra::Application.root + '/app'
disable :run

require 'steak'
require 'capybara'
require 'capybara/dsl'
require 'rack/test'

Capybara.app = Sinatra::Application

RSpec.configure do |config|
  def app
    Capybara.app
  end
  config.include Capybara
  config.include Rack::Test::Methods
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

def get_json *args
  get *args
end

def last_json_response
  JSON.parse(last_response.body)
end