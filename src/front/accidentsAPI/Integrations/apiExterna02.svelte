<script>
    import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";

    let apiExterna = [];

    async function loadGraph() {

        let MyData = [];
        let MyDataGraph = [];

        console.log("Loading integration API external...");
        const res = await fetch("https://official-joke-api.appspot.com/jokes/random");
        if (res.ok) {
            console.log("Loaded correctly");
            const json = await res.json();
            apiExterna = json;
        } else {
            console.log("ERROR!");
        }

        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud);
        var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

        series.accuracy = 4;
        series.step = 15;
        series.rotationThreshold = 0.7;
        series.maxCount = 200;
        series.minWordLength = 2;
        series.labels.template.tooltipText = "{word}: {value}";
        series.fontFamily = "Courier New";
        series.maxFontSize = am4core.percent(30);

        series.text = apiExterna.punchline; 
    }
</script>

<svelte:head>
    <script src="https://www.amcharts.com/lib/4/core.js"></script>
    <script src="https://www.amcharts.com/lib/4/charts.js"></script>
    <script src="https://www.amcharts.com/lib/4/plugins/wordCloud.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/animated.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <Button outline color="secondary" on:click="{pop}">Volver</Button><br>

    <button type="button" class="btn btn-secondary" onclick="location.reload()" style="margin-left: 35%; width: 25%;"> Siguiente frase</button>
    <div id="chartdiv"></div>
    <p>{apiExterna.punchline}</p>
</main>

<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    #chartdiv {
        width:100%;
        height: 500px;
    }
</style>