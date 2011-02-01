class Product
  include Mongoid::Document
  field :name
  field :description
  field :price
  embedded_in :store
  
  validates_numericality_of :price
  validates_presence_of :name
end