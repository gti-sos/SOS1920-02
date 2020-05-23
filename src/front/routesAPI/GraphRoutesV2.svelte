<script>
    import {
        onMount
    } from "svelte";
    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";

    function loadData() {
        return "Ana";
    }

    async function loadGraph() {

        let MyData = [];
        let MyDataGraph = [];

        const resData = await fetch("/api/v2/evolution-of-cycling-routes");
        MyData = await resData.json();
        MyData.forEach( (x) => {
            if (x.year == 2015) {
                MyDataGraph.push(parseFloat(x.metropolitan));
            }
        });

        am4core.ready(function() {

            // Themes begin
            am4core.useTheme(am4themes_dataviz);
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.PieChart);

            // Add data
            chart.data = [ {
            "country": "Lithuania",
            "litres": 501.9
            }, {
            "country": "Czech Republic",
            "litres": 301.9
            }, {
            "country": "Ireland",
            "litres": 201.1
            }, {
            "country": "Germany",
            "litres": 165.8
            }, {
            "country": "Australia",
            "litres": 139.9
            }, {
            "country": "Austria",
            "litres": 128.3
            }, {
            "country": "UK",
            "litres": 99
            }, {
            "country": "Belgium",
            "litres": 60
            }, {
            "country": "The Netherlands",
            "litres": 50
            } ];

            // Set inner radius
            chart.innerRadius = am4core.percent(50);

            // Add and configure Series
            var pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "litres";
            pieSeries.dataFields.category = "country";
            pieSeries.slices.template.stroke = am4core.color("#fff");
            pieSeries.slices.template.strokeWidth = 2;
            pieSeries.slices.template.strokeOpacity = 1;

            // This creates initial animation
            pieSeries.hiddenState.properties.opacity = 1;
            pieSeries.hiddenState.properties.endAngle = -90;
            pieSeries.hiddenState.properties.startAngle = -90;

            });
    }

</script>

<svelte:head>    
    <script src="https://www.amcharts.com/lib/4/core.js"></script>
    <script src="https://www.amcharts.com/lib/4/charts.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/dataviz.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/animated.js" on:load="{loadGraph}"></script>
</svelte:head>

<style>
    #chartdiv {
      width: 100%;
      height: 500px;
    }
    
</style>

<main>

    <h3>Número de accidentes de trafico por provincias en 2018</h3>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="chartdiv"></div>

</main>