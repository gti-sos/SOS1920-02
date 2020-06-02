<script>
	import Button from "sveltestrap/src/Button.svelte";
    import {
        pop
    } from "svelte-spa-router";
	
</script>

<main>
	<h1 class="display-4" style="text-align: center;" ></h1>
      
	<Button outline color="secondary" on:click="{pop}"><i class="fas fa-arrow-circle-left"></i></Button><br><br>
  	<div class="card-deck">
        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe width="1189" height="643" src="https://www.youtube.com/embed/iLFfYpYy3S8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        	<div class="card-body">
            	<h5 class="card-title">Carriles bici</h5>
           		<p class="card-text">Vídeo explicativo sobre los carriles bici en Andalucía.</p>
        	</div>
    	</div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
				<iframe width="900" height="506" src="https://www.youtube.com/embed/CN_IjGZJXv8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
        	<div class="card-body">
				<h5 class="card-title">Accidentes de tráfico</h5>
				<p class="card-text">Vídeo explicativo sobre los accidentes de tráfico en Andalucía.</p>
        	</div>
        </div>

        <div class="card">
            <div class="embed-responsive embed-responsive-16by9 video">
                <iframe width="1189" height="643" src="https://www.youtube.com/embed/iLFfYpYy3S8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        	<div class="card-body">
            	<h5 class="card-title">Turismo rural</h5>
            	<p class="card-text">Vídeo explicativo sobre turismo rural en Andalucía.</p>
        	</div>
        </div>
    </div>

</main>


