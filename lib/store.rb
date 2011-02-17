class Store
  Settings = %w(visible :theme)
  
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
  field :icon
  field :settings, :type => Hash
  embeds_many :products
  
  mount_uploader :icon, IconUploader
  
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
  
  def update_settings attrs
    attrs.delete_if { |attribute| not Settings.include? attribute }
    update_attributes :settings => attrs
  end
end