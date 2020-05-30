<script>
    import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let MyData = [];
    let MyDataGraph = [];
    let Data11 = [];

    async function loadGraph() {

        console.log("Loading integration API 11...");
        const res = await fetch("https://sos1920-11.herokuapp.com/api/v2/crime-rate-stats");
        if (res.ok) {
            console.log("Loaded correctly");
            const json = await res.json();
            Data11 = json;
        } else {
            console.log("ERROR!");
        }

        const resData = await fetch("/api/v2/traffic-accidents");
        MyData = await resData.json();
        MyData.forEach( (x) => {
            if (x.year == 2018) {
                    MyDataGraph.push({
                        name: x.province,
                        data: [parseInt(x.trafficaccidentvictim), parseInt(x.dead), parseInt(x.injured), 0, 0, 0, 0, 0, 0]});
                }
        });
        Data11.forEach( (y) => {
                MyDataGraph.push({
                    name: y.country,
                    data: [0, 0, 0, y.cr_rate, y.cr_saferate, y.cr_homicrate, y.cr_homicount, y.cr_theftrate, y.cr_theftcount]
                });
            });

        Highcharts.chart('container', {

            chart: {
                backgroundColor: null,
                height: 500
            },
            
            title: {
                text: 'Integración de la API SOS1920-11: Estadísticas de crimenes.'
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
                    'Crime Rate',
                    'Safe Rate',
                    'Homicide Rate',
                    'Homicide Count',
                    'Theft Rate',
                    'Theft Count'
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
            Integracion con la api de del Grupo SOS1920-11.
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