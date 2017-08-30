class CreateShelterUpdates < ActiveRecord::Migration[5.1]
  def change
    create_table :shelter_updates do |t|
      t.string :shelter
      t.string :address
      t.string :city
      t.string :county
      t.string :phone
      t.string :contact_name
      t.string :url
      t.float :longitude
      t.float :latitude
      t.boolean :pets
      t.string :pet_notes
      t.boolean :volunteers
      t.string :volunteer_notes
      t.boolean :supplies
      t.string :supply_notes
      t.string :notes

      t.timestamps
    end

    add_reference :shelter_updates, :shelter, index: true
  end
end
