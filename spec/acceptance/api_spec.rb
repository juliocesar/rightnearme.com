require File.dirname(__FILE__) + '/../acceptance_helper'

feature 'the API' do
  context '/stores' do
    background do
      @larrys = Store.make! name: "Larry's Shop", description: 'coffee', latlng: [-33.704282, 151.099617]    # 1 George Street
      @moes = Store.make! name: "Moe's Shop", description: 'surf', latlng: [-33.700916, 151.100177]          # 100 George Street
      @curlys = Store.make! name: "Curly's Shop", description: 'climbing', latlng: [-33.865719, 151.207462]  # 300 George Street   
    end
    
    scenario 'returns a list of closest stores matching keywords' do
      get '/stores', keywords: 'climbing coffee surf', location: "-33.7003437,151.0999281" # 110 George Street
      last_json_response[0]['name'].should == "Moe's Shop"
      last_json_response[1]['name'].should == "Larry's Shop"
      last_json_response[2]['name'].should == "Curly's Shop"
    end
  end
  
end