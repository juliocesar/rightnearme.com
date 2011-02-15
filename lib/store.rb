class Store
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
  field :icon
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
end