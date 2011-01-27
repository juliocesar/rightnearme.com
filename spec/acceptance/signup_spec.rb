require File.dirname(__FILE__) + '/../acceptance_helper'

feature 'login' do
  background do
    visit '/signup'
  end
  
  scenario 'should have a form' do
    page.should have_css('form#new-account')
  end
  
  scenario 'signing up with valid data' do
    signup Store.make
    page.should_not have_css('form#new-account')
  end
  
  scenario 'invalid data' do
    signup Store.make(:empty)
    page.should have_css('form#new-account')
  end    
end