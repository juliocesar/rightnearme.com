source :rubygems

gem 'sinatra',  '1.0'
gem 'thin',     '1.2.7'
gem 'mongoid',  '2.0.0.beta.19'
gem 'bson_ext', '1.1'
gem 'haml',     '3.0.21'

group :development do
  gem 'sinatra-reloader', '0.5.0'
end

group :test do
  gem 'rspec',            '2.0.0'
  gem 'faker',            '0.3.1'
  gem 'machinist',        '2.0.0.beta2'
  gem 'machinist_mongo',
    :require => 'machinist/mongoid', 
    :git => 'http://github.com/nmerouze/machinist_mongo.git',
    :branch => 'machinist2'
  gem 'capybara',         '0.3.9'
end