<script>
    import {
        onMount
    } from "svelte";
    import {
        pop
    } from "svelte-spa-router";

    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    import Input from "sveltestrap/src/Input.svelte";
	import FormGroup from "sveltestrap/src/FormGroup.svelte";
    import { Pagination, PaginationItem, PaginationLink } from 'sveltestrap';

    let trafficAccidents = [];
    let newTrafficAccident = {
        province: "",
        year: 0,
        trafficaccidentvictim: 0,
        dead: 0,
        injured: 0
    };

    let numberObject = 10;
    let offset = 0;
	let currentPage = 1; 
	let moreData = true; 

    let buscar = "";
	let valores = "";

    let object = "";
    let successMsg = "";
    let success = "";
    let errorMsg = "";

    onMount(getTrafficAccidents);

    async function getTrafficAccidents() {
        const res = await fetch("/api/v2/traffic-accidents?offset=" + numberObject * offset + "&limit=" + numberObject);
        const resNext = await fetch("/api/v2/traffic-accidents?offset="  + numberObject * (offset + 1) + "&limit=" + numberObject);

        console.log("Fetching Traffic Accidents...");

        if (res.ok && resNext.ok) {
            console.log("OK: ");
            const json = await res.json();
            const jsonNext = await resNext.json();
            trafficAccidents = json;

            if (jsonNext.length == 0) {
                moreData = false;
            } else {
                moreData = true;
            }

            console.log("Received " + trafficAccidents.length + "traffic-accidents.")
        } else {
            console.log("ERROR!");
        }
    }

    async function insertTrafficAccident() {
        console.log("Inserting Traffic Accidents..." + JSON.stringify(newTrafficAccident));

        const res = await fetch("/api/v2/traffic-accidents", {
            method: "POST",
            body: JSON.stringify(newTrafficAccident),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
            getTrafficAccidents();
            object = newTrafficAccident.province;
            if (res.ok) {
                successMsg = res.status + ": " + res.statusText;
                console.log(successMsg);
                success = "El dato " + newTrafficAccident.province + " " + newTrafficAccident.year + " ha sido insertado con exito.";
            } else if (res.status == 400){
                errorMsg = res.status + ": " + res.statusText;
                window.alert("Error! Rellene todos los campos.");
                console.log(errorMsg);
            } else if (res.status == 409) {
                errorMsg = res.status + ": " + res.statusText;
                window.alert("Error! El objeto " + newTrafficAccident.province + " " + newTrafficAccident.year + " ya existe.");
                console.log(errorMsg);
            };
        });
    }
    
    async function deleteAccident(province, year) {
        console.log("Deleting Traffic Accidents...");
		const res = await fetch("/api/v2/traffic-accidents/"+province+"/"+year, {
			method: "DELETE"
		}).then(function (res) {
            getTrafficAccidents();
            if (res.ok) {
                successMsg = res.status + ": " + res.statusText;
                console.log(successMsg);
                success = "El dato " + province + " " + year + " se ha borrado correctamente."
            } else if (res.status == 404) {
                errorMsg = res.status + ": " + res.statusText;
                window.alert("Error! El dato " + province + " " + year + " no se ha podido borrar.");
                console.log(errorMsg);
            };
		});
    }
    
    async function deleteAllAccidents() {
	    console.log("Deleting All Traffic Accidents...");
		const res = await fetch("/api/v2/traffic-accidents", {
			method: "DELETE"
		}).then(function (res) {
            getTrafficAccidents();
            if (res.ok) {
                successMsg = res.status + ": " + res.statusText;
                console.log(successMsg);
                success = "Los datos se han borrado correctamente."
            };
		});
    }
    
    async function loadInitialData() {
        const res = await fetch("/api/v2/traffic-accidents/loadInitialData", {
            method: "GET"
        }).then(function (res) {
            getTrafficAccidents();
            if (res.ok) {
                successMsg = res.status + ": " + res.statusText;
                console.log(successMsg);
                success = "Los datos iniciales se han introducido correctamente."
            };
        });
    }

    async function findObject(buscar, valores) {
        console.log("Searching " + valores + " for " + buscar + " Traffic Accidents...");

        var url = "/api/v2/traffic-accidents";

        if (buscar != "" && valores != "") {
            url = url + "?" + buscar + "=" + valores;
        }

        const res = await fetch(url);

        if (res.ok) {
            console.log("OK: ");
            const json = await res.json();
            trafficAccidents = json;

            console.log("Found " + trafficAccidents.length + "traffic-accidents.")
        } else {
            window.alert("ERROR: Introduzca correctamente los valores para la busqueda.");
            console.log("ERROR!");
        }
    }

    function upOffset (numPag) {
		offset += numPag;
		currentPage += numPag;
		getTrafficAccidents();
	}

