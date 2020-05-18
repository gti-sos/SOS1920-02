<script>

    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";
    
    async function loadGraph() {

        let MyData = [];
        let MyDataGraph = [];

        const resData = await fetch("/api/v2/traffic-accidents");
        MyData = await resData.json();
        MyData.forEach( (x) => {
            MyDataGraph.push({name: x.province + " " + x.year, data: [parseInt(x.trafficaccidentvictim), parseInt(x.dead), parseInt(x.injured)]});
        });

        Highcharts.chart('container', {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Accidentes de Tráfico'
            },
            subtitle: {
                text: 'Estadísticas de los accidentes de tráfico 2015'
            },
            xAxis: {
                categories: [
                    'Accidentes con víctimas',
                    'Fallecidos',
                    'Heridos'
                ],
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Números'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: MyDataGraph,
            responsive: {
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
            }
        });
    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>

    <h3>Estadísticas de accidentes de tráfico</h3>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            En la gráfica podemos observar el número de: accidentes de tráfico con víctimas, fallecidos y heridos en accidentes de tráfico.
        </p>
    </figure>

</main>

<style>

    .highcharts-figure, .highcharts-data-table table {
        min-width: 95%; 
        max-width: 100%;
        margin: 1em auto;
    }

    #container {
        height: 600px;
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