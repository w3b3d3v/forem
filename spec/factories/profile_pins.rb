FactoryBot.define do
  factory :profile_pin do
    profile factory: %i[user]
    after(:build) do |profile_pin|
      profile_pin.pinnable ||= create(:article, user: profile_pin.profile)
    end
  end
end
