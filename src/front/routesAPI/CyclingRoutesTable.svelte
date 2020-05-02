<script>
	import {
		onMount
	} from "svelte";

	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";

	let routes = [];
	let newRoute = {
		province: "",
		year: "",
		metropolitan: "",
		urban: "",
		rest: ""
	};

	onMount(getRoutes);

// GET /routes

	async function getRoutes() {
		console.log("Fetching routes...");
		const res = await fetch("/api/v1/routes");

		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			routes = json;
			console.log("Received " + routes.length + " routes.");
		} else {
			console.log("ERROR!");
		}
	}

// POST /route

	async function insertRoute() {
	//La funcion es asincrona parapoder hacer el "await"	
		console.log("Inserting route..." + JSON.stringify(newRoute));

		const res = await fetch("/api/v1/routes", {
			method: "POST",
			body: JSON.stringify(newRoute),
			headers: {
				"Content-Type": "application/json"
			}
		}).then(function (res) {
			getRoutes();
		});
	}
	// DELETE /route	

	async function deleteRoute(province) {
		const res = await fetch("/api/v1/routes/" + province, {
			method: "DELETE"
		}).then(function (res) {
			getRoutes();
		});
	}
</script>

<main>

	{#await routes}
		Loading routes...
	{:then routes}
		<Table bordered>
			<thead>
				<tr>
					<th>Province</th>
					<th>Year</th>
					<th>Metropolitan</th>
					<th>Urban</th>
					<th>Rest</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><input bind:value="{newRoute.province}"></td>
					<td><input bind:value="{newRoute.year}"></td>
					<td><input bind:value="{newRoute.metropolitan}"></td>
					<td><input bind:value="{newRoute.urban}"></td>
					<td><input bind:value="{newRoute.rest}"></td>
					<td> <Button outline  color="primary" on:click={insertRoute}>Insert</Button> </td>
				</tr>

				{#each routes as route}
					<tr>
						<a href="#/route/{route.province}">{route.province}</a>
						<td>{route.year}</td>
						<td>{route.metropolitan}</td>
						<td>{route.urban}</td>
						<td>{route.rest}</td>
						<td><Button outline color="danger" on:click="{deleteRoute(route.province)}"
							>Delete</Button></td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/await}


</main>