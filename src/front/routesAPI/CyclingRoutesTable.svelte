<script>
	import {onMount} from "svelte";
	import {pop} from "svelte-spa-router";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";

	let routes = [];
	let newRoute = {
		province: "",
		year: "",
		metropolitan: "",
		urban: "",
		rest: ""
	};

	onMount(getRoutes);

// GET /evolution-of-cycling-routes
	async function getRoutes() {
		console.log("Fetching routes...");
		const res = await fetch("/api/v1/evolution-of-cycling-routes/");
		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			routes = json;
			console.log("Received " + routes.length + " routes.");
		} else {
			console.log("ERROR!");
		}
	}

	


// POST /evolution-of-cycling-routes
	async function insertRoute() {
		console.log("Inserting route..." + JSON.stringify(newRoute));
		const res = await fetch("/api/v1/evolution-of-cycling-routes/", {
			method: "POST",
			body: JSON.stringify(newRoute),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
			getRoutes();
		});
	}

//	DELETE /evolution-of-cycling-routes
async function deleteRoutes() {
	console.log("Deleting all routes...");
		const res = await fetch("/api/v1/evolution-of-cycling-routes/" , {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
		});
	}

//	DELETE /evolution-of-cycling-routes/XXX/YYY
	async function deleteRoute(province, year) {
		console.log("Deleting one route...");
		const res = await fetch("/api/v1/evolution-of-cycling-routes/" + province +"/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
		});
	}

//	SEARCH /evolution-of-cycling-routes
//	OFFSET
	
</script>

<main>
	<h2>Evolucion Carriles Bici</h2>
	
	{#await routes}
		Loading routes...
	{:then routes}
		<Table bordered>
			<thead>
				<tr>
					<th>Provincia</th>
					<th>Año</th>
					<th>Metropolitano</th>
					<th>Urbano</th>
					<th>Resto</th>
					<th>Acciones</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><Input type="text" bind:value="{newRoute.province}"/></td>
					<td><Input type="number" bind:value="{newRoute.year}"/></td>
					<td><Input type="number" bind:value="{newRoute.metropolitan}"/></td>
					<td><Input type="number" bind:value="{newRoute.urban}"/></td>
					<td><Input type="number" bind:value="{newRoute.rest}"/></td>
					<td> <Button outline  color="primary" on:click={insertRoute}>Añadir</Button> </td>
				</tr>

				{#each routes as route}
					<tr>
						<a href="#/evolution-of-cycling-routes/{route.province}/{route.year}">{route.province}</a>
						<td>{route.year}</td>
						<td>{route.metropolitan}</td>
						<td>{route.urban}</td>
						<td>{route.rest}</td>
						<td> <Button outline color="danger" on:click="{deleteRoute(route.province, route.year)}"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar </Button> </td>
							
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}

<!--Añadir aqui la paginacion-->
<Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
<Button outline on:click={deleteRoutes} color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Borrar todo </Button>
</main>