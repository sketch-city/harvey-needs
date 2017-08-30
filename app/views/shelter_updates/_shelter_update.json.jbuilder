json.extract! shelter_update, :id, :shelter, :address, :city, :county, :phone, :contact_name, :url, :longitude, :latitude, :pets, :pet_notes, :volunteers, :volunteer_notes, :supplies, :supply_notes, :notes, :created_at, :updated_at
json.url shelter_update_url(shelter_update, format: :json)
