require "rails_helper"

RSpec.describe "Reading list" do
  let!(:user) { create(:user) }

  before do
    sign_in user
  end

  context "without tags" do
    context "when large reading list" do
      before { create_list(:reading_reaction, 46, user: user) }

      it "shows the large reading list", :js do
        visit "/readinglist"

        expect(page).to have_css("#reading-list", visible: :visible)
      end
    end
  end
end
