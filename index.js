const express = require("express");
const bodyParser = require("body-parser");
//APIS
const routesAPI = require("./src/back/routesAPI");
const backMarta1 = require("./src/back/tourismAPI/v1");
const backMarta2 = require("./src/back/tourismAPI/v2");
const trafficsAPIV1 = require("./src/back/accidentsAPI/v1");
const trafficsAPIV2 = require("./src/back/accidentsAPI/v2");

var app = express();

app.use(bodyParser.json());

routesAPI(app);
backMarta1(app);
backMarta2(app);
trafficsAPIV1(app);
trafficsAPIV2(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");