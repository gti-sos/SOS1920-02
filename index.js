const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const tourismAPI =require(path.join(__dirname,"tourismAPI"));
const routesAPI = require(path.join(__dirname,"routesAPI"));
const accidentsAPI = require(path.join(__dirname,"accidentsAPI"));

const port = process.env.PORT || 80;

const app = express();
app.use("/",express.static("./public"));
app.use(bodyParser.json());



/*--------------------------------------------------------------*/
/*----------------------------API MARTA-------------------------*/
/*--------------------------------------------------------------*/

tourismAPI(app);

/*--------------------------------------------------------------*/
/*----------------------------API ANA---------------------------*/
/*--------------------------------------------------------------*/

routesAPI(app);

/*--------------------------------------------------------------*/
/*-----------------------API Jose Francisco---------------------*/
/*--------------------------------------------------------------*/

accidentsAPI(app);

// CODIGO COMUN
app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");