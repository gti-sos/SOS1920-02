<script>
    import {
        pop
    } from "svelte-spa-router";

    import Button from "sveltestrap/src/Button.svelte";
</script>

<main>
    <h2 style="text-align: center;">Integracion de APIs</h2>

    <Button outline color="secondary" on:click="{pop}">Volver</Button>

</main>