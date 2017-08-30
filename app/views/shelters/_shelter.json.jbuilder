json.extract! shelter, :id, :shelter_name, :address, :city, :county, :phone, :contact_name, :url, :longitude, :latitude, :pets, :pet_notes, :volunteers, :volunteer_notes, :supplies, :supply_notes, :notes, :created_at, :updated_at
json.url shelter_url(shelter, format: :json)
