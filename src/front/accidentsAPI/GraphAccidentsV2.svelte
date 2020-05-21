<script>
    import {
        onMount
    } from "svelte";
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
            if (x.year == 2018) {
                MyDataGraph.push(parseInt(x.trafficaccidentvictim));
            }
        });

        var borderingProvinces ="AN.AM, AN.CD, AN.CO, AN.GD, AN.HL, AN.JA, AN.SV, AN.MG";

        var chart = JSC.chart('chartDiv',{
        debug: true,
        chartArea_fill:'#DBDBDB',
        type:'map',
        toolbar_visible:true,
        legend_visible:false,

        title_label_text:'',
        defaultPoint_tooltip:'%name ('+MyDataGraph+')',

        series:[
            {
            name:'Bordering US',
            color:'#578EE0',
            points:borderingProvinces.split(', ').map(function (id) {  return { map: "ES."+id };})
            }
        ]
        });
    }

</script>

<svelte:head>    
    <script src="https://code.jscharting.com/latest/jscharting.js"></script>
    <script src="https://code.jscharting.com/latest/modules/toolbar.js"></script>
    <script src="https://code.jscharting.com/latest/modules/maps.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>

    <h3>Número de accidentes de trafico por provincias en 2018</h3>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="chartDiv" style="max-width: 740px;height: 400px;margin: 0px auto"></div>

</main>