const express = require("express");
const router = new express.Router();
const ProductPerStore = require("../models/productPerStore");

router.post("/addProductPerStore", async (req, res) => {
  const quantity = req.body.quantity;
  const storeID = req.body.storeID;
  const productID = req.body.productID;

  try {
    if (!quantity || !storeID || !productID) {
      throw new Error("miss_data");
    }

    const productPerStore = new ProductPerStore({
      quantity,
      storeID,
      productID,
    });

    await productPerStore.save();
    res.status(200).send({ productPerStore });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all products
router.get("/productPerStore/:storeId", async (req, res) => {
  const storeID = req.params.storeId;
  const finished = req.query.finished;
  console.log(finished, 'sf');
  try {
    if (storeID === "0") {
      let products;
      if (finished == "false") {
        products = await ProductPerStore.find({
          quantity: { $gte: 1 },
        })
          .populate({path: 'productID', options: { sort: { 'CreatedAt': 1 } }})
          .populate("storeID");
        res.status(200).send({ products });
        return;
      }
      products = await ProductPerStore.find({})
        .populate({path: 'productID',options: {sort: {name: -1}}})
        .populate("storeID");
      res.status(200).send({ products });
    } else {
      let products;
      if (finished == "false") {
        products = await ProductPerStore.find({
          quantity: { $gte: 1 },
          storeID: storeID,
        })
          .populate({path: 'productID',options: {sort: {name: -1}}});
        res.status(200).send({ products });
        return;
      }

      products = await ProductPerStore.find({ storeID })
        .populate({path: 'productID', options: {sort: {name: -1}}});
      res.status(200).send({ products });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get all products near to finish
router.get("/nearToFinish/:storeId", async (req, res) => {
  const storeID = req.params.storeId;
  const finished = req.query.finished;
  console.log(finished);
  try {
    if (storeID === "0") {
      let products;
      if (finished == "false") {
        products = await ProductPerStore.find({
          quantity: { $gte: 1 , $lte: 5},
        })
          .populate('productID')
          .populate("storeID");
        res.status(200).send({ products });
        return;
      }
      products = await ProductPerStore.find({})
        .populate('productID')
        .populate("storeID");
      res.status(200).send({ products });
    } else {
      let products;
      if (finished == "false") {
        products = await ProductPerStore.find({
          quantity: { $gte: 1 , $lte: 5},
          storeID: storeID,
        })
          .populate('productID');
        res.status(200).send({ products });
        return;
      }

      products = await ProductPerStore.find({ storeID })
        .populate('productID');
      res.status(200).send({ products });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get products per store values 
router.post("/productsPerStore/:storeID", async (req, res) => {
  const storeID = req.params.storeID;
  const productsIDs = req.body.products;

  try {

    
    const productsPerStore = await ProductPerStore.find({
      storeID,
      'productID': {
        $in: productsIDs
      },
    });

    if (!productsPerStore) {
      throw new Error("no_product");
    }

    res.status(200).send({ productsPerStore });
  } catch (e) {
    if (e.message === "no_product") {
      res.status(400).send({ message: "لا يوجد منتج" });
    } else {
      res.status(400).send({ message: "حدث خطأ ما" });
    }
  }
});

module.exports = router;
