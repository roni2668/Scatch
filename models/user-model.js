const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    minLength: 3,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
  password: String,
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  isadmin: Boolean,
  orders: {
    type: Array,
    default: []
  },
  wishlist: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product"
  }
],
  contact: Number,
  picture: String,
}, { timestamps: true }); // ✅ Add this line

module.exports = mongoose.model("user", userSchema);
