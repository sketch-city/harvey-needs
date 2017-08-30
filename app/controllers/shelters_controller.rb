class SheltersController < ApplicationController
  before_action :set_shelter, only: [:show]

  def index
    @shelters = Shelter.all
  end

  def show
  end

  private
    def set_shelter
      @shelter = Shelter.find(params[:id])
    end
end
