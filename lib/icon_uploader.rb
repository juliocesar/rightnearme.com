class IconUploader < CarrierWave::Uploader::Base
  storage :file
  
  def store_dir
    Sinatra::Application.root + "/public/logos/#{model.id}"
  end
  
  def extension_white_list
    %w(jpg jpeg gif png)
  end
  
  def url
    "/logos/#{model.id}/#{model.icon_filename}"
  end
end