const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE"];

// Creamos el schema del usuario
const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Al menos 3 letras para el nombre."],
      maxLength: [20, "Máximo 20 letras para el nombre."],
      trim: true,
    },
    country: {
      type: String,
      required: true,
      enum: allowedCountries,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = { Author };
