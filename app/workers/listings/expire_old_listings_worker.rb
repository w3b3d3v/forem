module Listings
  class ExpireOldListingsWorker
    include Sidekiq::Job

    sidekiq_options queue: :low_priority, retry: 5

    def perform
      Listing.published.where("bumped_at < ?", 30.days.ago).find_each do |listing|
        listing.update(published: false)
      end
      Listing.published.where("expires_at < ?", Time.zone.today).find_each do |listing|
        listing.update(published: false)
      end
    end
  end
end
