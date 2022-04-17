require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const MongoDBpath = process.env.DatabasePath || "mongodb://localhost/Codex_Node_Task";

// All Controllers
const userShoppingController = require('./controller/userShopping.controller');
const userController = require('./controller/user.controller');

mongoose
  .connect(MongoDBpath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((e) => console.log("Mongoose Error:-  " + e.message));

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    exposedHeaders: "x-access-token",
  })
);
app.use("/api/preference",userShoppingController);
app.use("/api/user",userController);
app.use("/", (req,res)=>{
    res.status(200).send("Home Page!");
})

app.listen(PORT, ()=> console.log(`listing on port ${PORT}`));