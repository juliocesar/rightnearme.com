class Store
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
  embeds_many :products
  
  validates_presence_of :email, :name, :description, :location
end