const express = require("express");
const router = new express.Router();
const database = require("../fakeDb");
const ExpressError = require("../expressError");

router.get("/", function (req, res) {
  return res.json(database);
});

router.post("/", function (req, res, next) {
  try {
    database.push(req.body);

    return res.json({ added: req.body });
  } catch (err) {
    return next(err);
  }
});

router.get("/:name", function (req, res, next) {
  try {
    for (let item of database) {
      if (req.params.name === item.name) {
        return res.json(item);
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  } catch (err) {
    return next(err);
  }
});

router.patch("/:name", function (req, res, next) {
  try {
    for (let item of database) {
      if (req.params.name === item.name) {
        if (req.body.name !== item.name) {
          item.name = req.body.name;
        }
        if (req.body.price !== item.price) {
          item.price = req.body.price;
        }
        return res.json({ updated: req.body });
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:name", function (req, res, next) {
  try {
    for (let i = 0; i < database.length; i++) {
      if (req.params.name === database[i].name) {
        database.splice(i, 1);
        return res.json({ message: "Deleted" });
      }
    }
    throw new ExpressError(`${req.params.name} is not an item.`, 400);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
