<script>
    import {
        onMount
    } from "svelte";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let trafficAccidents = [];
    let newTrafficAccident = {
        province: "",
        year: 0,
        trafficaccidentvictim: 0,
        dead: 0,
        injured: 0
    };

    onMount(getTrafficAccidents);

    async function getTrafficAccidents() {
        const res = await fetch("/api/v1/traffic-accidents");
        console.log("Fetching Traffic Accidents...");

        if (res.ok) {
            console.log("OK: ");
            const json = await res.json();
            trafficAccidents = json;
            console.log("Received " + trafficAccidents.length + "traffic-accidents.")
        } else {
            console.log("ERROR!");
        }
    }

    async function insertTrafficAccident() {
        console.log("Inserting Traffic Accidents..." + JSON.stringify(newTrafficAccident));

        const res = await fetch("/api/v1/traffic-accidents", {
            method: "POST",
            body: JSON.stringify(newTrafficAccident),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getTrafficAccidents();
        });

    }
    
    async function deleteAccident(province, year) {
        console.log("Deleting Traffic Accidents...");
		const res = await fetch("/api/v1/traffic-accidents/"+province+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
			getTrafficAccidents();
		});
    }
    
    async function deleteAllAccidents() {
	    console.log("Deleting All Traffic Accidents...");
		const res = await fetch("/api/v1/traffic-accidents", {
			method: "DELETE"
		}).then(function (res) {
			getTrafficAccidents();
		});
    }
    
    async function loadInitialData() {
        const res = await fetch("/api/v1/traffic-accidents/loadInitialData", {
            method: "GET"
        }).then(function (res) {
            getTrafficAccidents();
        });
    }

</script>

<main>

    <h2>Accidentes de Trafico</h2>

    {#await trafficAccidents}
        Loading Traffic Accidents...
    {:then trafficAccidents}
        <Table>
            <thead>
                <tr>
                    <th>Provincia</th>
                    <th>Año</th>
                    <th>Victimas de accidentes de trafico</th>
                    <th>Muertos</th>
                    <th>Heridos</th>
                    <th>Accion</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" bind:value="{newTrafficAccident.province}"></td>
                    <td><input type="number" bind:value="{newTrafficAccident.year}"></td>
                    <td><input type="number" bind:value="{newTrafficAccident.trafficaccidentvictim}"></td>
                    <td><input type="number" bind:value="{newTrafficAccident.dead}"></td>
                    <td><input type="number" bind:value="{newTrafficAccident.injured}"></td>
                    <td><Button outline color="primary" on:click={insertTrafficAccident}>Insertar</Button></td>
                </tr>
                {#each trafficAccidents as trafficAccident}
                    <tr>
                        <td><a href="#/traffic-accidents/{trafficAccident.province}/{trafficAccident.year}">{trafficAccident.province}</a></td>
                        <td>{trafficAccident.year}</td>
                        <td>{trafficAccident.trafficaccidentvictim}</td>
                        <td>{trafficAccident.dead}</td>
                        <td>{trafficAccident.injured}</td>
                        <td><Button outline color="danger" on:click="{deleteAccident(trafficAccident.province, trafficAccident.year)}"><i class="fa fa-trash" aria-hidden="true"></i> Borrar</Button></td>
                    </tr>
                {/each}
                <tr>
                    <td><Button outline color="primary" on:click={loadInitialData}>Inicializar</Button></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><Button outline color="danger" on:click={deleteAllAccidents}><i class="fa fa-trash" aria-hidden="true"></i> Borrar todo</Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    {/await}
</main>