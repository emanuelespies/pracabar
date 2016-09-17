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
	media = (endTime - startTime) / 1000;
	console.log("duration [ms] = " + (endTime - startTime));
	//After user hit the stop button we no longer need to show the text area
	//This way we have a cleaner page
	$('.jumbotron').slideUp('slow');
});

$('#btn-calc').on('click', function(event) {
	event.stopPropagation();
	
	// ajustar erros do 0;
	var mediaMins = Math.round(media / 60);
	mediaMins = mediaMins === 0 ? 1 : mediaMins;
	
	var pag = $('#paginas').val();
	var tempo = $('#tempo').val();
	var $mensagem = $("#mensagem");

	if (pag === "" || tempo === "") {
		$mensagem.html("Você precisa inserir os dados acima");
		return false;
	} else {
		var minTotal = pag * mediaMins;
		var dias = Math.round(minTotal / tempo);
		var data = new Date();

		data.setDate(data.getDate() + dias);
		var dia = data.getDate()
		var month = data.getMonth() + 1;
		var ano = data.getFullYear();

		$mensagem.html('Você tem média de ' + mediaMins + ' páginas por minuto e a estimativa é que faltam ' + dias + ' dias pracabar. Isso será no dia ' + dia  + "/" + month + "/" + ano + ". Boa Leitura!");
		return false;
	}
});

