<script>
    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";
    
    async function loadGraph() {

        let MyDataA = [];
        let MyDataC = [];
        let MyDataT = [];
        let MyDataGraph = [];

        const resDataA = await fetch("/api/v2/traffic-accidents");
        MyDataA = await resDataA.json();
        const resDataC = await fetch("/api/v2/evolution-of-cycling-routes");
        MyDataC = await resDataC.json();
        const resDataT = await fetch("/api/v2/rural-tourism-stats");
        MyDataT = await resDataT.json();
        MyDataA.forEach( (x) => {
            MyDataC.forEach( (y) => {
                MyDataT.forEach( (z) => {
                    if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({
                            name: x.province + " " + x.year, data: [
                                parseInt(x.trafficaccidentvictim), parseInt(x.dead), parseInt(x.injured),
                                parseFloat(y.metropolitan), parseFloat(y.urban), parseFloat(y.rest),
                                parseFloat(z.traveller), parseFloat(z.overnightstay), parseFloat(z.averagestay)
                            ], pointPlacement: 'on'});

                    }
                })
            });
        });

        Highcharts.chart('container', {
            chart: {
                polar: true,
                type: 'line'
            },
            accessibility: {
                description: ''
            },
            title: {
                text: '',
                x: -80
            },
            pane: {
                size: '100%'
            },
            xAxis: {
                categories: ['Accidentes con víctimas',
                    'Fallecidos',
                    'Heridos',
                    'Metropolitano',
                    'Urbano',
                    'Resto',
                    'Viajero',
                    'Pernoctación',
                    'Estancia media'
                ],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },
            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical'
            },
            series: MyDataGraph,
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal'
                        },
                        pane: {
                            size: '70%'
                        }
                    }
                }]
            }
        });

    }

</script>

<svelte:head>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;">Analisis de todos los datos de los miembros de SOS1920-02</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Analisis de los datos recogidos sobre Carriles de Bici, el Turismo y Accidentes de trafico en la comunidad autonoma de Andalucia.
        </p>
    </figure>

</main>

<style>
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
        max-width: 800px;
        min-height: 800px;
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