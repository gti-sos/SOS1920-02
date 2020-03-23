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


/*--------------------------------------------------------------*/
/*----------------------------API ANA---------------------------*/
/*--------------------------------------------------------------*/

var routes = [{ 
		province: "almeria",
		year: 2015,
		metropolitan: 77.6,
		urban: 53.2,
		rest: 24.3			
	},{ 
		province: "cadiz",
		year: 2015,
		metropolitan: 195.6,
		urban: 9.6,
		rest: 2.8			
	},{ 
		province: "cordoba",
		year: 2015,
		metropolitan: 10.9,
		urban: 59.5,
		rest: 6.1			
	},{ 
		province: "granada",
		year: 2015,
		metropolitan: 47.7,
		urban: 24.8,
		rest: 13.6			
	},{ 
		province: "huelva",
		year: 2015,
		metropolitan: 116,
		urban: 15.7,
		rest: 2.1			
	},{ 
		province: "jaen",
		year: 2015,
		metropolitan: 10,
		urban: 7.8,
		rest: 23.5			
	},{ 
		province: "malaga",
		year: 2015,
		metropolitan: 47.7,
		urban: 45.3,
		rest: 22.8			
	},{ 
		province: "sevilla",
		year: 2015,
		metropolitan: 146.2,
		urban: 165.7,
		rest: 3.7			
	},];

// GET /evolution-of-cycling-routes

app.get(BASE_API_URL + "/evolution-of-cycling-routes", (req,res)=>{
	res.send(JSON.stringify(routes,null,2));
	
});
	
// GET /evolution-of-cycling-routes/XXX
	
app.get(BASE_API_URL+"//evolution-of-cycling-routes/:province", (req,res)=>{
	
	var province = req.params.province;
	
	var filteredRoutes = routes.filter((t) => {
		return (t.province == province);
	});	
	
	if(filteredRoutes.length >= 1){
		res.send(filteredRoutes[0]);
	}else{
		res.sendStatus(404,"CONTACT NOT FOUND");
	}
});


// CODIGO COMUN
app.listen(port, () => {
	console.log("server ready");
});

console.log("Starting server... ");