const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE"];

// Creamos el schema del usuario
const authorSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      select: false,
    },
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
    image: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = { Author };
