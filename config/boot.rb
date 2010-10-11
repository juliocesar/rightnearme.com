# $LOAD_PATH.unshift File.dirname(__FILE__) + '../lib'
$: << (File.dirname(__FILE__) + '../lib')

require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'mongoid'
require 'yaml'

require File.dirname(__FILE__) + '/../lib/store'

set :root, File.expand_path(File.dirname(__FILE__) + '/..')
set :public => Sinatra::Application.root + '/public',
    :views  => Sinatra::Application.root + '/views'
  
Mongoid.configure do |config|
  environment = Sinatra::Application.environment.to_s
  config.from_hash YAML.load_file(File.dirname(__FILE__) + '/mongoid.yml')[environment]
end