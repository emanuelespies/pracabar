/* jshint undef: true, unused: true */
/* globals $ */
var vnllPracabar = {

	startTime: null,
	endTime: null,
	average: null,


	textOptions: function() {'use strict';
		var $actions 	= $('.actions'),
			$text 		= $('#reading-box');

		// we need to control de open/close of dropdown
		$actions.find('#dropdownOptions').click(function() {
			$(this).parent().toggleClass('open');
		});

		$('body').on('click', function (e) {
			var $dropdown = $('.dropdown');

			if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
				$dropdown.removeClass('open');
			}
		});

		$actions.find('.font-size a').click(function() {
			var $t 			= $(this),
				$content 	= $text.find('p'),
				curSize 	= parseInt($content.css('font-size'));

			if ( $t.index() === 2 ) {
				curSize = curSize + 2;

				if (curSize <= 26) {
					$content.css('font-size', curSize);
				}                
			} else {
				curSize = curSize - 2;

				if (curSize >= 10)  {       
					$content.css('font-size', curSize);        
				}
			}

			
		});   
		
		$actions.find('.font-change a').click(function() {           
			var $t 			= $(this),
				curFont 	= $t.text();

			$actions.find('.font-change a').removeClass('selected');
			$t.addClass('selected');

			$text.css('font-family', curFont);               
		});  

		$actions.find('.margin-size a').click(function() {
			var $t 			= $(this),
				curMargin 	= $t.text();

			$actions.find('.margin-size a').removeClass('selected');
			$t.addClass('selected');

			switch(curMargin) {
				case 'Estreito':
				$text.css('padding', '5px');
			  break;
			 
			case 'Normal':
				$text.css('padding', '15px');
			  break;
			  
			case 'Largo':
				$text.css('padding', '25px');
			  break;
			}
		}); 

	},

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
		
		// options
		vnllPracabar.textOptions();

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
