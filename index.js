const express = require("express");
const bodyParser = require("body-parser");
//APIS
const routesAPI = require("./src/back/routesAPI");
const backMarta = require("./src/back/tourismAPI/");

var app = express();

app.use(bodyParser.json());

routesAPI(app);
backMarta(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");