class AddAcceptedToShelterUpdate < ActiveRecord::Migration[5.1]
  def change
    add_column :shelter_updates, :accepted_at, :datetime
    add_column :shelter_updates, :rejected_at, :datetime
  end
end
