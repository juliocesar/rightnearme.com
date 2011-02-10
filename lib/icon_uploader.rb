class IconUploader < CarrierWave::Uploader::Base
  storage :file
  
  def store_dir
    Sinatra::Application.public + '/logos'
  end
  
  def extension_white_list
    %w(jpg jpeg gif png)
  end
end