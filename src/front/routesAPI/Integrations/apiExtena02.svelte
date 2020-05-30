<script>
    import {onMount} from "svelte";
	import {pop} from "svelte-spa-router";
	import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    const url2 = "https://api.chucknorris.io/jokes/random";

    let apiExterna = [];
    //let MyData = [];
	async function loadGraph(){
        console.log("");	
		const res = await fetch(url2); 
		if (res.ok) {
			console.log("Ok, loaded successfully");
			const json = await res.json();
            apiExterna = json;
		} else {
			console.log("ERROR!");
        } 
    }
    onMount(loadGraph);

</script>

<main>
    
    <div class="container" style="background-color: rgb(46, 49, 49);padding:1% 1% 1% 1%; border-radius: 20px;box-shadow: 0px 0px 16px -2px rgba(0,0,0,0.52);">
        <div style="padding-bottom:2%;">
            
            <div class="table-responsive-xl" style="background-color:white;">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">
                                Historia real de Chuck Norris:
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {apiExterna.value}
                            </td>
                        </tr>
                    </tbody><br>
                    <button type="button" class="btn btn-secondary" onclick="location.reload()" style="margin-left: 35%; width: 25%;"> Siguiente frase</button><br><br>
                </table>
            </div>
        </div>
    </div>

</main>