class Store  
  SettingsAllowed = %w(visible theme)
  
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
  field :icon
  field :latlng, :type => Array
  field :settings, :type => Hash
  embeds_many :products
  index [[ :latlng, Mongo::GEO2D ]]
  
  mount_uploader :icon, IconUploader
  
  before_save :geocode
  before_save :filter_invalid_settings
  
  validates_presence_of :email, :name, :description, :location
  
  def to_json_with_defaults
    to_json :methods => [:icon_url, :id]
  end
  
  def safe_update attrs = {}
    update_attributes email: attrs[:email],
      name: attrs[:name],
      description: attrs[:description],
      location: attrs[:location], 
      icon: attrs[:icon]
  end
  
  def filter_invalid_settings
    return if settings.blank?
    self.settings.delete_if { |attribute| not SettingsAllowed.include? attribute }
  end
  
  private
  def geocode
    return unless (new? and latlng.blank?) or (!new? and changes['location'])
    response = Geokit::Geocoders::GoogleGeocoder.geocode location
    self.latlng = [response.lat, response.lng]
  end
end