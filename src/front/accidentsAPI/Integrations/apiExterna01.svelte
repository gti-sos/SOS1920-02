<script>

var request = require("request");

var options = {
  method: 'GET',
  url: 'https://the-cocktail-db.p.rapidapi.com/list.php',
  qs: {a: 'list'},
  headers: {
    'x-rapidapi-host': 'the-cocktail-db.p.rapidapi.com',
    'x-rapidapi-key': 'ec721b09edmsh144d3932be47d90p16116cjsn90ee16642900',
    useQueryString: true
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});

</script>

<main>



</main>