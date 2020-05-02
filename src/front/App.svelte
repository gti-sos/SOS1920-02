<script>
import Router from 'svelte-spa-router';
import NotFound from './NotFound.svelte';
import Home from './Home.svelte';
// API ANA
	import CyclingRoutesTable from './routesAPI/CyclingRoutesTable.svelte';
	import EditCyclingRoute from './routesAPI/EditCyclingRoute.svelte';
// API MARTA
	import TourismTable from './tourismAPI/TourismTable.svelte.html';
	import EditTourism from './tourismAPI/EditTourism.svelte.html';
	


	const routes = {
		"/": Home,
		"/evolution-of-cycling-routes": CyclingRoutesTable,
		"/evolution-of-cycling-routes/:province/:year": EditCyclingRoute,
		
		"/rural-tourism-stats": TourismTable,
		"/rural-tourism-stats/:tourismProvince/:tourismYear": EditTourism,
		
		"*": NotFound
	};

</script>

<main>
	<Router {routes} />
</main>