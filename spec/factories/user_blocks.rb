FactoryBot.define do
  factory :user_block do
    blocker factory: %i[user]
    blocked factory: %i[user]
    config { "default" }
  end
end
