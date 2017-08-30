# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170830221057) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "shelter_updates", force: :cascade do |t|
    t.string "shelter_name"
    t.string "address"
    t.string "city"
    t.string "county"
    t.string "phone"
    t.string "contact_name"
    t.string "url"
    t.float "longitude"
    t.float "latitude"
    t.boolean "pets"
    t.text "pet_notes"
    t.boolean "volunteers"
    t.text "volunteer_notes"
    t.boolean "supplies"
    t.text "supply_notes"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "shelter_id"
    t.datetime "accepted_at"
    t.datetime "rejected_at"
    t.index ["shelter_id"], name: "index_shelter_updates_on_shelter_id"
  end

  create_table "shelters", force: :cascade do |t|
    t.string "shelter_name"
    t.string "address"
    t.string "city"
    t.string "county"
    t.string "phone"
    t.string "contact_name"
    t.string "url"
    t.float "longitude"
    t.float "latitude"
    t.boolean "pets"
    t.text "pet_notes"
    t.boolean "volunteers"
    t.text "volunteer_notes"
    t.boolean "supplies"
    t.text "supply_notes"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
