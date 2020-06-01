<script>
	import  {
		onMount
	}
	from "svelte";
	import {
        pop
    } from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
	const url = "https://bikewise.org/api/v2/incidents";
	
	onMount(getIncidents);
    let incidents = [];
	async function getIncidents() {
		console.log("Fetching incidents...");	
		const res = await fetch(url); 
		if (res.ok) {
			console.log("Ok:");
			const json = await res.json();
			incidents = json.incidents;
			console.log(incidents)
			console.log("Received " + incidents.length + " incidents.");
		} else {
			console.log("ERROR!");
		}
	}
	async function loadGraph(){
		let MyData = [];
		const resData = await fetch("/api/v2/evolution-of-cycling-routes");
		MyData = await resData.json();
		let parsed_data = [];
		MyData.forEach( (v) => {
            if(v.year == 2015){
			let total = Math.round(v.total / 100) / 100
			let data = {
				name: v.province + " " + v.year,
				data: [total, null, null, null]
			};
            parsed_data.push(data)
        }
		});
		const resData2 = await fetch(url);
		let incidents2 = await resData2.json();
		incidents2 = incidents2.incidents;
		console.log(incidents2);
		let theft = 0;
		let hazzard = 0;
		let unconfirmed = 0;
		incidents2.forEach( (i) => {
			if (i.type == "Theft"){
				theft = theft + 1;
			}else if (i.type == "Hazard"){
				hazzard = hazzard + 1;
			}else {
				unconfirmed = unconfirmed + 1;
			};
		});
		let data = {
			name: "Robo",
			data: [null, theft, null, null]
		};
		parsed_data.push(data)
		data = {
			name: "Peligro",
			data: [null, null, hazzard, null]
		};
		parsed_data.push(data)
		data = {
			name: "Sin confirmar",
			data: [null, null, null, unconfirmed]
		};
		parsed_data.push(data)
		
		Highcharts.chart('container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Total de carril metropolitano y tipos de incidentes con bicicletas'
			},
			xAxis: {
				categories: ["Metropolitan", "Robos", "Peligros", "Sin confirmar"]
			},
			yAxis: {
				min: 0,
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold',
						color: ( // theme
							Highcharts.defaultOptions.title.style &&
							Highcharts.defaultOptions.title.style.color
						) || 'gray'
					}
				}
			},
			legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor:
					Highcharts.defaultOptions.legend.backgroundColor || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			},
			series: parsed_data
		});
	};
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>
<style>
	#container {
    height: 400px; 
}
.highcharts-figure, .highcharts-data-table table {
    min-width: 310px; 
    max-width: 800px;
    margin: 1em auto;
}
.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #EBEBEB;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}
.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
    padding: 0.5em;
}
.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
    padding: 0.5em;
}
.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
    background: #f8f8f8;
}
.highcharts-data-table tr:hover {
    background: #f1f7ff;
}
</style>


<main>

	{#await incidents}
		Loading incidents ...
	{:then incidents}
		<figure class="highcharts-figure">
			<div id="container"></div>
			<p class="highcharts-description">
				El gráfico compara el carril metropolitano en Andalucía y los incidentes con bicicletas en UK.
			</p>
		</figure>	
		<Table bordered>
			<thead>
				<tr>
                    <th>Dirección</th>
					<th>Título</th>
					<th>Tipo</th>
				</tr>
			</thead>
			<tbody>
				{#each incidents as incident}
				<tr>
                    <td>{incident.address}</td>
                    <td>{incident.title}</td>
                    <td>{incident.type}</td>
				</tr>
				{/each}
			</tbody>
		</Table>
	{/await}
	
</main>