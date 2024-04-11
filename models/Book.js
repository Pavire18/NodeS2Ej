const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del usuario
const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    pages: {
      type: Number,
      required: false,
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
        },
        county: {
          type: Number,
          required: true,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", userSchema);
module.exports = { Book };
