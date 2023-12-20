const express = require("express");
const router = new express.Router();
const Product = require("../models/products");

// add product
router.post("/addProduct", async (req, res) => {
  const name = req.body.name;
  const priceAfter = req.body.priceAfter;
  const priceBefore = req.body.priceBefore;
  const amount = req.body.amount;
  
  try {
    if (!name || !priceAfter || !priceBefore || !amount) {
      throw new Error("miss_data");
    }
  
    const product = new Product({ name, priceAfter, priceBefore, amount});

    await product.save();
    res.status(200).send({ product });
  } catch (e) {
    console.log(e.message)
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "this product name already exist" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({}).sort({'name': 1});
    res.status(200).send({ products });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get product
router.get("/product/:id", async (req, res) => {
  const productID = req.params.id;

  try {
    const product = await Product.findById(productID);

    if (!product) {
      throw new Error("no_product");
    }

    res.status(200).send({ product });
  } catch (e) {
    if (e.message === "no_product") {
      res.status(400).send({ message: "no product with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// edit product
router.put("/product/:id/edit", async (req, res) => {
  const productID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "priceBefore", "priceAfter", "amount"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const product = await Product.findById(productID);

    if (!product) {
      throw new Error("no_product");
    }

    updates.forEach((update) => {
      product[update] = req.body[update];
    });

    await product.save();

    res.status(200).send({ product });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "this product name already exist" });
    } else if (e.message === "no_product") {
      res.status(400).send({ message: "no product with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// delete product
router.delete('/product/:id/delete', async (req, res) => {
  const productID = req.params.id;

  try {
      await Product.findByIdAndDelete(productID);
      const products = await Product.find({}).sort({'name': 1});
      res.status(200).send({products})
  } catch (e) {
      res.status(400).send({ message: "an error has occurred" });
  }
});


module.exports = router;