<script>
    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";

    async function loadGraph() {

        let MyData = [];
        let MyDataGraphT = [];
        let MyDataGraphL = [];
        let MyDataGraphD = [];
        let MyDataGraphI = [];

        const resData = await fetch("/api/v2/traffic-accidents");
        MyData = await resData.json();
        MyData.forEach( (x) => {
            if (x.year == 2018) {
                MyDataGraphL.push(x.province);
                MyDataGraphT.push(parseInt(x.trafficaccidentvictim));
                MyDataGraphD.push(parseInt(x.dead));
                MyDataGraphI.push(parseInt(x.injured));
            }
        });

        function makeTrace(i) {
            if (i == 0) {
                return {
                    x: MyDataGraphL,
                    y: Array.apply(null, MyDataGraphT),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Victimas en accidentes',
                };
            } else if (i == 1) {
                return {
                    x: MyDataGraphL,
                    y: Array.apply(null, MyDataGraphD),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Muertos',
                };
            } else if (i == 2) {
                return {
                    x: MyDataGraphL,
                    y: Array.apply(null, MyDataGraphI),
                    line: { 
                        shape: 'spline' ,
                        color: 'red'
                    },
                    visible: i === 0,
                    name: 'Heridos',
                };
            }
            
        }

        Plotly.plot('graph', [0, 1, 2].map(makeTrace), {
            updatemenus: [{
                y: 0.8,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['line.color', 'red'],
                    label: 'red'
                }, {
                    method: 'restyle',
                    args: ['line.color', 'blue'],
                    label: 'blue'
                }, {
                    method: 'restyle',
                    args: ['line.color', 'green'],
                    label: 'green'
                }] 
            }, {
                y: 1,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['visible', [true, false, false, false]],
                    label: 'Víctimas de accidentes'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, true, false, false]],
                    label: 'Fallecidos'
                }, {
                    method: 'restyle',
                    args: ['visible', [false, false, true, false]],
                    label: 'Heridos'
                }]
            }],
        });
    }

</script>

<svelte:head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Número de accidentes de trafico con victimas por provincias en 2018</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="graph"></div>
    <p>Esta grafica tiene la peculiaridad de hacer zoom, mediante el panel superior derecho o marcando un area con el ratón, 
        para resetear el zoom solo hay que hacer clic en el icono de la casa, del panel superior.</p>
</main>

<style>

</style>