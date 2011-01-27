require File.dirname(__FILE__) + '/../acceptance_helper'

feature 'front page' do
  background do
    visit '/'
  end
  
  scenario 'should have a sign me up button' do
    page.should have_css('a.sign-up')
  end
end
