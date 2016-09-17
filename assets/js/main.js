$('#select-text').change(function() {
	var selected 	= $(this).find('option:selected').val(),
		$readignBox = $('#reading-box');
	
	$readignBox.find('div').addClass('hidden');
	$readignBox.find('.'+selected).removeClass('hidden');
});

var startTime, endTime, media;

$('#start').one('click', function() {
	$(this).addClass('disabled');
	console.log('start');
	startTime = new Date().getTime();

});

$('#stop').one('click', function() {
	console.log('stop');
	endTime = new Date().getTime();
	average = (endTime - startTime) / 1000;
	console.log("duration [ms] = " + (endTime - startTime));
	//After user hit the stop button we no longer need to show the text area
	//This way we have a cleaner page
	$('.jumbotron').slideUp('slow');
	$('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-time"></span> Sua velocidade média de leitura foi calculada.</div>').insertAfter($('.jumbotron'));
});

$('#btn-calc').on('click', function(event) {
	event.stopPropagation();
	
	// ajustar erros do 0;
	var averageMins = Math.round(average / 60);
	averageMins = averageMins === 0 ? 1 : averageMins;
	
	var page = $('#inputPage').val(),
		time = $('#inputTime').val(),
		name = $('#inputName').val(),
		$message = $("#message");

	if (page === "" || time === "" || name === "") {
		$message.html("Você precisa inserir os dados acima");
		return false;
	} else {
		var minTotal = page * averageMins,
			days = Math.round(minTotal / time),
			date = new Date();

		date.setDate(date.getDate() + days);
		var day = date.getDate(),
			month = date.getMonth() + 1,
			year = date.getFullYear();

		$message.html('Você em média ' + averageMins + ' páginas por minuto e a estimativa é que faltam ' + days + ' dias pracabar. Isso será no dia ' + day  + "/" + month + "/" + year + ". Boa Leitura!");
		return false;
	}
});

