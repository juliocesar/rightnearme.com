require File.dirname(__FILE__) + '/../acceptance_helper'

describe 'the front page' do
  include Capybara  
  
  it 'should have a sign me up button' do
    visit '/'
    find(:css, 'a.sign-up').should_not be_nil
  end
end