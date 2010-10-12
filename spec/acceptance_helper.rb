require File.dirname(__FILE__) + '/spec_helper'
require Sinatra::Application.root + '/app'
disable :run

require 'capybara'
require 'capybara/dsl'

Capybara.app = Sinatra::Application
