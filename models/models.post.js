const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  UserID: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: "",
  },
  likes: {
    //   Count : total length of LIKES[]
    type: Array,
    default: [],
  },
  status: {
    //   Status : [ Not Verified , Verified , Declined , Deleted , Archived ]
    type: String,
    default: "Not Verified",
  },
  comments: {
    //   Count : total length of COMMENTS[]
    type: Array,
    default: [],
  },
  caption: {
    require: true,
    type: String,
    max: 150,
  },
  payments: { type: Array, default: [] },
  insertedAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("Posts", PostSchema);
