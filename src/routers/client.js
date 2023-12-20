const express = require("express");
const router = new express.Router();
const Client = require("../models/clients");

// add client
router.post("/addClient", async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const address = req.body.address;
  
  try {
    if (!name || !phone || !address) {
      throw new Error("miss_data");
    }
  
    const client = new Client({ name, phone, address});

    await client.save();
    res.status(200).send({ client });
  } catch (e) {
    console.log(e.message)
    if (e.message === "miss_data") {
      res.status(400).send({ message: "there are messing data" });
    } else if (e.code === 11000) {
      res.status(400).send({ message: "this client name already exist" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});

// get all clients
router.get("/clients", async (req, res) => {
  try {
    const client = await Client.find({}).sort({'name': 1});
    res.status(200).send({ client });
  } catch (e) {
    res.status(400).send({ message: "an error has occurred" });
  }
});


// get client
router.get("/client/:id", async (req, res) => {
  const clientID = req.params.id;

  try {
    const client = await Client.findById(clientID);

    if (!client) {
      throw new Error("no_client");
    }

    res.status(200).send({ client });
  } catch (e) {
    if (e.message === "no_client") {
      res.status(400).send({ message: "no client with this ID" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// edit client
router.put("/client/:id/edit", async (req, res) => {
  const clientID = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "phone", "address"];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidUpdates) {
      throw new Error("invalid_updates");
    }

    const client = await Client.findById(clientID);

    if (!client) {
      throw new Error("no_client");
    }

    updates.forEach((update) => {
      client[update] = req.body[update];
    });

    await client.save();

    res.status(200).send({ client });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).send({ message: "this client name already exist" });
    } else if (e.message === "no_client") {
      res.status(400).send({ message: "no client with this ID" });
    } else if (e.message === "invalid_updates") {
      return res.status(400).send({ message: "Invalid updates" });
    } else {
      res.status(400).send({ message: "an error has occurred" });
    }
  }
});


// delete client
router.delete('/client/:id/delete', async (req, res) => {
  const clientID = req.params.id;

  try {
      await Client.findByIdAndDelete(clientID);
      const client = await Client.find({}).sort({'name': 1});
      res.status(200).send({client})
  } catch (e) {
      res.status(400).send({ message: "an error has occurred" });
  }
});


module.exports = router;