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
            if (x.year == 2018 && x.province == "almeria") {
                MyDataGraph.push({'hc-key': 'es-al', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "cadiz") {
                MyDataGraph.push({'hc-key': 'es-ca', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "cordoba") {
                MyDataGraph.push({'hc-key': 'es-co', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "granada") {
                MyDataGraph.push({'hc-key': 'es-gr', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "huelva") {
                MyDataGraph.push({'hc-key': 'es-h', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "jaen") {
                MyDataGraph.push({'hc-key': 'es-j', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "malaga") {
                MyDataGraph.push({'hc-key': 'es-ma', value: parseInt(x.trafficaccidentvictim)});
            } else if (x.year == 2018 && x.province == "sevilla") {
                MyDataGraph.push({'hc-key': 'es-se', value: parseInt(x.trafficaccidentvictim)});
            }
        });

        Highcharts.mapChart('container', {

            title: {
                text: 'Víctimas de accidentes de trafico'
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            colorAxis: {
                min: 0
            },

            series: [{
                data: MyDataGraph,
                mapData: Highcharts.maps['countries/es/es-all'],
                joinBy: 'hc-key',
                allAreas: false,
                name: 'Número de víctimas',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }]
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/maps/highmaps.js"></script>
    <script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/mapdata/countries/es/es-all.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Número de accidentes de trafico con victimas por provincias en 2018</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="container"></div>
</main>

<style>
    #container {
        height: 500px; 
        min-width: 310px; 
        max-width: 800px; 
        margin: 0 auto; 
    }
    .loading {
        margin-top: 10em;
        text-align: center;
        color: gray;
    }
</style>