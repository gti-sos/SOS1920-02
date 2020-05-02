const express = require("express");
const bodyParser = require("body-parser");
//APIS
const routesAPI = require("./src/back/routesAPI");

var app = express();

app.use(bodyParser.json());

routesAPI(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");