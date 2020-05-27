<script>
    import {pop} from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";
</script>

<main>
    <h2 style="text-align: center;">Integracion de APIs</h2>
    <br><br>   

    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/cycling-routes'" style="margin-left: 12.5%; width: 25%;"> Evolucion Carriles Bici</button>
	<button type="button" class="btn btn-secondary" onclick="window.location.href='#/rural-tourism-stats'" style="width: 25%;">Turismo Rural</button>
	<button type="button" class="btn btn-secondary" onclick="window.location.href='#/traffic-accidents'" style= "width: 25%;">Accidentes De Tráfico </button><br><br>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

</main>