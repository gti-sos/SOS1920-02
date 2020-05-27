const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//API ANA
const routesAPIv1 = require("./src/back/routesAPI/v1");
const routesAPIv2 = require("./src/back/routesAPI/v2");
//API MARTA
const backMarta1 = require("./src/back/tourismAPI/v1");
const backMarta2 = require("./src/back/tourismAPI/v2");
//API JOSE FRANCISCO
const trafficsAPIV1 = require("./src/back/accidentsAPI/v1");
const trafficsAPIV2 = require("./src/back/accidentsAPI/v2");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

routesAPIv1(app);   //ANA
routesAPIv2(app);   //ANA
backMarta1(app);    //MARTA
backMarta2(app);    //MARTA
trafficsAPIV1(app);    //JOSE FRANCISCO
trafficsAPIV2(app);    //JOSE FRANCISCO

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");