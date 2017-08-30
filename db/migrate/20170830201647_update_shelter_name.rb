class UpdateShelterName < ActiveRecord::Migration[5.1]
  def change
    rename_column :shelters, :shelter, :shelter_name
    rename_column :shelter_updates, :shelter, :shelter_name
  end
end
