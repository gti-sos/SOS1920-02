<script>
	import  {onMount} from "svelte";
	import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    const url = "https://sos1920-08.herokuapp.com/api/v2/electricity-produced-stats/";

    let apiExterna = [];
    let MyData = [];
	async function loadGraph(){
    console.log("Loading integration API 8...");	
	const res = await fetch(url); 
	if (res.ok) {
		console.log("Ok, loaded successfully");
		const json = await res.json();
        apiExterna = json;
	} else {
		console.log("ERROR!");
    }
        const resData = await fetch("/api/v2/evolution-of-cycling-routes");
        MyData = await resData.json();
        let items = ["Metropolitano", "Urbano", "Resto", "Hidroeléctrico", "Solar", "Carbon"];
        let valores = [];
        let valor = {};
        MyData.forEach((r) => {
            if(r.year==2015){
            valor = {
                   name: r.province,
                   data: [r.metropolitan, r.urban, r.rest, 0, 0, 0]
               }
            valores.push(valor);
            }
        });
        apiExterna.forEach( (v) => {           
               valor = {
                   name: v.state,
                   data: [0, 0, 0, v['hydro']/20000, v['solar']/20000, v['coal']/20000]
               }
               
               valores.push(valor);
            
            
        });

        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Integración API 08'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: items,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                }
            },
            tooltip: {
                split: true,
                valueSuffix: ''
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: valores
        });
	};
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> </Button>
</p>

<figure class="highcharts-figure">
    {#await  apiExterna}
    Loading renewable sources...
    {:then  apiExterna}
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p>   </p>
        <p class="highcharts-description">
           
        </p>
        

    </figure>	    

   
{/await}      	

  </figure>



<style>
	#container {
        height: 600px; 
}

.highcharts-figure, .highcharts-data-table table {
    min-width: 95%; 
        max-width: 100%;
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