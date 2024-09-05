FactoryBot.define do
  factory :follow do
    follower factory: %i[user]
    followable factory: %i[organization]
  end
end
