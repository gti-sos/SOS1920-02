const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const tourismAPI =require(path.join(__dirname,"tourismAPI"));
const accidentsAPI = require(path.join(__dirname,"accidentsAPI"));

const port = process.env.PORT || 80;

const app = express();
app.use("/",express.static("./public"));
app.use(bodyParser.json());

tourismAPI(app);


/*--------------------------------------------------------------*/
/*----------------------------API MARTA-------------------------*/
/*--------------------------------------------------------------*/



/*--------------------------------------------------------------*/
/*----------------------------API ANA---------------------------*/
/*--------------------------------------------------------------*/



/*--------------------------------------------------------------*/
/*-----------------------API Jose Francisco---------------------*/
/*--------------------------------------------------------------*/

accidentsAPI(app);

// CODIGO COMUN
app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");