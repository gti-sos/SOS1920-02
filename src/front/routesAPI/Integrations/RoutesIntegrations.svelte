<script>
    import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>

<h2><strong> Integraciones</strong></h2>

<p><a href="#/integrations/evolution-of-cycling-routes/api-04">API Grupo 04</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-05">API Grupo 05</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-06">API Grupo 06</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-07">API Grupo 07</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-08">API Grupo 08</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-09">API Grupo 09</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-12">API Grupo 12</a></p>
<p><a href="#/integrations/evolution-of-cycling-routes/api-27">API Grupo 27</a></p>

<button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/evolution-of-cycling-routes/api-04'" style="width: 25%;">API Grupo 04</button>
<p>
    <Button outline color="secondary" on:click="{pop}"> <i class="fas fa-arrow-circle-left"></i> Atrás </Button>
</p>