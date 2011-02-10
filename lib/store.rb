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
end