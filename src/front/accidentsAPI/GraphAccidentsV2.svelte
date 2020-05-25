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
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://66.media.tumblr.com/067683afc39e468b30ad5da843be5b4a/tumblr_inline_pjh5t9eId61ubzx1d_1280.jpg"});
            } else if (x.year == 2018 && x.province == "cadiz") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://upload.wikimedia.org/wikipedia/commons/2/2d/La_Caleta%2C_Balneario.jpg"});
            } else if (x.year == 2018 && x.province == "cordoba") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://imagenes.20minutos.es/files/image_656_370/uploads/imagenes/2013/04/13/27485.jpg"});
            } else if (x.year == 2018 && x.province == "granada") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://cdn1.guias-viajar.com/wp-content/uploads/2018/05/granada-alhambra-patio-leones-003.jpg"});
            } else if (x.year == 2018 && x.province == "huelva") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://media-cdn.tripadvisor.com/media/photo-s/12/cd/19/41/monumento-a-colon.jpg"});
            } else if (x.year == 2018 && x.province == "jaen") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://i.blogs.es/2b1904/castillo-d-jaen/1366_2000.jpg"});
            } else if (x.year == 2018 && x.province == "malaga") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://i.pinimg.com/originals/7c/db/80/7cdb80a7003f7c4af12539d35111ae42.jpg"});
            } else if (x.year == 2018 && x.province == "sevilla") {
                MyDataGraph.push({"name": x.province, "steps": parseInt(x.trafficaccidentvictim),
                "href": "https://sevillando.net/wp-content/uploads/2019/04/catedral-y-giralda-Sevilla.jpeg"});                
            }
        });

        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.paddingRight = 40;

        chart.data = MyDataGraph.sort().reverse();

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        var series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "steps";
        series.dataFields.categoryY = "name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        var columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#36d6e5"), max: am4core.color("#1624a1") });
        series.mainContainer.mask = undefined;

        var cursor = new am4charts.XYCursor();
        chart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        var bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        var hoverState = bullet.states.create("hover");
        var outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            var circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        var image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            var circleBullet = target.parent;
            return circleBullet.circle;
        })

        var previousBullet;
        chart.cursor.events.on("cursorpositionchanged", function (event) {
            var dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                var bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    var hs = bullet.states.getKey("hover");
                    hs.properties.dx = dataItem.column.pixelWidth;
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            }
        })
    }

</script>

<svelte:head>
    <script src="https://www.amcharts.com/lib/4/core.js"></script>
    <script src="https://www.amcharts.com/lib/4/charts.js"></script>
    <script src="https://www.amcharts.com/lib/4/themes/animated.js" on:load="{loadGraph}"></script>
</svelte:head>

<main>
    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Número de accidentes de trafico con victimas por provincias en 2018</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    <div id="chartdiv"></div>
</main>

<style>
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    #chartdiv {
        width: 100%;
        height: 600px;
    }
</style>