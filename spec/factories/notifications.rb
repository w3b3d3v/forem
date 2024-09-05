FactoryBot.define do
  factory :notification do
    user { { strategy: :create } }
    organization { { strategy: :create } }
    notifiable { create(:article) }
  end
end
