const express = require("express");
const bodyParser = require("body-parser");

var port = process.env.PORT || 80;

var app = express();


app.use("/",express.static("./public"));
app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";

/*--------------------------------------------------------------*/
/*----------------------------API MARTA-------------------------*/
/*--------------------------------------------------------------*/

var tourism = [{
	"province": "almeria",
	"year": 2015,
	"traveller": 11260,
	"overnight-stay":37406,
	"average-stay": 3.3
},{
	"province": "cadiz",
	"year": 2015,
	"traveller": 28859,
	"overnight-stay":77652,
	"average-stay": 2.7
},{
	"province": "cordoba",
	"year": 2015,
	"traveller": 22365,
	"overnight-stay":76373,
	"average-stay": 3.4
},{
	"province": "granada",
	"year": 2015,
	"traveller": 23873,
	"overnight-stay":67636,
	"average-stay": 2.8
},{
	"province": "huelva",
	"year": 2015,
	"traveller": 40651,
	"overnight-stay":90601,
	"average-stay": 2.2
},{
	"province": "jaen",
	"year": 2015,
	"traveller": 23513,
	"overnight-stay":63311,
	"average-stay": 2
},{
	"province": "malaga",
	"year": 2015,
	"traveller": 56208,
	"overnight-stay":301760,
	"average-stay": 5.4
},{
	"province": "sevilla",
	"year": 2015,
	"traveller": 22454,
	"overnight-stay":55880,
	"average-stay": 2.5
},];

//GET /rural-tourism-stats

app.get(BASE_API_URL + "/rural-tourism-stats", (req,res)=>{
	res.send(JSON.stringify(tourism,null,2));
	//console.log("Data sent: " + JSON.stringify(tourism,null,2));
});


//GET /rural-tourism-stats/XXX

app.get(BASE_API_URL+"/rural-tourism-stats/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredTourism = tourism.filter((t) => {
		return (t.province == province);
	});
	
	
	if(filteredTourism.length >= 1){
		res.send(filteredTourism[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});


// POST /rural-tourism-stats

app.post(BASE_API_URL+"/rural-tourism-stats",(req,res) =>{
	
	var newTourism = req.body;
	
	if((newTourism == "") || (newTourism.province == null)){
		res.sendStatus(400,"BAD REQUEST");
	} else {
		tourism.push(newTourism); 	
		res.sendStatus(201,"CREATED");
	}
})




app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");