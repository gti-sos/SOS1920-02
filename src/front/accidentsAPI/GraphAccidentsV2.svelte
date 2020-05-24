<script>
    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";

</script>

<svelte:head>
   
</svelte:head>

<main>
    <h2 style="text-align: center;"> <i class="fas fa-car"></i> Número de accidentes de trafico con victimas por provincias en 2018</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

    
</main>

<style>

</style>