const express = require("express");
const router = new express.Router();
const ProductPerStore = require("../models/productPerStore");

router.post("/addProductPerStore", async (req, res) => {
  const quantity = req.body.quantity;
  const storeID = req.body.storeID;
  const productID = req.body.productID;

  try {
    if (
      !quantity ||
      !storeID ||
      !productID
    ) {
      throw new Error("miss_data");
    }

    const productPerStore = new ProductPerStore({
      quantity,
      storeID,
      productID
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
  console.log(finished)
  try {
    if(storeID === "0"){
      let products;
      if(finished == 'false'){
        products = await ProductPerStore.find({
          'quantity': {$gte: 1}
        }).populate('productID').populate('storeID').sort({'name': 1});
        res.status(200).send({ products });
        return
      }
      products = await ProductPerStore.find({}).populate('productID').populate('storeID').sort({'name': 1});
      res.status(200).send({ products });
    }else{
      let products;
      if(finished == 'false'){
        products = await ProductPerStore.find({
          'quantity': {$gte: 1},
          'storeID':  storeID
        }).populate('productID').sort({'name': 1});
        res.status(200).send({ products });
        return
      }
      
      products = await ProductPerStore.find({storeID}).populate('productID').sort({'name': 1});
      res.status(200).send({ products });
    }
    
  } catch (e) {
    console.log(e)
    res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;