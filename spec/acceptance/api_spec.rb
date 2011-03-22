require File.dirname(__FILE__) + '/../acceptance_helper'

feature 'the API' do
  context '/stores' do
    background do
      @larrys = Store.make! name: "Larry's Shop", description: 'coffee', latlng: [-33.704282, 151.099617]   # 1 George Street
      @moes = Store.make! name: "Moe's Shop", description: 'surf', latlng: [-33.700916, 151.100177]         # 100 George Street
      @curlys = Store.make! name: "Curly's Shop", description: 'climbing', latlng: [-33.865719, 151.207462] # 300 George Street   
      @books = Store.make! name: "Ze Bookstore", description: 'climbing', latlng: [-34.4883445, 150.4270025]  # Park Road, Bowral
    end
    
    scenario 'returns a list of closest stores matching keywords when keywords and a location is specified' do
      get '/stores', keywords: 'climbing coffee surf', location: "-33.7003437,151.0999281" # 110 George Street
      last_json_response[0]['name'].should == "Moe's Shop"
      last_json_response[1]['name'].should == "Larry's Shop"
      last_json_response[2]['name'].should == "Curly's Shop"
    end
    
    scenario 'returns a list of closest stores, regardless of keywords when none are specified' do
      get '/stores', location: "-33.7003437,151.0999281"
      last_json_response[0]['name'].should == "Moe's Shop"
      last_json_response[1]['name'].should == "Larry's Shop"
      last_json_response[2]['name'].should == "Curly's Shop"
      last_json_response[3]['name'].should == "Ze Bookstore"
    end
  end
end