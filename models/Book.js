const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allowedCountries = ["SPAIN", "ITALY", "USA", "GERMANY", "JAPAN", "FRANCE"];
// Creamos el schema del usuario
const userSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "Al menos 3 letras para el título."],
      maxLength: [20, "Máximo 20 letras para el título."],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    pages: {
      type: Number,
      required: false,
      min: [1, "Un libro tiene que tener mínimo una página."],
      max: [1000, "No están permitidos libros de más de 1000 pag."],
    },
    publisher: {
      type: {
        name: {
          type: String,
          required: true,
          minLength: [3, "Al menos 3 letras para el título."],
          maxLength: [20, "Máximo 20 letras para el título."],
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
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", userSchema);
module.exports = { Book };
