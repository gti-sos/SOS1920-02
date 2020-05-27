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
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    } else if (x.province == y.province && x.province == z.province && x.year == y.year && x.year == z.year) {
                        MyDataGraph.push({name: x.province, children: [
                            {name: "Accidentes", children: [
                                {name: "Accidentes con víctimas", value: parseInt(x.trafficaccidentvictim)},
                                {name: "Fallecidos", value: parseInt(x.dead)},
                                {name: "Heridos", value: parseInt(x.injured)}
                            ]},
                            {name: "Carril bici", children: [
                                {name: "Metropolitano", value: parseFloat(y.metropolitan)},
                                {name: "Urbano", value: parseFloat(y.urban)},
                                {name: "Resto", value: parseFloat(y.rest)}
                            ]},
                            {name: "Turismo", children: [
                                {name: "Viajero", value: parseFloat(z.traveller)},
                                {name: "Pernoctación", value: parseFloat(z.overnightstay)},
                                {name: "Estancia media", value: parseFloat(z.averagestay)}
                            ]}
                        ]});
                    }
                })
            });
        });

        am4core.useTheme(am4themes_kelly);
        am4core.useTheme(am4themes_animated);
        // Themes end

        var chart = am4core.create("chartdiv", am4plugins_forceDirected.ForceDirectedTree);
        var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

        chart.data = [{
            name: "Andalucia",
            children: MyDataGraph
        }];

        networkSeries.dataFields.value = "value";
        networkSeries.dataFields.name = "name";
        networkSeries.dataFields.children = "children";
        networkSeries.nodes.template.tooltipText = "{name}:{value}";
        networkSeries.nodes.template.fillOpacity = 1;

        networkSeries.nodes.template.label.text = "{name}"
        networkSeries.fontSize = 10;

        networkSeries.links.template.strokeWidth = 1;

        var hoverState = networkSeries.links.template.states.create("hover");
        hoverState.properties.strokeWidth = 3;
        hoverState.properties.strokeOpacity = 1;

        networkSeries.nodes.template.events.on("over", function(event) {
            event.target.dataItem.childLinks.each(function(link) {
                link.isHover = true;
            })
            if (event.target.dataItem.parentLink) {
                event.target.dataItem.parentLink.isHover = true;
            }

        })

        networkSeries.nodes.template.events.on("out", function(event) {
            event.target.dataItem.childLinks.each(function(link) {
                link.isHover = false;
            })
            if (event.target.dataItem.parentLink) {
                event.target.dataItem.parentLink.isHover = false;
            }
        })

    }

loadGraph();

</script>

<svelte:head>

</svelte:head>

<main>
    <h2 style="text-align: center;">Analisis de todos los datos de los miembros de SOS1920-02</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="chartdiv"></div>

</main>

<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    #chartdiv {
        width: 100%;
        height:550px;
        max-width:100%;
    }
</style>