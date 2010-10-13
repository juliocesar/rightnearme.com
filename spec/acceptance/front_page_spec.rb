require File.dirname(__FILE__) + '/../acceptance_helper'

describe 'the front page' do
  include Capybara  
  before do visit '/' end
  
  it 'should have a sign me up button' do
    find(:css, 'a.sign-up').should_not be_nil
  end
end