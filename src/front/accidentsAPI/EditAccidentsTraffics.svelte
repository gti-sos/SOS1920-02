<script>
    import {
        onMount
    } from "svelte";
    import {
        pop
    } from "svelte-spa-router";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    export let params = {};
    let trafficAccident = {};
    let updateProvince = "";
    let updateYear = 0;
    let updateTrafficaccidentvictim = 0;
    let updateDead = 0;
    let updateInjured = 0;
    let errorMsg = "";

    onMount(getTrafficAccident);

    async function getTrafficAccident() {
        const res = await fetch("/api/v1/traffic-accidents/"+params.accidentProcince+"/"+params.accidentYear);
        console.log("Fetching Traffic Accident...");

        if (res.ok) {
            console.log("OK: ");
            const json = await res.json();
            trafficAccident = json;
            updateProvince = trafficAccident.province;
            updateYear = trafficAccident.year;
            updateTrafficaccidentvictim = trafficAccident.trafficaccidentvictim;
            updateDead = trafficAccident.dead;
            updateInjured = trafficAccident.injured;
            console.log("Received traffic-accident.")
        } else {
            errorMsg = res.status + ": " + res.statusText;
            console.log("ERROR!" + errorMsg);
        }
    }

    async function updateTrafficAccident() {
        console.log("Updating Traffic Accident..." + JSON.stringify(params.accidentProcince));

        const res = await fetch("/api/v1/traffic-accidents"+params.accidentProcince+"/"+params.accidentYear, {
            method: "PUT",
            body: JSON.stringify({
                province: params.accidentProcince,
                year: parseInt(params.accidentYear),
                trafficaccidentvictim: updateTrafficaccidentvictim,
                dead: updateDead,
                injured: updateInjured
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getTrafficAccident();
        });
    }

</script>

<main>
    <h3>Editar datos de: <strong>{params.accidentProcince} {params.accidentYear}</strong></h3>

    {#await trafficAccident}
        Loading Traffic Accident...
    {:then trafficAccident}
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
                    <td>{updateProvince}</td>
                    <td>{updateYear}</td>
                    <td><input type="number" bind:value="{updateTrafficaccidentvictim}"></td>
                    <td><input type="number" bind:value="{updateDead}"></td>
                    <td><input type="number" bind:value="{updateInjured}"></td>
                    <td><Button outline color="primary" on:click={updateTrafficAccident}>Actualizar</Button></td>
                </tr>
            </tbody>
        </Table>
    {/await}
    {#if errorMsg}
        <p style="color: red;">ERROR: {errorMsg}</p>
    {/if}
    <Button outline color="secondary" on:click="{pop}">Volver</Button>
</main>