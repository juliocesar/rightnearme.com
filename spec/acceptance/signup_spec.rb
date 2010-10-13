require File.dirname(__FILE__) + '/../acceptance_helper'

describe 'the login page' do
  include Capybara  
  
  before do visit '/signup' end
  
  it 'should have a form' do
    find(:css, 'form#new-account').should_not be_nil
  end
  
  context 'signing up' do
    it "redirects to the store admin interface upon the info being valid" do
      signup Store.make
      find(:css, 'form#new-account').should be_nil
    end
    
    it "renders the signup page again if the data is invalid" do
      signup Store.make(:empty)
      find(:css, 'form#new-account').should_not be_nil
    end
  end
end