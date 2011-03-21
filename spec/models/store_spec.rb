require File.dirname(__FILE__) + '/../spec_helper'

describe Store do
  context 'a valid store' do
    subject { Store.make :empty }
    before  { subject.save }
    specify { subject.errors[:email].should_not be_empty }
  end
  
  context 'specifying settings' do
    it 'deletes attributes not in Store::SettingsAllowed' do
      store = Store.make settings: {'wontever' => 12}
      store.save
      store.settings['wontever'].should be_nil
    end
    
    it 'accepts attributes that are listed in SettingsAllowed' do
      attribute = Store::SettingsAllowed.first
      store = Store.make settings: { attribute => true }
      store.save
      store.settings[attribute].should be_true
    end
  end
  
  context 'geocoding' do
    it 'happens on the server side if not supplied when creating a store' do
      Geokit::Geocoders::GoogleGeocoder.stub(:geocode).and_return(Geokit::GeoLoc.new(lat: 150, lng: 150))
      Geokit::Geocoders::GoogleGeocoder.should_receive :geocode
      Store.make! :latlng => nil
    end
    it 'skips on the server side if supplied in the parameters when creating a store' do
      Geokit::Geocoders::GoogleGeocoder.should_not_receive :geocode
      Store.make! :latlng => [150, 150]
    end
  end
end