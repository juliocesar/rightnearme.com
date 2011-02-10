source :rubygems

gem 'sinatra',      '1.1.2'
gem 'thin',         '1.2.7'
gem 'mongoid',      '2.0.0.rc.7'
gem 'bson_ext',     '1.2.0'
gem 'haml',         '3.0.25'
gem 'rack-flash',   '0.1.1'
gem 'carrierwave',  '0.5.1'
gem 'mini_magick',  '3.2'

group :development do
  gem 'sinatra-reloader', '0.5.0'
end

group :test do
  gem 'steak',    '1.1.0'
  gem 'capybara', '0.4.1.1'
  gem 'rspec',            '2.4.0'
  gem 'faker',            '0.9.5'
  gem 'machinist',        '2.0.0.beta2'
  gem 'machinist_mongo',
    :require => 'machinist/mongoid', 
    :git =>     'http://github.com/nmerouze/machinist_mongo.git',
    :branch =>  'machinist2'
end