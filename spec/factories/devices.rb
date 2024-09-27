FactoryBot.define do
  factory :device do
    user { { strategy: :create } }
    consumer_app { { strategy: :create } }
    sequence(:token) { |n| "unique_token_#{n}" }
    platform { :ios }
  end
end
