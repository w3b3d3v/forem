FactoryBot.define do
  factory :user_subscription do
    subscriber factory: %i[user], strategy: :create
    user_subscription_sourceable factory: %i[article with_user_subscription_tag_role_user],
                                 with_user_subscription_tag: true

    author           { user_subscription_sourceable.user }
    subscriber_email { subscriber.email }
  end
end
