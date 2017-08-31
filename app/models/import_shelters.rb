require 'csv'

class ImportShelters
  attr_reader :path

  def initialize(path)
    @path = Rails.root.join(path)
  end

  def import
    CSV.foreach(path, headers: true) do |row|
      shelter = Shelter.create!({
        shelter_name: row["Shelter"],
        address: row["Address"],
        city: row["City"],
        county: row["County"],
        phone: row["Phone"],
        longitude: row["longitude"],
        latitude: row["latitude"],
        pets: row["Pets"].present? && row['Pets'].downcase.strip != 'no',
        pet_notes: row["Pets"],
        volunteers: row["Volunteer needs"].present?,
        volunteer_notes: row["Volunteer needs"],
        supplies: row["Supply Needs"].present?,
        supply_notes: row["Supply Needs"],
        notes: row["Notes"],
      })
      ShelterUpdate.create!(shelter.attributes.merge({id: nil, shelter_id: shelter.id, accepted_at: Time.now}))
    end
  end
end
