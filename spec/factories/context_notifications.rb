FactoryBot.define do
  factory :context_notification do
    action { "Published" }
    context factory: %i[article]
  end
end
