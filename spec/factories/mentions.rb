FactoryBot.define do
  factory :mention do
    user
    mentionable factory: %i[article]
  end
end
