const express = require("express");
const cors = require("cors");
const { bookRouter } = require("./routes/book.routes.js");
const { authorRouter } = require("./routes/author.routes.js");

const main = async () => {
  // Conexión a la BBDD
  const { connect } = require("./db.js");
  const database = await connect();

  // Creamos router de expres
  const PORT = 3000;
  const server = express();
  const router = express.Router();

  // Configuración del server
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  router.get("/", (req, res) => {
    res.send(`Esta es la home de nuestra API usando BBDD --> ${database.connection.name}`);
  });

  router.get("*", (req, res) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  server.use("/author", authorRouter);
  server.use("/book", bookRouter);
  server.use("/", router);

  server.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};

main();
