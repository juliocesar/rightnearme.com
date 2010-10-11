class Store
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
  
  validates_presence_of :email, :name, :description, :location
end