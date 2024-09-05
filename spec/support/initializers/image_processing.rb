RSpec.configure do |config|
  config.before(:each, :cloudinary) do |_example|
    allow(Cloudinary.config).to receive_messages(cloud_name: "CLOUD_NAME", api_key: "API_KEY",
                                                 api_secret: "API_SECRET", secure: "SECURE")
  end
end
