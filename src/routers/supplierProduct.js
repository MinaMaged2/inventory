const express = require("express");
const router = new express.Router();
const SupplierProduct = require("../models/supplierProducts");
const Product = require("../models/products");
const mongoose = require("mongoose");

router.post("/addSupplierProduct/:id", async (req, res) => {
  const supplierID = req.params.id;
  const products = req.body.products;

  try {
    if (!supplierID) {
      throw new Error("miss_data");
    }

    let filteredProducts = products.map((p) => ({
      productID: p.product.product_id,
      lastPrice: p.product.productCost,
    }));

    for (let product of filteredProducts) {
      let isSupplier = await SupplierProduct.findOne({
        supplierID,
        productID: product.productID,
      });

      if (isSupplier) {
        isSupplier.lastPrice = product.lastPrice;
        await isSupplier.save();
      } else {
        const supplierProduct = new SupplierProduct({
          supplierID,
          productID: product.productID,
          lastPrice: product.lastPrice,
        });
        await supplierProduct.save();
      }
    }

    res.status(200).send({ message: "Products added" });

    // if (isSupplier) {
    //   if (isSupplier.products?.length > 0) {
    //     for (let product of filteredProducts) {
    //       let isProductInList = isSupplier.products.findIndex((productList) => {
    //         return productList.productID.toString() === product.productID;
    //       });
    //       if (isProductInList >= 0) {
    //         isSupplier.products[isProductInList].lastPrice = product.lastPrice;
    //       } else {
    //         isSupplier.products.push({
    //           productID: product.productID,
    //           lastPrice: product.lastPrice,
    //         });
    //       }
    //     }
    //   }else{
    //     isSupplier.products = filteredProducts;
    //   }
    //   await isSupplier.save();
    //   res.status(200).send({ supplierProduct: isSupplier });

    // } else {
    //   const supplierProduct = new SupplierProduct({
    //     supplierID,
    //     products: filteredProducts
    //   });

    //   await supplierProduct.save();
    //   res.status(200).send({ supplierProduct });
    // }
  } catch (e) {
    console.log(e);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get products list for Suppler
router.get("/SupplierProduct/:id", async (req, res) => {
  const supplierID = req.params.id;

  try {
    let isSupplier = await SupplierProduct.find({
      supplierID,
    });

    if (!isSupplier) {
      throw new Error("no_client");
    }

    res.status(200).send({ isSupplier });
  } catch (e) {
    console.log(e);
    if (e.message === "no_client") {
      res.status(200).send({ isSupplier: { products: [] } });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get products list for Suppler
router.post("/allSupplierProduct", async (req, res) => {
  const products = req.body.products;

  try {
    let supplierProducts = [];
    for (let product of products) {
      const productData = await SupplierProduct.aggregate([
        {
          $match: {
            productID: new mongoose.Types.ObjectId(
              product.product_id.toString()
            ),
          }, // Filter by productID
        },
        {
          $sort: { lastPrice: 1 }, // Sort by productID first, then by lastPrice ascending
        },
        {
          $lookup: {
            from: "suppliers", // The collection name where supplier details are stored
            localField: "supplierID",
            foreignField: "_id",
            as: "supplierDetails",
          },
        },
        {
          $lookup: {
            from: "products", // The collection name where supplier details are stored
            localField: "productID",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$supplierDetails", // Flatten the supplierDetails array
        },
        {
          $unwind: "$productDetails", // Flatten the supplierDetails array
        },
        {
          $group: {
            _id: "$productID",
            suppliers: {
              $push: {
                lastPrice: "$lastPrice",
                supplierProductID: "$supplierProductID",
                supplierDetails: "$supplierDetails",
                productDetails: "$productDetails"
              },
            },
          },
        },
      ]);

      supplierProducts.push(productData);
    }

    res.status(200).send({
      supplierProducts: supplierProducts.flat(),
    });
  } catch (e) {
    console.log(e);
    if (e.message === "no_client") {
      res.status(200).send({ isSupplier: { products: [] } });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
