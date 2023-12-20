const express = require('express');
require('./db/mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


// load all routers
const productRouter = require('./routers/product');
const clientRouter = require('./routers/client');
const orderRouter = require('./routers/order');


// connected port
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

// use our routers
app.use(productRouter);
app.use(clientRouter);
app.use(orderRouter);

app.listen(port, ()=> {
  console.log("server is running " + port)
})