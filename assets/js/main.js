$('#select-text').change(function() {
	var selected 	= $(this).find('option:selected').val(),
		$readignBox = $('#reading-box');
	
	$readignBox.find('div').addClass('hidden');
	$readignBox.find('.'+selected).removeClass('hidden');
});

var startTime, endTime, average;

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
	$('<div class="alert alert-success alert-average" role="alert"><span class="glyphicon glyphicon-time"></span> Sua velocidade média de leitura foi calculada.</div>').insertAfter($('.jumbotron'));
});

$('#btn-calc').on('click', function(event) {
	event.stopPropagation();
	var $t = $(this);
	$t.addClass('disabled')
	$('.loading').removeClass('hidden');
	
	// ajustar erros do 0;
	var averageMins = Math.round(average / 60);
	averageMins = averageMins === 0 ? 1 : averageMins;
	
	var page = $('#inputPage').val(),
		time = $('#inputTime').val(),
		name = $('#inputName').val(),
		$message = $("#message");

	setTimeout(function(){
		if (page === "" || time === "" || name === "") {
			$('.loading').addClass('hidden');
			$t.removeClass('disabled')
			$message.html("Você precisa inserir os dados acima").addClass('alert alert-danger');
			return false;
		} else {
			var minTotal = page * averageMins,
				days = Math.round(minTotal / time),
				date = new Date();

			date.setDate(date.getDate() + days);
			var day = date.getDate(),
				month = date.getMonth() + 1,
				year = date.getFullYear();

			$('.loading').addClass('hidden');
			$message.html('Você lê em média ' + averageMins + ' páginas por minuto e a estimativa é que faltam ' + days + ' dias pracabar a leitura de ' + name + '. Isso será no dia ' + day  + "/" + month + "/" + year + ". Boa Leitura!").addClass('alert alert-success').removeClass('alert-danger');
			return false;
		}
	}, 200)
});

