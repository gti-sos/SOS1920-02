<script>
	import {onMount} from "svelte";
	import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Input from "sveltestrap/src/Input.svelte";
	
	export let params = {};
	let route = {};    
	let updatedProvince = "";
	let updatedYear = 0;
	let updatedMetropolitan = 0.0;
	let updatedUrban = 0.0;
	let updatedRest = 0.0;

	let msgOk = false;
	let msgBad = false;
	
	onMount(getRoute);
	
		async function getRoute() {
			console.log("Fetching routes...");
			const res = await fetch("/api/v1/evolution-of-cycling-routes/"+ params.province + "/" + params.year);
			if (res.ok) {
				console.log("Ok:");
				const json = await res.json();
				route = json;
				updatedProvince = route.province;
				updatedYear = route.year;
				updatedMetropolitan = route.metropolitan;
				updatedUrban = route.urban;
				updatedRest = route.rest;
				console.log("Data loaded");
			} else {
				console.log("ERROR!");
			}
		}
	
		async function updateRoute(){
			console.log("Updating routes...");
			const res = await fetch("/api/v1/evolution-of-cycling-routes/" + params.province + "/" + params.year, {
				method: "PUT",
				body: JSON.stringify({
					province: params.province,
					year: parseInt(params.year),
					"metropolitan": updatedMetropolitan,
					"urban": updatedUrban,
					"rest": updatedRest
				}),
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function (res) {
				getRoute();
				if(res.status == 200){
				msgOk = "Dato actualizado correctamente";
				msgBad = false;
				}else{
				msgOk = false;
				msgBad = "Todos los campos deben tener valor";
				}
			});
		}
	
	</script>
	<main>
		<h3 style="text-align: center;">Editar Carril Bici <strong>{params.province} - {params.year}</strong></h3>
	{#await route}
		Loading routes...
	{:then route}
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
						<td>{updatedProvince}</td>
						<td>{updatedYear}</td>                    
						<td><Input type="number" bind:value="{updatedMetropolitan}"/></td>
						<td><Input type="number" bind:value="{updatedUrban}"/></td>
						<td><Input type="number" bind:value="{updatedRest}"/></td>
						<td> <Button outline color="primary" on:click={updateRoute}>Actualizar</Button> </td>
					</tr>
				</tbody>
			</Table>
		{/await}
		<!--Mensajes acierto/error-->	
	{#if msgBad}
	<p style="color: red">ERROR: {msgBad}</p>
	{/if}
	{#if msgOk}
	<p style="color: green">EXITO: {msgOk}</p>
	{/if}
		<Button outline color="secondary" on:click="{pop}"> Atrás </Button>
	</main>