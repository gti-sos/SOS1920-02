<script>
	import {onMount} from "svelte";
	import {pop} from "svelte-spa-router";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	import Label from "sveltestrap/src/Label.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
	import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

	let routes = [];
	let newRoute = {
		province: "",
		year: "",
		metropolitan: "",
		urban: "",
		rest: ""
	};

	let provinces= [];
	let years = [];
	let provinceActual = "-";
	let yearActual = "-";

	let numberElementsPages = 10;
	let offset = 0;
	let pageActual = 1;
	let moreData = true; 

	onMount(getRoutes);
	onMount(getProvincesYears);

	async function getProvincesYears() {
		const res = await fetch("/api/v1/evolution-of-cycling-routes");
		if (res.ok) {
			const json = await res.json();
			provinces = json.map((d) => {
					return d.province;
			});
			provinces = Array.from(new Set(provinces)); 
			years = json.map((d) => {
					return d.year;
			});
			years = Array.from(new Set(years)); 
			console.log("Counted " + provinces.length + "countries and " + years.length + "years.");
		} else {
			console.log("ERROR!");
		}
	}

// GET /evolution-of-cycling-routes
	async function getRoutes() {
		console.log("Fetching routes...");
		const res = await fetch("/api/v1/evolution-of-cycling-routes?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 
		const resNext = await fetch("/api/v1/evolution-of-cycling-routes?offset=" + numberElementsPages * (offset + 1) 
		+ "&limit=" + numberElementsPages); 
		//const res = await fetch("/api/v1/evolution-of-cycling-routes");
		
		if (res.ok && resNext.ok) {
			console.log("Ok:");
			const json = await res.json();
			const jsonNext = await resNext.json();
			routes = json;
			
			if (jsonNext.length == 0) {
				moreData = false;
			} else {
				moreData = true;
			}
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
			getProvincesYears();
		});
	}

//	DELETE /evolution-of-cycling-routes/XXX/YYY
	async function deleteRoute(province, year) {
		console.log("Deleting one route...");
		const res = await fetch("/api/v1/evolution-of-cycling-routes/" + province +"/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
			getProvincesYears();
		});
	}

// LOAD INITIAL DATA
	/*async function loadInitialData() {
        const res = await fetch("/api/v1/evolution-of-cycling-routes/loadInitialData", {
            method: "GET"
        }).then(function (res) {
			getTourism();
			getCountriesYears();
        });
    }*/

//	SEARCH /evolution-of-cycling-routes
	
	async function searchRoutes(province, year) {
		console.log("Searching data: " + province + " and " + year);

		/* Checking if the fields are empty */
		var url = "/api/v1/evolution-of-cycling-routes";

		if (province != "-" && year != "-") {
			url = url + "?province=" + province + "&year=" + year; 
		} else if (province != "-" && year == "-") {
			url = url + "?province=" + province;
		} else if (province == "-" && year != "-") {
			url = url + "?year=" + year;
		}
		console.log("la url es: " + url);
		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			routes = json;
			console.log("Found " + routes.length + " routes.");
		} else {
			console.log("ERROR!");
		}
		
	}
//	OFFSET

function addOffset (increment) {
		offset += increment;
		pageActual += increment;
		getRoutes();
	}
	
</script>

<main>
	<h2>Evolucion Carriles Bici</h2>	
	{#await routes}
		Loading cycling routes...
	{:then routes}

	<FormGroup style="width:20%;"> 
		<Label for="selectProvince"> Provincia </Label>
		<Input type="select" name="selectProvince" id="selectProvince" bind:value="{provinceActual}">
			{#each provinces as province}
			<option>{province}</option>
			{/each}
			<option>-</option>
		</Input>
	</FormGroup>

	<FormGroup style="width:20%;"> 
		<Label for="selectYear"> Año </Label>
		<Input type="select"  name="selectYear" id="selectYear" bind:value="{yearActual}">
			{#each years as year}
			<option>{year}</option>
			{/each}
			<option>-</option>
		</Input>
	</FormGroup>

	<Button outline color="secondary" on:click="{searchRoutes(provinceActual, yearActual)}" class="button-search" > Buscar </Button>

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


				{#each routes as route}
					<tr>
						<a style="text-align: center;" href="#/evolution-of-cycling-routes/{route.province}/{route.year}">{route.province}</a>
						<td>{route.year}</td>
						<td>{route.metropolitan}</td>
						<td>{route.urban}</td>
						<td>{route.rest}</td>
						<td> <Button outline color="danger" on:click="{deleteRoute(route.province, route.year)}"> Borrar </Button> </td>
							
					</tr>
				{/each}
			</tbody>

			<tr>
				<td><Input type="text" bind:value="{newRoute.province}"/></td>
				<td><Input type="number" bind:value="{newRoute.year}"/></td>
				<td><Input type="number" bind:value="{newRoute.metropolitan}"/></td>
				<td><Input type="number" bind:value="{newRoute.urban}"/></td>
				<td><Input type="number" bind:value="{newRoute.rest}"/></td>
				<td> <Button outline  color="primary" on:click={insertRoute}>Añadir</Button> </td>
			</tr>
		</Table>
	{/await}

<!--Añadir aqui la paginacion-->
<Pagination style="float:right;" ariaLabel="Cambiar de página">

<PaginationItem class="{pageActual === 1 ? 'disabled' : ''}">
	<PaginationLink previous href="#/evolution-of-cycling-routes" on:click="{() => addOffset(-1)}" />
  </PaginationItem>

  {#if pageActual != 1}
		<PaginationItem>
			<PaginationLink href="#/evolution-of-cycling-routes" on:click="{() => addOffset(-1)}" >{pageActual - 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem active>
			<PaginationLink href="#/evolution-of-cycling-routes" >{pageActual}</PaginationLink>
		</PaginationItem>

		{#if moreData}
		<PaginationItem >
			<PaginationLink href="#/evolution-of-cycling-routes" on:click="{() => addOffset(1)}">{pageActual + 1}</PaginationLink>
		</PaginationItem>
		{/if}
		<PaginationItem class="{moreData ? '' : 'disabled'}">
			<PaginationLink next href="#/routesAPI" on:click="{() => addOffset(1)}"/>
		  </PaginationItem>  
</Pagination>

<Button outline color="secondary" on:click="{pop}"> Volver </Button>
<Button outline on:click={deleteRoutes} color="danger"> Borrar todo </Button>
</main>