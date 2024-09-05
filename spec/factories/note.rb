FactoryBot.define do
  factory :note do
    noteable factory: %i[user]
    content { Faker::Book.title }
    reason { "misc_note" }
  end
end
