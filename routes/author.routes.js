const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { generateToken } = require("../utils/token");

// Modelos
const { Author } = require("../models/Author.js");
const { isAuth } = require("../middlewares/auth.middleware.js");

const upload = multer({ dest: "public" });

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Estamos en el middleware /car que comprueba parámetros");

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  if (!isNaN(page) && !isNaN(limit) && page > 0 && limit > 0) {
    req.query.page = page;
    req.query.limit = limit;
    next();
  } else {
    console.log("Parámetros no válidos:");
    console.log(JSON.stringify(req.query));
    res.status(400).json({ error: "Params page or limit are not valid" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const users = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint de creación de usuarios
router.post("/", async (req, res, next) => {
  try {
    const author = new Author({
      name: req.body.name,
      country: req.body.country,
    });

    const createdAuthor = await author.save();
    return res.status(201).json(createdAuthor);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }

    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", isAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (req.author.id !== id && req.author.email !== "admin@gmail.com") {
      return res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
    }
    const authorUpdated = await Author.findByIdAndUpdate(id, req.body, { new: true });
    if (authorUpdated) {
      res.json(authorUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
});

router.post("/image-upload", upload.single("image"), async (req, res, next) => {
  const originalname = req.file.originalname;
  const path = req.file.path;
  const newPath = path + "_" + originalname;

  fs.renameSync(path, newPath);

  const authorId = req.body.brandId;
  const author = await Author.findById(authorId);

  if (author) {
    author.image = newPath;
    await author.save();
    res.json(author);

    console.log("Author modificada correctamente!");
  } else {
    fs.unlinkSync(newPath);
    res.status(404).send("Marca no encontrada");
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const author = await Author.findOne({ email }).select("+password");
    if (!author) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    const match = await bcrypt.compare(password, author.password);
    if (match) {
      const userWithoutPass = author.toObject();
      delete userWithoutPass.password;

      const jwtToken = generateToken(author._id, author.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { authorRouter: router };
