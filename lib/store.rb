class Store
  include Mongoid::Document
  field :email
  field :name
  field :description
  field :location
end