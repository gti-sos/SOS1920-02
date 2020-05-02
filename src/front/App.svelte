<script>
import Router from 'svelte-spa-router';
	import CyclingRoutesTable from './routesAPI/CyclingRoutesTable.svelte';
	import EditCyclingRoute from './routesAPI/EditCyclingRoute.svelte';
	import NotFound from './NotFound.svelte';
	import Home from './Home.svelte';

	const routes = {
		"/": Home,
		"/CyclingRoutesTable": CyclingRoutesTable,
		"/route/:routeProvince": EditCyclingRoute,
		"*": NotFound
	};

</script>

<main>
	<Router {routes} />
</main>