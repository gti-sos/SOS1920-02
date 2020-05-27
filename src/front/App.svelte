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

		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
			  <ul class="navbar-nav mr-auto">
				<li class="nav-item active">
				  <a class="nav-link" href="#/">Inicio <span class="sr-only">(current)</span></a>
				</li>
				<li class="nav-item dropdown active">
				  <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					API Ana
				  </a>
				  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
					<a class="dropdown-item" href="#/evolution-of-cycling-routes/graph">Gráfica HighCharts</a>
					<a class="dropdown-item" href="#/evolution-of-cycling-routes/graph-v2">Gráfica amCharts</a>
				  </div>
				</li>
				<li class="nav-item dropdown active">
					<a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  API Jose Francisco
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdown">
					  <a class="dropdown-item" href="#/traffic-accidents/graph">Gráfica HighCharts</a>
					  <a class="dropdown-item" href="#/traffic-accidents/graph-v2">Gráfica Plotty</a>
					</div>
				  </li>
				  <li class="nav-item dropdown active">
					<a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  API Marta
					</a>
					<div class="dropdown-menu" aria-labelledby="navbarDropdown">
					  <a class="dropdown-item" href="#/rural-tourism-stats/graph">Gráfica HighCharts</a>
					  <a class="dropdown-item" href="#/rural-tourism-stats/graph-v2">Gráfica Billboards</a>
					</div>
				  </li>
				<li class="nav-item">
				  <a class="nav-link active" href="#/analytics">Analíticas</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="#/integrations">Integraciones</a>
				</li>
				<li class="nav-item">
					<a class="nav-link active" href="#/videos">Vídeos</a>
				  </li>
			  </ul>
			</div>
		  </nav>
	</body>
	<br>
	<Router {routes} />
</main>