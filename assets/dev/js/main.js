/* jshint undef: true, unused: true */
/* globals $, addthis */
var vnllPracabar = {

	startTime: null,
	endTime: null,
	average: null,
	averageBt: null,


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
			
			$("#reading-box").css('opacity', 1);
			$(this).addClass('disabled');
			vnllPracabar.startTime = new Date().getTime();

		});

		$('#stop').one('click', function() {
			vnllPracabar.endTime = new Date().getTime();
			vnllPracabar.average = (vnllPracabar.endTime - vnllPracabar.startTime) / 1000;
			
			window.console.warn('stop');
			window.console.warn("duration [ms] = " + (vnllPracabar.endTime - vnllPracabar.startTime));
			
			closeText(true);
		});

		// or if users already knows his average
		$('.known-average').find('button').click( function() {
			vnllPracabar.averageBt = $('#inputAverage').val().match(/\d+/g);
			
			closeText();

			console.warn(vnllPracabar.averageBt);
		});

		var closeText = function(bool) {
			//After user hit the stop button we no longer need to show the text area
			//This way we have a cleaner page
			$('.jumbotron').slideUp('slow');

			var word = (bool === true) ? "calculada" : "salva"; 
			
			$('<div class="alert alert-success alert-average" role="alert"><span class="glyphicon glyphicon-time"></span> Sua velocidade média de leitura foi '+word+'.</div>').insertAfter($('.jumbotron'));
		};
	},

	btnCalc: function() { 'use strict';
		$('#btn-calc:not(".disabled")').on('click', function(event) {
			event.stopPropagation();
			event.preventDefault();
			
			var $t 			= $(this),
				page 		= $('#inputPage').val(),
				time 		= $('#inputTime').val(),
				name 		= $('#inputName').val(),
				$message 	= $("#message"),
				averageMins = null,
				minTotal 	= null;
			
			$t.addClass('disabled');
			$('.loading').removeClass('hidden');
		

			setTimeout(function(){
				if (page === "" || time === "" || name === "") {
					$('.loading').addClass('hidden');
					$t.removeClass('disabled');
					return false;
				} else {
					if ( vnllPracabar.average !== null) {
						averageMins = Math.round(vnllPracabar.average / 60 / 6); // since we have 1200 caract. and a normal page have 200.
						// if the user read it too fast;
						averageMins = averageMins === 0 ? 1 : averageMins;
						
						minTotal = page * averageMins;

					} else {
						averageMins = vnllPracabar.averageBt;
						minTotal = page / averageMins;
					}

					var days = Math.round(minTotal / time),
						date = new Date();
						date.setDate(date.getDate() + days);

					var day = date.getDate(),
						month = date.getMonth() + 1,
						year = date.getFullYear();
					
					vnllPracabar.share(name, days);

					$('.loading').addClass('hidden');
					$('.addthis_inline_share_toolbox').removeClass('hidden');

					var pagina = averageMins == 1 ? 'página' : 'páginas';
					
					$message.html('Você lê em média ' + averageMins + ' ' + pagina + ' por minuto e a estimativa é que faltam ' + days + ' dias pracabar a leitura de ' + name + '. Isso será no dia ' + day  + "/" + month + "/" + year + ". Boa Leitura!").addClass('alert alert-success').removeClass('alert-danger');

					return false;
				}
			}, 200);
		});
	},

	share: function(name, days) {
		"use strict";
		
		if ( typeof addthis_share !== 'undefined' && typeof addthis !== 'undefined') {
			addthis_share = {
				email_template: "Pracabar",
				email_vars: { book: name, days: days },

				passthrough : {
					twitter: {
						text: "Estou lendo " +name+ " e faltam " + days + " dias Pracabar. Calcule sua média de leitura e dias pracabar de ler em "
					}
				}
			};

			addthis.update('share', 'url', "http://pracabar.co");
			addthis.update('share', 'title', "Pracabar - quanto tempo você leva para ler um livro");
			addthis.update('share', 'description', "Estou lendo " +name+ " e faltam " + days + " dias Pracabar. Calcule sua média de leitura e dias pracabar de ler em http://pracabar.co");
			}

		
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
