<script>
    import {pop} from "svelte-spa-router";
    import Button from "sveltestrap/src/Button.svelte";
</script>

<main>
    <br><br>
    <h2 style="text-align: center;">Integración de APIs</h2>
    <br><br>
    <p style="text-align: center;">Aqui se muestran los botones que llevan a cada integracion con las APIs de los compañeros de SOS.</p>
    <br><br>       

    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-04'" style="margin-left: 20%; width: 20%;">Vehículos grupo-04</button>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-07'" style="width: 20%;">Fertilizantes grupo-07</button>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-08'" style="width: 20%;">Moto GP grupo-08</button>
    <br><br>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-11'" style="margin-left: 20%; width: 20%;">Crimenes grupo-11</button>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-27'" style="width: 20%;">Pobreza grupo-27</button>
    <button type="button" class="btn btn-secondary" onclick="window.location.href='#/integrations/accidents/api-28'" style="width: 20%;">GCE grupo-28</button>

</main>