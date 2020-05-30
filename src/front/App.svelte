<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';
	import Home from './Home.svelte';
	import Integrations from './Integrations.svelte';
	import Analytics from './Analytics.svelte';

// API ANA
	import CyclingRoutesTable from './routesAPI/CyclingRoutesTable.svelte';
	import EditCyclingRoute from './routesAPI/EditCyclingRoute.svelte';
	import GraphRoutes from './routesAPI/GraphRoutes.svelte';
	import GraphRoutesV2 from './routesAPI/GraphRoutesV2.svelte';
// API MARTA
	import TourismTable from './tourismAPI/TourismTable.svelte.html';
	import EditTourism from './tourismAPI/EditTourism.svelte.html';
	import GraphTourism  from './tourismAPI/GraphTourism.svelte.html';
	import GraphTourismV2  from './tourismAPI/GraphTourismV2.svelte.html';
// API JOSE FRANCISCO
	import AccidentsTrafficsTable from './accidentsAPI/AccidentsTrafficsTable.svelte';
	import EditAccidentsTraffics from './accidentsAPI/EditAccidentsTraffics.svelte';
	import GraphAccidents from './accidentsAPI/GraphAccidents.svelte';
	import GraphAccidentsV2 from './accidentsAPI/GraphAccidentsV2.svelte';

//Integraciones Ana
	import Routes1 from './routesAPI/Integrations/Home.svelte';
	import API_04 from './routesAPI/Integrations/04.svelte';
	import API_05 from './routesAPI/Integrations/05.svelte';
	import API_06 from './routesAPI/Integrations/06.svelte';
	import API_07 from './routesAPI/Integrations/07.svelte';
	import API_08 from './routesAPI/Integrations/08.svelte';
	import API_09 from './routesAPI/Integrations/09.svelte';
	import API_12 from './routesAPI/Integrations/12.svelte';
	import API_27 from './routesAPI/Integrations/27.svelte';
	import apiExterna01 from './routesAPI/Integrations/apiExterna01.svelte';
	import apiExterna02 from './routesAPI/Integrations/apiExterna02.svelte';

//Integraciones Jose
	import Accidents from './accidentsAPI/Integrations/Home.svelte';
	import AccidentsAPI04 from './accidentsAPI/Integrations/API04.svelte';
	import AccidentsAPI07 from './accidentsAPI/Integrations/API07.svelte';
	import AccidentsAPI08 from './accidentsAPI/Integrations/API08.svelte';
	import AccidentsAPI11 from './accidentsAPI/Integrations/API11.svelte';
	import AccidentsAPI27 from './accidentsAPI/Integrations/API27.svelte';
	import AccidentsAPI28 from './accidentsAPI/Integrations/API28.svelte';
	import apiExterna01J from './accidentsAPI/Integrations/apiExterna01.svelte';
	import apiExterna02J from './accidentsAPI/Integrations/apiExterna02.svelte';

//Integraciones Marta
	import IntegrationsTourism from './tourismAPI/Integrations/Home.svelte.html';
	import API01 from './tourismAPI/Integrations/API01.svelte.html';
	import API04 from './tourismAPI/Integrations/API04.svelte.html';
	import API05 from './tourismAPI/Integrations/API05.svelte.html';
	import API07 from './tourismAPI/Integrations/API07.svelte.html';
	import API08 from './tourismAPI/Integrations/API08.svelte.html';
	import API10 from './tourismAPI/Integrations/API10.svelte.html';
	import API12 from './tourismAPI/Integrations/API12.svelte.html';
	import API21 from './tourismAPI/Integrations/API21.svelte.html';
	import API22 from './tourismAPI/Integrations/API22.svelte.html';
	import API23 from './tourismAPI/Integrations/API23.svelte.html';
	import API30 from './tourismAPI/Integrations/API30.svelte.html';
	import APIExterna01 from './tourismAPI/Integrations/APIExterna01.svelte.html';
	import APIExterna02 from './tourismAPI/Integrations/APIExterna02.svelte.html';

	const routes = {
		"/": Home,
		"/analytics": Analytics,
		"/integrations": Integrations,

// INTEGRACIONES ANA
		"/integrations/cycling-routes": Routes1,
		"/integrations/evolution-of-cycling-routes/api-04": API_04,
		"/integrations/evolution-of-cycling-routes/api-05": API_05,
		"/integrations/evolution-of-cycling-routes/api-06": API_06,
		"/integrations/evolution-of-cycling-routes/api-07": API_07,
		"/integrations/evolution-of-cycling-routes/api-08": API_08,
		"/integrations/evolution-of-cycling-routes/api-09": API_09,
		"/integrations/evolution-of-cycling-routes/api-12": API_12,
		"/integrations/evolution-of-cycling-routes/api-27": API_27,
		"/integrations/evolution-of-cycling-routes/apiExterna01": apiExterna01,
		"/integrations/evolution-of-cycling-routes/apiExterna02": apiExterna02,	
		
// INTEGRACIONES MARTA
		"/integrations/rural-tourism-stats": IntegrationsTourism,
		"/integrations/rural-tourism-stats/API01": API01,
		"/integrations/rural-tourism-stats/API04": API04,
		"/integrations/rural-tourism-stats/API05": API05,
		"/integrations/rural-tourism-stats/API07": API07,
		"/integrations/rural-tourism-stats/API08": API08,
		"/integrations/rural-tourism-stats/API10": API10,
		"/integrations/rural-tourism-stats/API12": API12,
		"/integrations/rural-tourism-stats/API21": API21,
		"/integrations/rural-tourism-stats/API22": API22,
		"/integrations/rural-tourism-stats/API23": API23,
		"/integrations/rural-tourism-stats/API30": API30,
		"/integrations/rural-tourism-stats/APIExterna01": APIExterna01,
		"/integrations/rural-tourism-stats/APIExterna02": APIExterna02,

// INTEGRACIONES JOSE
		"/integrations/accidents": Accidents,
		"/integrations/accidents/api-04": AccidentsAPI04,
		"/integrations/accidents/api-07": AccidentsAPI07,
		"/integrations/accidents/api-08": AccidentsAPI08,
		"/integrations/accidents/api-11": AccidentsAPI11,
		"/integrations/accidents/api-27": AccidentsAPI27,
		"/integrations/accidents/api-28": AccidentsAPI28,
		"/integrations/accidents/apiExterna01": apiExterna01J,
		"/integrations/accidents/apiExterna02": apiExterna02J,

		"/evolution-of-cycling-routes": CyclingRoutesTable,
		"/evolution-of-cycling-routes/:province/:year": EditCyclingRoute,
		"/evolution-of-cycling-routes/graph": GraphRoutes,
		"/evolution-of-cycling-routes/graph-v2": GraphRoutesV2,
		
		"/rural-tourism-stats": TourismTable,
		"/rural-tourism-stats/:tourismProvince/:tourismYear": EditTourism,
		"/rural-tourism-stats/graph": GraphTourism,
		"/rural-tourism-stats/graph-v2": GraphTourismV2,

		"/traffic-accidents": AccidentsTrafficsTable,
		"/traffic-accidents/:accidentProcince/:accidentYear": EditAccidentsTraffics,
		"/traffic-accidents/graph": GraphAccidents,
		"/traffic-accidents/graph-v2": GraphAccidentsV2,

		"*": NotFound
	};

</script>

<main>
	<Router {routes} />
</main>