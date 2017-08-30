require 'test_helper'

class ShelterUpdatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @shelter_update = shelter_updates(:one)
  end

  test "should get index" do
    get shelter_updates_url
    assert_response :success
  end

  test "should get new" do
    get new_shelter_update_url
    assert_response :success
  end

  test "should create shelter_update" do
    assert_difference('ShelterUpdate.count') do
      post shelter_updates_url, params: { shelter_update: { address: @shelter_update.address, city: @shelter_update.city, contact_name: @shelter_update.contact_name, county: @shelter_update.county, latitude: @shelter_update.latitude, longitude: @shelter_update.longitude, notes: @shelter_update.notes, pet_notes: @shelter_update.pet_notes, pets: @shelter_update.pets, phone: @shelter_update.phone, shelter: @shelter_update.shelter, supplies: @shelter_update.supplies, supply_notes: @shelter_update.supply_notes, url: @shelter_update.url, volunteer_notes: @shelter_update.volunteer_notes, volunteers: @shelter_update.volunteers } }
    end

    assert_redirected_to shelter_update_url(ShelterUpdate.last)
  end

  test "should show shelter_update" do
    get shelter_update_url(@shelter_update)
    assert_response :success
  end

  test "should get edit" do
    get edit_shelter_update_url(@shelter_update)
    assert_response :success
  end

  test "should update shelter_update" do
    patch shelter_update_url(@shelter_update), params: { shelter_update: { address: @shelter_update.address, city: @shelter_update.city, contact_name: @shelter_update.contact_name, county: @shelter_update.county, latitude: @shelter_update.latitude, longitude: @shelter_update.longitude, notes: @shelter_update.notes, pet_notes: @shelter_update.pet_notes, pets: @shelter_update.pets, phone: @shelter_update.phone, shelter: @shelter_update.shelter, supplies: @shelter_update.supplies, supply_notes: @shelter_update.supply_notes, url: @shelter_update.url, volunteer_notes: @shelter_update.volunteer_notes, volunteers: @shelter_update.volunteers } }
    assert_redirected_to shelter_update_url(@shelter_update)
  end

  test "should destroy shelter_update" do
    assert_difference('ShelterUpdate.count', -1) do
      delete shelter_update_url(@shelter_update)
    end

    assert_redirected_to shelter_updates_url
  end
end
