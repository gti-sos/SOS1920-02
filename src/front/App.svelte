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

	const routes = {
		"/": Home,
		"/analytics": Analytics,
		"/integrations": Integrations,
		
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
	<body>
		
	</body>
	<Router {routes} />
</main>