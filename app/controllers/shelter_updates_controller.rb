class ShelterUpdatesController < ApplicationController
  before_action :set_shelter_update, only: [:show, :edit, :update, :destroy, :accept]
  before_action :updateable_keys

  def index
    @shelter_updates = ShelterUpdate.where(accepted_at: nil, rejected_at: nil).all
  end

  def show
    @shelter = @shelter_update.shelter || Shelter.new
  end

  def new
    if(params[:shelter_id])
      @shelter = Shelter.find(params[:shelter_id])
      @shelter_update = ShelterUpdate.new(shelter: @shelter)
    else
      @shelter = Shelter.new
      @shelter_update = ShelterUpdate.new()
    end
  end

  def edit
    @shelter = @shelter_update.shelter
  end

  def create
    @shelter_update = ShelterUpdate.new(shelter_update_params)

    respond_to do |format|
      if @shelter_update.save
        format.html { redirect_to @shelter_update, notice: 'Shelter update was successfully created.' }
        format.json { render :show, status: :created, location: @shelter_update }
      else
        format.html { render :new }
        format.json { render json: @shelter_update.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @shelter_update.update(shelter_update_params)
        format.html { redirect_to @shelter_update, notice: 'Shelter update was successfully updated.' }
        format.json { render :show, status: :ok, location: @shelter_update }
      else
        format.html { render :edit }
        format.json { render json: @shelter_update.errors, status: :unprocessable_entity }
      end
    end
  end

  # Copies shelter update to shelter
  def accept
    attributes = @shelter_update.attributes.keep_if { |k,v| updateable_keys.include?(k.to_sym) && !v.nil? }

    if(@shelter_update.shelter.present?)
      result = @shelter_update.shelter.update(attributes)
      message = "Shelter updated!"
    else
      @shelter_update.create_shelter(attributes)
      @shelter_update.save
      result = @shelter_update.shelter.persisted?
      message = "Shelter created!"
    end

    if(result)
      @shelter_update.update(accepted_at: Time.now)
      redirect_to @shelter_update.shelter, notice: message
    else
      redirect_to @shelter_update, notice: "Something went wrong!"
    end
  end

  def destroy
    @shelter_update.update(rejected_at: Time.now)
    respond_to do |format|
      format.html { redirect_to shelter_updates_url, notice: 'Shelter update was successfully rejected.' }
      format.json { head :no_content }
    end
  end

  private
    def set_shelter_update
      @shelter_update = ShelterUpdate.find(params[:id])
    end

    def shelter_update_params
      params.require(:shelter_update).permit(updateable_keys.push(:shelter_id)).keep_if { |_,v| v.present? }
    end

    def updateable_keys
      @updateable_keys = [:shelter_name, :address, :city, :county, :phone, :contact_name, :url, :pets, :pet_notes, :volunteers, :volunteer_notes, :supplies, :supply_notes, :notes]
    end
end
