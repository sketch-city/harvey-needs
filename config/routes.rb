Rails.application.routes.draw do
  root to: 'root#index'
  get 'harvey-needs', to: 'root#index'

  resources :shelters, only: [:index, :show]
  resources :shelter_updates do
    post :accept, on: :member
  end
end
