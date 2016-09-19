/* jshint undef: true, unused: true */
/* globals $ */
var vnllPracabar = {

	startTime: null,
	endTime: null,
	average: null,

	selectText: function() {'use strict';

		$('#select-text').change(function() {
			var selected 	= $(this).find('option:selected').val(),
				$readignBox = $('#reading-box');
			
			$readignBox.find('div').addClass('hidden');
			$readignBox.find('.'+selected).removeClass('hidden');
		});

	},

	calcAverage: function() {'use strict';

		$('#start').one('click', function() {
			window.console.warn('start');
			
			$(this).addClass('disabled');
			vnllPracabar.startTime = new Date().getTime();

		});

		$('#stop').one('click', function() {
			vnllPracabar.endTime = new Date().getTime();
			vnllPracabar.average = (vnllPracabar.endTime - vnllPracabar.startTime) / 1000;
			
			window.console.warn('stop');
			window.console.warn("duration [ms] = " + (vnllPracabar.endTime - vnllPracabar.startTime));
			
			//After user hit the stop button we no longer need to show the text area
			//This way we have a cleaner page
			$('.jumbotron').slideUp('slow');
			$('<div class="alert alert-success alert-average" role="alert"><span class="glyphicon glyphicon-time"></span> Sua velocidade média de leitura foi calculada.</div>').insertAfter($('.jumbotron'));
		});
	},

	btnCalc: function() { 'use strict';
		$('#btn-calc').on('click', function(event) {
			event.stopPropagation();
			
			var $t 			= $(this),
				averageMins = Math.round(vnllPracabar.average / 60),
				page 		= $('#inputPage').val(),
				time 		= $('#inputTime').val(),
				name 		= $('#inputName').val(),
				$message 	= $("#message");
			
			$t.addClass('disabled');
			$('.loading').removeClass('hidden');
			
			// ajustar erros do 0;
			averageMins = averageMins === 0 ? 1 : averageMins;
			

			setTimeout(function(){
				if (page === "" || time === "" || name === "") {
					$('.loading').addClass('hidden');
					$t.removeClass('disabled');
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
			}, 200);
		});
	},

	init: function() {
		"use strict";
		
		// select text according with language
		vnllPracabar.selectText();
		
		// call average
		vnllPracabar.calcAverage();
		
		// call btnCalc
		vnllPracabar.btnCalc();
	}
};


// wait until we have jQuery 
function waitjQuery(method) {"use strict"; if (window.jQuery) vnllPracabar.init(); else setTimeout(function() { waitjQuery(method); }, 50);}
// call waitjQuery
waitjQuery();
