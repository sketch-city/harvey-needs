class ChangeToTextArea < ActiveRecord::Migration[5.1]
  def change
    change_column :shelters, :pet_notes, :text
    change_column :shelters, :volunteer_notes, :text
    change_column :shelters, :supply_notes, :text
    change_column :shelters, :notes, :text
    change_column :shelter_updates, :pet_notes, :text
    change_column :shelter_updates, :volunteer_notes, :text
    change_column :shelter_updates, :supply_notes, :text
    change_column :shelter_updates, :notes, :text
  end
end
