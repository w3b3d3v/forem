FactoryBot.define do
  factory :discussion_lock do
    article { { strategy: :create } }
    locking_user factory: %i[user], strategy: :create

    reason { "This post has too many off-topic comments" }
    notes  { "Private notes" }
  end
end
