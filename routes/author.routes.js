const express = require("express");
const multer = require("multer");
const fs = require("fs");

// Modelos
const { Author } = require("../models/Author.js");

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

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
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

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
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

module.exports = { authorRouter: router };
