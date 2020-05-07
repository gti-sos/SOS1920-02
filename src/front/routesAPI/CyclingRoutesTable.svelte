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

	//Variables para busqueda
	let campo1 = "";
	let valor1 = "";
	let campo2 = "";
	let valor2 = "";

	let numberElementsPages = 10;
	let offset = 0;
	let pageActual = 1;
	let moreData = true; 
	let msgOk = false;

	onMount(getRoutes);
	//onMount(getProvincesYears);

	/*async function getProvincesYears() {
		const res = await fetch("/api/v2/evolution-of-cycling-routes");
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
			console.log("Counted " + provinces.length + "provinces and " + years.length + "years.");
		} else {
			console.log("ERROR!");
		}
	}*/

// GET /evolution-of-cycling-routes
	async function getRoutes() {
		console.log("Fetching routes...");
		const res = await fetch("/api/v2/evolution-of-cycling-routes?offset=" + numberElementsPages * offset + "&limit=" + numberElementsPages); 
		const resNext = await fetch("/api/v2/evolution-of-cycling-routes?offset=" + numberElementsPages * (offset + 1) 
		+ "&limit=" + numberElementsPages); 
		//const res = await fetch("/api/v2/evolution-of-cycling-routes");
		
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
		const res = await fetch("/api/v2/evolution-of-cycling-routes/", {
			method: "POST",
			body: JSON.stringify(newRoute),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
			getRoutes();
			if(res.status == 201){
				msgOk = "Recurso introducido correctamente";
			}else if(res.status == 400){ //Bad Request
				msgOk = false;
				window.alert("ERROR: Todos los campos del recurso deben tener valor");
			}else{	//ERROR 409 - Conflic
				msgOk = false;
				window.alert("ERROR: El recurso introducido ya ha sido creado");
			}
		});
	}

//	DELETE /evolution-of-cycling-routes
async function deleteRoutes() {
	console.log("Deleting all routes...");
		const res = await fetch("/api/v2/evolution-of-cycling-routes/" , {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
			if(res.status == 200){
				msgOk = "Datos borrados correctamente";
			}
		});
	}

//	DELETE /evolution-of-cycling-routes/XXX/YYY
	async function deleteRoute(province, year) {
		console.log("Deleting one route...");
		const res = await fetch("/api/v2/evolution-of-cycling-routes/" + province +"/" + year, {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
			if(res.status == 200){
				msgOk = "Dato borrado correctamente";
			}
		});
	}

// LOAD INITIAL DATA
	async function loadInitialData() {
        const res = await fetch("/api/v2/evolution-of-cycling-routes/loadInitialData", {
            method: "GET"
        }).then(function (res) {
			getRoutes();
			if(res.status == 200){
				msgOk = "Datos iniciales cargados correctamente ";
			}
        });
    }

//	SEARCH /evolution-of-cycling-routes	
	async function searchRoutes(campo1, valor1, campo2, valor2) {
		offset = 0;
		pageActual = 1; 
		moreData = false;
		console.log("Searching data: " + campo1 + ": " + valor1 + ", " + campo2 + ": " + valor2);
		var url = "/api/v2/evolution-of-cycling-routes";

		if (campo1 != "" && campo2 != "" && valor1 != "" && valor2 != "") {
			url = url + "?" + campo1 + "=" + valor1 + "&" + campo2 + "=" + valor2; 
		}else if(campo1 == "" && campo2 != "" && valor2 != ""){
			url = url + "?" + campo2 + "=" + valor2;
		}else if(campo1 != "" && campo2 == "" && valor1 != ""){
			url = url + "?" + campo1 + "=" + valor1;
		}
		console.log("la url es: " + url);
		const res = await fetch(url);

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			routes = json;			
			console.log("Found " + routes.length + " routes.");
			if(routes.length>0){
				msgOk = res.status + ": " + res.statusText + ". Búsqueda realizada con éxito";
			}else{
				msgOk = res.status + ": " + res.statusText + ". Búsqueda realizada con éxito. 0 elementos encontrados";
			}
		}else {
			msgOk = false;
			window.alert("ERROR: Compruebe que ha insertado valores correctos para la búsqueda");
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
	<h2 style="text-align: center;"> <i class="fas fa-bicycle"></i> Evolucion Carriles Bici</h2>	
	{#await routes}
		Loading cycling routes...
	{:then routes}

	<FormGroup> 
		<table style="width: 100%;">
			<thead>
				<tr>
					<th><label>Buscar por:</label></th>
					<th><label>Valor:</label></th>
					<th><label>Buscar por:</label></th>
					<th><label>Valor:</label></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>
						<Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo1}">
							<option disabled selected></option>
							<option value="province">Provincia</option>
							<option value="year">Año</option>
							<option value="metropolitan">Metropolitano</option>
							<option value="urban">Urbano</option>
							<option value="rest">Resto</option>
						</Input>
					</td>
					<td>
						<Input type="text"  name="inputValor" id="inputValor" bind:value="{valor1}"></Input>
					</td>
					<td>
						<Input type="select" name="inputCampo" id="inputCampo" bind:value="{campo2}">
							<option disabled selected></option>
							<option value="province">Provincia</option>
							<option value="year">Año</option>
							<option value="metropolitan">Metropolitano</option>
							<option value="urban">Urbano</option>
							<option value="rest">Resto</option>
						</Input>
					</td>
					<td>
						<Input type="text"  name="inputValor" id="inputValor" bind:value="{valor2}"></Input>
					</td>
				</tr>
				<tr>
					<td style="width: 25%;">
						<Button color="primary" on:click="{searchRoutes(campo1, valor1,campo2, valor2)}" class="button-search">Buscar</Button>
					</td>
				</tr>
			</tbody>
		</table>
	</FormGroup>

	
	
		<Table bordered >
			<thead>
				<tr>
					<th >Provincia</th>
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
						<td> <Button outline color="danger" on:click="{deleteRoute(route.province, route.year)}">
							<i class="fa fa-trash" aria-hidden="true"></i> </Button> </td> <!--Borrar un recurso-->
							
					</tr>
				{/each}
			</tbody>
		</Table>
		<h4>Introducir nuevo dato:</h4>
		<Table style="background-color:#EAEEF0;">
			<tr>
				<td><Input type="text" bind:value="{newRoute.province}"/></td>
				<td><Input type="number" bind:value="{newRoute.year}"/></td>
				<td><Input type="number" bind:value="{newRoute.metropolitan}"/></td>
				<td><Input type="number" bind:value="{newRoute.urban}"/></td>
				<td><Input type="number" bind:value="{newRoute.rest}"/></td>
				<td> <Button style="margin-bottom:3%;" color="primary" on:click={insertRoute}> Añadir</Button> </td>	<!-- <i class="fas fa-plus-square"></i>-->
			</tr>
		</Table>
	{/await}

<!--Mensajes acierto-->	
	{#if msgOk}
        <p style="color: green">EXITO: {msgOk}</p>
    {/if}

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
			<PaginationLink next href="#/evolution-of-cycling-routes" on:click="{() => addOffset(1)}"/>
		  </PaginationItem>  
</Pagination>

<Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> </Button> <!--Atras / volver-->
<Button outline on:click={deleteRoutes} color="danger"> <i class="fa fa-trash" aria-hidden="true"></i> Todo </Button> <!--Borrar todos recursos-->
<Button outline on:click={loadInitialData} color="primary"> <i class="fas fa-spinner"></i> Datos Iniciales </Button>
</main>