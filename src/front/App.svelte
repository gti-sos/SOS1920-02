<script>
import Router from 'svelte-spa-router';
	import CyclingRoutesTable from './routesAPI/CyclingRoutesTable.svelte';
	import EditCyclingRoute from './routesAPI/EditCyclingRoute.svelte';
	
	import TourismTable from './tourismAPI/TourismTable.svelte.html';
	import EditTourism from './tourismAPI/EditTourism.svelte.html';
	
	import NotFound from './NotFound.svelte';
	import Home from './Home.svelte';

	const routes = {
		"/": Home,
		"/CyclingRoutesTable": CyclingRoutesTable,
		"/route/:routeProvince": EditCyclingRoute,
		
		"/rural-tourism-stats": TourismTable,
		"/rural-tourism-stats/:tourismProvince/:tourismYear": EditTourism,
		
		"*": NotFound
	};

</script>

<main>
	<Router {routes} />
</main>