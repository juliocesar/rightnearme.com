class Product
  include Mongoid::Document
  field :name
  field :description
  field :price
  embedded_in :store
  
  validates_presence_of :name
end