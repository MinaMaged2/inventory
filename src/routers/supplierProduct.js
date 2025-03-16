const express = require("express");
const router = new express.Router();
const SupplierProduct = require("../models/supplierProducts");

router.post("/addSupplierProduct/:id", async (req, res) => {
  const supplierID = req.params.id;
  const products = req.body.products;

  try {
    if (!supplierID) {
      throw new Error("miss_data");
    }

    let isSupplier = await SupplierProduct.findOne({
      supplierID,
    });

    if (isSupplier) {
      console.log(isSupplier);

      if (isSupplier.products?.length > 0) {
        for (let product of products) {
          let isProductInList = isSupplier.products.findIndex((productList) => {
            console.log(productList.productID.toString(), product.productID);
            return productList.productID.toString() === product.productID;
          });

          console.log("is", isProductInList);

          if (isProductInList >= 0) {
            isSupplier.products[isProductInList].lastPrice = product.lastPrice;
          } else {
            isSupplier.products.push({
              productID: product.productID,
              lastPrice: product.lastPrice,
            });
          }
        }
      }
    } else {
      const supplierProduct = new SupplierProduct({
        supplierID,
        products,
      });

      await supplierProduct.save();
      res.status(200).send({ supplierProduct });
    }
  } catch (e) {
    console.log(e);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get products list for customer
// get client
router.get("/SupplierProduct/:id", async (req, res) => {
  const supplierID = req.params.id;

  try {
    let isSupplier = await CustomerProduct.findOne({
        supplierID,
    });

    if (!isSupplier) {
      throw new Error("no_client");
    }

    res.status(200).send({ isSupplier });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(200).send({ isSupplier: { products: [] } });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
