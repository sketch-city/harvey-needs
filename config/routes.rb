Rails.application.routes.draw do
  devise_for :users

  get 'harvey-needs', to: 'root#index', as: 'map'

  resources :users, only: [:index, :show, :update]
  resources :shelters, only: [:index, :show]
  resources :shelter_updates do
    post :accept, on: :member
  end

  root to: 'root#index'
end
