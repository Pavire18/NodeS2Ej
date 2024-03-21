const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Book } = require("../models/Book.js");
const { faker } = require("@faker-js/faker");

const bookList = [
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    pages: 543,
  },
  {
    title: "1984",
    author: "George Orwell",
    pages: 328,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    pages: 281,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    pages: 180,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    pages: 279,
  },
];

// Creamos usuarios adicionales
for (let i = 0; i < 50; i++) {
  const newUser = {
    title: faker.person.firstName(),
    author: faker.person.lastName(),
    pages: faker.number.int({ min: 300, max: 600 }),
  };
  bookList.push(newUser);
}

connect().then(() => {
  console.log("Tenemos conexión");

  // Borrar datos
  Book.collection.drop().then(() => {
    console.log("Libros eliminados");

    // Añadimos usuarios
    const documents = bookList.map((book) => new Book(book));
    Book.insertMany(documents)
      .then(() => console.log("Datos guardados correctamente!"))
      .catch((error) => console.error(error))
      .finally(() => mongoose.disconnect());
  });
});
