const express = require("express");
const cors = require("cors");
const http = require("http");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();
global.__basedir = __dirname;
const port = process.env.PORT || 3010;

const app = express();

// Passport Config
require("./db/config/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

// Models
var models = require("./db/models");

require("./routes")(app); // For API

app.set("port", port);
const server = http.createServer(app);
server.listen(port, () =>
  console.log(`Server is running at port no : ${port}`)
);

module.exports = app;
