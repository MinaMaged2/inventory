const express = require("express");
const router = new express.Router();
const Order = require("../models/orders");
const Product = require("../models/products");

// add order
router.post("/addOrder", async (req, res) => {
  const client = req.body.clientData;
  const products = req.body.products; 
  const total = req.body.total
  try {
    if (!client || !products || !total) {
      throw new Error("miss_data");
    }

    const order = new Order({ client, products, total});

    await order.save();
    res.status(200).send({ order });
  } catch (e) {
    console.log(e.message);
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).populate('products.productID');
    res.status(200).send({ orders });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});

// get order
router.get("/order/:id", async (req, res) => {
  const orderID = req.params.id;

  try {
    const order = await Order.findById(orderID);

    if (!order) {
      throw new Error("no_order");
    }

    res.status(200).send({ order });
  } catch (e) {
    if (e.message === "no_order") {
      res.status(400).send({ message: "no order with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// delete client
router.delete('/order/:id', async (req, res) => {
  const orderID = req.params.id;

  try {
      await Order.findByIdAndDelete(orderID);
      const orders = await Order.find({});
      res.status(200).send({orders})
  } catch (e) {
      res.status(400).send({ message: "an error has occurred" });
  }
});

module.exports = router;