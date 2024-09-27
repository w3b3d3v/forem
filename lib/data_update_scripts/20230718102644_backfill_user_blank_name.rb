module DataUpdateScripts
  class BackfillUserBlankName
    def run
      User.where(" TRIM(name)='' ").find_each do |user|
        user.update_column(:name, user.username)
      end
    end
  end
end
