FactoryBot.define do
  factory :reaction do
    user
    reactable factory: %i[article]
    category { "like" }
  end

  factory :reading_reaction, class: "Reaction" do
    user
    reactable factory: %i[article]
    category { "readinglist" }
  end

  factory :thumbsdown_reaction, class: "Reaction" do
    user
    reactable factory: %i[article]
    category { "thumbsdown" }

    trait :user do
      reactable factory: %i[user]
    end
  end

  factory :vomit_reaction, class: "Reaction" do
    user { create(:user, :trusted) }
    reactable factory: %i[article]
    category { "vomit" }

    trait :user do
      reactable factory: %i[user]
    end

    trait :comment do
      reactable factory: %i[comment]
    end
  end
end
