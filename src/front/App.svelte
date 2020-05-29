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
	import apiExtena01 from './routesAPI/Integrations/apiExtena01.svelte';
	import apiExtena02 from './routesAPI/Integrations/apiExtena01.svelte';

//Integraciones Jose
	import Accidents from './accidentsAPI/Integrations/Home.svelte';
	import AccidentsAPI04 from './accidentsAPI/Integrations/API04.svelte';
	import AccidentsAPI07 from './accidentsAPI/Integrations/API07.svelte';
	import AccidentsAPI08 from './accidentsAPI/Integrations/API08.svelte';
	import AccidentsAPI11 from './accidentsAPI/Integrations/API11.svelte';
	import AccidentsAPI27 from './accidentsAPI/Integrations/API27.svelte';
	import AccidentsAPI28 from './accidentsAPI/Integrations/API28.svelte';

//Integraciones Marta


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
		"/integrations/evolution-of-cycling-routes/apiExtena01": apiExtena01,
		"/integrations/evolution-of-cycling-routes/apiExtena02": apiExtena02,
		

		
// INTEGRACIONES MARTA


// INTEGRACIONES JOSE
		"/integrations/accidents": Accidents,
		"/integrations/accidents/api-04": AccidentsAPI04,
		"/integrations/accidents/api-07": AccidentsAPI07,
		"/integrations/accidents/api-08": AccidentsAPI08,
		"/integrations/accidents/api-11": AccidentsAPI11,
		"/integrations/accidents/api-27": AccidentsAPI27,
		"/integrations/accidents/api-28": AccidentsAPI28,

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