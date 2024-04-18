const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
require("dotenv").config();
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/users", db.getUsers);
app.post("/create-user", db.createUser);
app.post("/send-email", db.sendemail);
app.post('/check-username', db.checkUsername);
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});