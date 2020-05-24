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
                    if (x.province == y.province && x.province == z.province && z.province == "almeria" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-al', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "cadiz" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-ca', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "cordoba" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-co', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "granada" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-gr', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "huelva" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-h', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "jaen" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-j', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "malaga" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-ma', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    } else if (x.province == y.province && x.province == z.province && z.province == "sevilla" && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({'hc-key': 'es-se', value: [
                            'Nº Accidentes con víctimas: '+parseInt(x.trafficaccidentvictim), ' Nº Fallecidos: '+parseInt(x.dead), ' Nº Heridos: '+parseInt(x.injured),
                            ' Metropolitano: '+parseFloat(y.metropolitan)+'km', ' Urbano: '+parseFloat(y.urban)+'km', ' Resto: '+parseFloat(y.rest)+'km',
                            ' Viajero: '+parseFloat(z.traveller), ' Pernoctación: '+parseFloat(z.overnightstay), ' Estancia media: '+parseFloat(z.averagestay)
                        ]});
                    }
                })
            });
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

            series: [{
                data: MyDataGraph,
                mapData: Highcharts.maps['countries/es/es-all'],
                joinBy: 'hc-key',
                allAreas: false,
                name: 'Número de víctimas',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }],

            responsive: {  
                rules: [{  
                    condition: {  
                    maxWidth: 500  
                    },  
                    chartOptions: {  
                    legend: {  
                        enabled: false  
                    }  
                    }  
                }]  
                }
        });

    }

</script>

<svelte:head>
    <script src="https://code.highcharts.com/maps/highmaps.js"></script>
    <script src="https://code.highcharts.com/maps/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/mapdata/countries/es/es-all.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;">Analisis de todos los datos de los miembros de SOS1920-02</h2>

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