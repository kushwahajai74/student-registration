const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const studentSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      // unique: true,
    },
    enrollment: {
      type: String,
      required: true,
      // unique: true,
    },
    branch: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//collection will have name  book
module.exports = mongoose.model("Student", studentSchema);
