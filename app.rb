require File.dirname(__FILE__) + '/config/boot'

configure do
  enable :run
  set :public => File.dirname(__FILE__) + '/public'
end