</script>

<main>

    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Accidentes de Tráfico</h2>
    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    {#if successMsg}
        <p style="color: green">{success}</p>
    {/if}

    {#await trafficAccidents}
        Loading Traffic Accidents...
    {:then trafficAccidents}

        <FormGroup>
            <table>
                <thead>
                    <tr>
                        <th><label>Buscar por:</label></th>
                        <th><label>Valor:</label></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 25%;">
                            <Input type="select" name="busqueda" id="busqueda" bind:value="{buscar}">
                                <option disabled selected></option>
                                <option value="province">Provincia</option>
                                <option value="year">Año</option>
                                <option value="trafficaccidentvictim">Accidentes con victimas</option>
                                <option value="dead">Fallecidos</option>
                                <option value="injured">Heridos</option>
                            </Input>
                        </td>
                        {#if buscar!="province"}
                            <td style="width: 25%;">
                                <Input type="text" name="valor" id="valor" bind:value="{valores}"></Input>
                            </td>
                        {:else}
                            <td style="width: 25%;">
                                <Input type="select" name="valor" id="valor" bind:value="{valores}">
                                    {#each trafficAccidents as trafficAccident}
                                        <option>{trafficAccident.province}</option>
                                    {/each}
                                </Input>
                            </td>
                        {/if}
                        <td style="width: 25%;">
                            <Button color="primary" on:click="{findObject(buscar, valores)}" class="button-search">Buscar</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </FormGroup>

        <Table bordered>
            <thead>
                <tr>
                    <th>Provincia</th>
                    <th>Año</th>
                    <th>Accidentes con victimas</th>
                    <th>Fallecidos</th>
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
            </tbody>
        </Table>
        <Button outline color="primary" on:click={loadInitialData} style="float: left;"> <i class="fas fa-spinner"></i> Inicializar</Button>
        <Button outline color="danger" on:click={deleteAllAccidents} style="float: right;"><i class="fa fa-trash" aria-hidden="true"></i> Borrar todo</Button>
    {/await}

    <Pagination ariaLabel="Cambiar de página" style="padding-left: 45%;">

        <PaginationItem class="{currentPage === 1 ? 'disabled' : ''}">
            <PaginationLink previous href="#/traffic-accidents" on:click="{() => upOffset(-1)}" />
        </PaginationItem>
        
        {#if currentPage != 1}
            <PaginationItem>
                <PaginationLink href="#/traffic-accidents" on:click="{() => upOffset(-1)}" >{currentPage - 1}</PaginationLink>
            </PaginationItem>
        {/if}
        <PaginationItem active>
            <PaginationLink href="#/traffic-accidents" >{currentPage}</PaginationLink>
        </PaginationItem>
        
        {#if moreData}
            <PaginationItem >
                <PaginationLink href="#/traffic-accidents" on:click="{() => upOffset(1)}">{currentPage + 1}</PaginationLink>
            </PaginationItem>
        {/if}
        <PaginationItem class="{moreData ? '' : 'disabled'}">
            <PaginationLink next href="#/traffic-accidents" on:click="{() => upOffset(1)}"/>
        </PaginationItem>  
    </Pagination>

</main>