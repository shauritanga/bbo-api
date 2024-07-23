const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
  {
    id: { type: String },
    title: { type: String },

    name: { type: String },

    gender: { type: String },

    dob: { type: String },

    id_type: { type: String },

    identity: { type: String },

    identity_file: { type: String },

    passport_file: { type: String },

    country_id: { type: String, ref: "Country" },

    address: { type: String },

    mobile: { type: String },

    email: { type: String },

    nationality: { type: String },

    position: { type: String },

    employment_status: { type: String },

    tin: { type: String },

    employer_name: { type: String },

    current_occupation: { type: String },

    deleted_at: { type: String },

    user_id: { type: String, ref: "User" },

    tin_file: { type: String },

    signature_file: { type: String },

    updated_by: { type: String },

    approved_by: { type: String },

    created_by: { type: String },

    region: { type: String },

    district: { type: String },

    ward: { type: String },

    place_birth: { type: String },

    values: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
