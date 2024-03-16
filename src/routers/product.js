const express = require("express");
const router = new express.Router();
const Product = require("../models/products");

// add product
router.post("/addProduct", async (req, res) => {
  const name = req.body.name;
  const cost = Math.round((req.body.cost + Number.EPSILON) * 100) / 100;
  const price = Math.round((req.body.price + Number.EPSILON) * 100) / 100;
  
  try {
    if (!name || !cost || !price ) {
      throw new Error("miss_data");
    }
  
    const product = new Product({ name, cost, price, online: false});

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

// get all products online
router.get("/products/online", async (req, res) => {
  try {
    const products = await Product.find({
      online: true
    }).sort({'name': 1});
    res.status(200).send({ products });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get product
router.get("/product/:id", async (req, res) => {
  const productID = req.params.id;

  try {
    const product = await Product.findOne({productID});

    if (!product) {
      throw new Error("no_product");
    }

    res.status(200).send({ product });
  } catch (e) {
    if (e.message === "no_product") {
      res.status(400).send({ message: "لا يوجد منتج بهذا الكود" });
    } else {
      res.status(400).send({ message: "حدث خطأ ما" });
    }
  }
});


// edit product
router.put("/product/:id", async (req, res) => {
  const productID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "cost", "price", "online"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const product = await Product.findOne({
      productID
    });

    if (!product) {
      throw new Error("no_product");
    }

    updates.forEach((update) => {
      if(product[update] === 'cost' || product[update] === 'price'){
        product[update] = Math.round((req.body[update] + Number.EPSILON) * 100) / 100;
      }else{
        product[update] = req.body[update];
      }
      
    });

    if(req.body.cost && req.body.cost){
      product.lastEdit = new Date()
    }
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

// edit all products price
router.put("/products/price", async (req, res) => {

  const increaseAmount = req.body.increaseAmount;
  const editAt = new Date();
  try {
    const products = await Product.find({});

    for(let product of products){
      product.price = Math.round(((product.price + ((product.price * increaseAmount) / 100)) + Number.EPSILON) * 100) / 100;
      product.cost = Math.round(((product.cost + ((product.cost * increaseAmount) / 100)) + Number.EPSILON) * 100) / 100;  
      product.lastEdit = editAt;
      await product.save();
    }
    res.status(200).send({ products });
  } catch (e) {
    console.log(e)
    res.status(400).send({ message: "an error has occurred" });
  }
});


// delete product
router.delete('/product/:id', async (req, res) => {
  const productID = req.params.id;

  try {
      const product = await Product.findOneAndDelete({
        productID
      });
      // const products = await Product.find({}).sort({'name': 1});
      res.status(200).send({product})
  } catch (e) {
      res.status(400).send({ message: "an error has occurred" });
  }
});


module.exports = router;