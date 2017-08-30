class ShelterUpdate < ApplicationRecord
  belongs_to :shelter, optional: true

  geocoded_by :full_street_address
  after_validation :geocode, if: ->(obj){ obj.full_street_address.present? && obj.full_street_address_changed? }

  def full_street_address
    [address, city, county].compact.join(", ")
  end

  def full_street_address_changed?
    address_changed? || city_changed? || county_changed?
  end
end
