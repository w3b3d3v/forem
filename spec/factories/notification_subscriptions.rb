FactoryBot.define do
  factory :notification_subscription do
    user
    notifiable factory: %i[article]
  end
end
