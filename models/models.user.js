const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 6,
    max: 25,
  },
  password: {
    type: String,
    require: true,
    min: 8,
  },
  email: {
    type: String,
    require: true,
    max: 64,
  },
  coverPicture: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  jwt: {
    type: String,
  },
  OTP: {
    type: Number,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  profile: {
    type: String,
    max: 150,
    default: "",
  },
  age: { type: Number, default: 0 },
  relationship: {
    type: String,
    default: "Single",
  },
  insertedAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("Users", UserSchema);
