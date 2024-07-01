const express = require("express");
const router = new express.Router();
const CustomerProduct = require("../models/customerProducts");

router.post("/addCustomerProduct/:id", async (req, res) => {
  const customerID = req.params.id;
  const products = req.body.products;

  try {
    if (!customerID) {
      throw new Error("miss_data");
    }

    let isCustomer = await CustomerProduct.findOne({
      customerID
    });

    if (isCustomer) {
      console.log(isCustomer)

      if(isCustomer.products?.length > 0){
        for (let product of products) {
          let isProductInList = isCustomer.products.findIndex((productList) => {
            console.log(productList.productID.toString() , product.productID)
            return productList.productID.toString() === product.productID
          });
          console.log('is',isProductInList)
          if (isProductInList >= 0) {
            isCustomer.products[isProductInList].lastPrice = product.lastPrice;
          } else {
            isCustomer.products.push({
              productID: product.productID,
              lastPrice: product.lastPrice,
            });
          }
        };
        
      }else{
        isCustomer.products = products;
      }

      await isCustomer.save();
      res.status(200).send({ customerProduct: isCustomer });
    } else {
      const customerProduct = new CustomerProduct({
        customerID,
        products,
      });

      await customerProduct.save();
      res.status(200).send({ customerProduct });
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
router.get("/CustomerProduct/:id", async (req, res) => {
  const customerID = req.params.id;

  try {
    let isCustomer = await CustomerProduct.findOne({
      customerID
    });

    if (!isCustomer) {
      throw new Error("no_client");
    }

    res.status(200).send({ isCustomer });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(200).send({ isCustomer: {products: []} });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

module.exports = router;
