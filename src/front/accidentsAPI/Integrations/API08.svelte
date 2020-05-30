<script>
    import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    async function loadGraph() {

        let MyData = [];
        let MyDataGraph = [];
        let Data08 = [];

        console.log("Loading integration API 08...");
        const res = await fetch("/api/v1/motogp-statistics");
        if (res.ok) {
            console.log("Loaded correctly");
            const json = await res.json();
            Data08 = json;
        } else {
            console.log("ERROR!");
        }

        const resData = await fetch("/api/v2/traffic-accidents");
        MyData = await resData.json();
        MyData.forEach( (x) => {
            if (x.year == 2015) {
                MyDataGraph.push({name: x.province, data: [parseInt(x.trafficaccidentvictim), parseInt(x.dead), parseInt(x.injured), 0, 0, 0]});
            }
        });
        Data08.forEach( (y) => {
            MyDataGraph.push({name: y.country, data: [0, 0, 0, y.world_title, y.victory, y.podium]});
        });

        Highcharts.chart('container', {

            chart: {
                backgroundColor: null,
                height: 500
            },
            
            title: {
                text: 'Integración de la API SOS1920-08: Estadísticas Moto-GP.'
            },

            yAxis: {
                title: {
                    text: 'Comparación'
                }
            },

            xAxis: {
                categories: [
                    'Víctimas de accidentes',
                    'Fallecidos',
                    'Heridos',
                    'Titulos Mundiales',
                    'Victorias',
                    'Podiums'
                ]
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            series: MyDataGraph,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Integracion con la api de del Grupo SOS1920-08.
        </p>
    </figure>  	

</main>

<style>
    .highcharts-figure, .highcharts-data-table table {
        min-width: 95%; 
        max-width: 100%;
        min-height: 50%;
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