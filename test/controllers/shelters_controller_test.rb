require 'test_helper'

class SheltersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @shelter = shelters(:one)
  end

  test "should get index" do
    get shelters_url
    assert_response :success
  end

  test "should get new" do
    get new_shelter_url
    assert_response :success
  end

  test "should create shelter" do
    assert_difference('Shelter.count') do
      post shelters_url, params: { shelter: { address: @shelter.address, city: @shelter.city, contact_name: @shelter.contact_name, county: @shelter.county, latitude: @shelter.latitude, longitude: @shelter.longitude, notes: @shelter.notes, pet_notes: @shelter.pet_notes, pets: @shelter.pets, phone: @shelter.phone, shelter: @shelter.shelter, supplies: @shelter.supplies, supply_notes: @shelter.supply_notes, url: @shelter.url, volunteer_notes: @shelter.volunteer_notes, volunteers: @shelter.volunteers } }
    end

    assert_redirected_to shelter_url(Shelter.last)
  end

  test "should show shelter" do
    get shelter_url(@shelter)
    assert_response :success
  end

  test "should get edit" do
    get edit_shelter_url(@shelter)
    assert_response :success
  end

  test "should update shelter" do
    patch shelter_url(@shelter), params: { shelter: { address: @shelter.address, city: @shelter.city, contact_name: @shelter.contact_name, county: @shelter.county, latitude: @shelter.latitude, longitude: @shelter.longitude, notes: @shelter.notes, pet_notes: @shelter.pet_notes, pets: @shelter.pets, phone: @shelter.phone, shelter: @shelter.shelter, supplies: @shelter.supplies, supply_notes: @shelter.supply_notes, url: @shelter.url, volunteer_notes: @shelter.volunteer_notes, volunteers: @shelter.volunteers } }
    assert_redirected_to shelter_url(@shelter)
  end

  test "should destroy shelter" do
    assert_difference('Shelter.count', -1) do
      delete shelter_url(@shelter)
    end

    assert_redirected_to shelters_url
  end
end
