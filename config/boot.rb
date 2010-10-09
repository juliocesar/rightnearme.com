# $LOAD_PATH.unshift File.dirname(__FILE__) + '../lib'
$: << (File.dirname(__FILE__) + '../lib')

require 'rubygems'
require 'bundler/setup'
require 'sinatra'
require 'mongoid'
require 'yaml'

require File.dirname(__FILE__) + '/../lib/store'

Mongoid.configure do |config|
  environment = Sinatra::Application.environment.to_s
  puts YAML.load_file(File.dirname(__FILE__) + '/mongoid.yml')[environment]
  config.from_hash YAML.load_file(File.dirname(__FILE__) + '/mongoid.yml')[environment]
end