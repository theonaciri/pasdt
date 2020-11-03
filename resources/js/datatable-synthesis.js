define(['datatables.net', 'datatables.net-bs4', './graphs-chartjs', /*'pdfmake', 'pdfmake/build/vfs_fonts.js',*/
		'flat', './components/datatable-fr', './components/color-event-assoc', 'moment/moment', './components/getURLParameter',
		'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5',/*'Buttons/js/buttons.print', 
		'Buttons/js/buttons.flash', */'./widgets/dateinterval.plugin.js', 'datatables.net-responsive', 'datatables.net-fixedheader-bs4', 'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js',],
	function(datatables, datatables_bs, Graphs, /*pdfmake, pdfFonts, */flatten, datatablefr, arrayToSearch, moment, getURLParameter) {
		var table;
		var $logsDateSync = $('#synth-date-sync');
		window.synthtable = table;
		var firstinit = true;
		String.prototype.capFirstLetter = function () {
			return /[a-z]/.test(this.trim()[0]) ? this.trim()[0]
			.toUpperCase() + this.slice(1) : this;
		}

		/*
		var cal_interval = flatpickr('#dateinterval_logtable', {
			mode: "range",
			altInput: true,
			altFormat: "j F Y",
			dateFormat: "d/m/Y",
			maxDate: "today",
			onChange: function() {
			table.ajax.reload( null, false );
		});

		$('.clear-cal').on('click', function(e) {
			cal_interval.clear();
		});*/

	function getData(data, callback, settings) {
		if (presynths != null && typeof presynths === "object" && firstinit) {
			callback({data:presynths});
			firstinit = false;
		} else {
			var c = getURLParameter('company');
			if (c) {
				data.company = c;
			}
			$.ajax({
		      "url": "/logs/synth",
		      "data": data,
		      "timeout": 10000,
		    }).done(function(data, a, e) {
		    	var _date = e.getResponseHeader('date');
		    	$logsDateSync.html(moment(_date.slice(_date.lastIndexOf(',') + 1)).calendar());
		      	callback({data:data});
      			var event = new CustomEvent("online", { detail: {request: "synth", data: data }});
				document.dispatchEvent(event);
		    }).fail(function(data) {
		      	$('#synthesis-table_processing').hide("fast");
      			var event = new CustomEvent("offline", { detail: {request: "synth", data: data }});
				document.dispatchEvent(event);
		    });
		}
	}
	function _initTable() {
		moment.locale('fr', {
			months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
			monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
			monthsParseExact : true,
			weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
			weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
			weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
			weekdaysParseExact : true,
			longDateFormat : {
				LT : 'HH:mm',
				LTS : 'HH:mm:ss',
				L : 'DD/MM/YYYY',
				LL : 'D MMMM YYYY',
				LLL : 'D MMMM YYYY HH:mm',
				LLLL : 'dddd D MMMM YYYY HH:mm'
			},
			calendar : {
				sameDay : '[Aujourd’hui à] LT',
				nextDay : '[Demain à] LT',
				nextWeek : 'dddd [à] LT',
				lastDay : '[Hier à] LT',
				lastWeek : 'dddd [dernier à] LT',
				sameElse : 'L'
			},
			relativeTime : {
				future : 'dans %s',
				past : 'il y a %s',
				s : 'quelques secondes',
				m : 'une minute',
				mm : '%d minutes',
				h : 'une heure',
				hh : '%d heures',
				d : 'un jour',
				dd : '%d jours',
				M : 'un mois',
				MM : '%d mois',
				y : 'un an',
				yy : '%d ans'
			},
			dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
			ordinal : function (number) {
				return number + (number === 1 ? 'er' : 'e');
			},
			meridiemParse : /PD|MD/,
			isPM : function (input) {
				return input.charAt(0) === 'M';
			},
	// In case the meridiem units are not separated around 12, then implement
	// this function (look at locale/id.js for an example).
	// meridiemHour : function (hour, meridiem) {
	//     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
	// },
	meridiem : function (hours, minutes, isLower) {
		return hours < 12 ? 'PD' : 'MD';
	},
	week : {
		dow : 1, // Monday is the first day of the week.
		doy : 4  // Used to determine first week of the year.
	}
	});
	var now = moment();
	/*
		if (!$('#synthesis-table').is(':visible')) {
		$('#synth-tab').one('click', _initTable);
		console.warn('BB false');
		return ;
	}*/
	/* Setup - add a text input to each footer cell */
	$('#synthesis-table tfoot th').each(function() {
		var title = $(this).text();
		$(this).html('<input type="text" class="form-control" placeholder="Rechercher ' + title + '" />');
	});

	table = $('#synthesis-table').DataTable({
		dom: 'Blfrtip',
		lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tous"]],
		pageLength: 10,
		responsive: true,
		fixedHeader: true,
		buttons: [
		{
			extend: 'copyHtml5',
			text: 'Copier',
		},
		{
			extend: 'excel',
			text: 'Export excel',
			className: 'exportExcel',
			filename: 'Export excel',
			exportOptions: {
				modifier: {
					page: 'all'
				}
			}
		}, 
		'csvHtml5',
		/*'pdfHtml5',*//*
		{
			extend: 'print',
			text: 'Imprimer',
		}*/
		],
		initComplete: function() {
			/* Dropdown */
		    if (server_time) {
		        $logsDateSync.html(moment(server_time*1000).calendar());
		    }
		    setInterval( function () {
		        table.ajax.reload( null, false ); // user paging is not reset on reload
		    }, 5 * 60000 );
			this.api().columns([0]).every(function() {
				var column = this;
				var select = $('<select class="selectpicker form-control" data-live-search="true" multiple><option value=""></option></select>')
				.appendTo($(column.footer()).empty())
				.on('change', function() {
					var val = $(this).val();
					var count_before = table.page.info().recordsDisplay;
					if (!val.length || val.length == 1 && !val[0].length) {
						column.search('', true, false).draw();
					} else { // /!\ No escape security
						column.search('^' + val.join('|') + '$', true, false).draw();
					}
					var count_after = table.page.info().recordsDisplay;
					if (count_before < 10 && count_after > count_before || count_after < 10) {
						select.selectpicker('toggle');
					}
				});
				column.data().unique().sort().each(function(d, j) {
					if (d != null && typeof d != 'undefined') {
						var val = d.toString().replace(/["'$$$]/g, "");
						select.append('<option value="' + val + '">' + val + '</option>')
					}
				});
				select.selectpicker({actionsBox: true});
			});
		},
		createdRow: function rowColor( row, data, dataIndex) {
			if (data == null) {
				return;
			}
			if (typeof data.msg != 'undefined' && data.msg != null) {
				var foundValue = arrayToSearch.filter(obj=>data.msg.toLowerCase().indexOf(obj.name) > 0);
				if (foundValue.length) {
					$(row).addClass(foundValue[foundValue.length -1].class);
				}
			}
			/*
			if (typeof data.created_at != 'undefined' && data.created_at != null && data.created_at != '') {
				var color = "dt-green";
				var days = moment().diff(moment(data.created_at), "days");
				if (days <= 3 && days >= 2) color = "dt-orange";
				else if (days < 2) color = "dt-red";
				$(row).find(":nth-child(3)").addClass(color);
			}
			if (typeof data.maxtemp != 'undefined' && data.maxtemp != null && data.maxtemp != '--') {
				var color = "dt-green";
				if (data.maxtemp >= 80 && data.maxtemp < 90) color = "dt-orange";
				else if (data.maxtemp >= 90) color = "dt-red";
				$(row).find(":nth-child(4)").addClass(color);
			}
			*/
			$("td:nth-child(1)", row).attr("title", "Num PASDT & SIM: " + data.module_id + (data.telitId ? ' Num Telit: ' + data.telitId : ''));
			$("td:nth-child(3)", row).attr("title", moment(data.created_at).format("dddd Do MMMM à kk:mm:ss"));
			$("td:nth-child(5)", row).attr("title", moment(data.temp_created_at).format("dddd Do MMMM à kk:mm:ss"));
		},
		language: datatablefr,
		"ajax": getData,
		"order": [
			[2, "desc"]
		],
		columnDefs: [ {
			"targets": 5,
			"orderable": false,
		}],
		"columns": [
			/* {"data": "id"},*/
			{
				"data": "name",
				"defaultContent": "<i>Pas de nom de module</i>",
				render: function ( data, type, row ) {
					if (type === 'sort' || type === 'filter') {
						return typeof row.name == 'string' && typeof row.module_id == 'string' ? row.module_id + ' - ' + row.name : '--';
					}
					return typeof row.name == 'string' ? row.name : '--';
				},
				data: function(row, type, val, meta) {
					return row.module_id + '$$$ - ' + row.name;
				}
			},/*
			{ 
			"data": "telit_custom2"
			},*/
			{ 
				"data": "msg",
				render: function(data, type, row) {
					if (data == null) {
						return '';
					}
					var msg = data.replace(/\"|\[|\]|/gi, '').replace(/,/gi, ' ').toLowerCase().capFirstLetter();
					if (msg === "Ack") return "Acquittement";
					return msg;
				},
				"defaultContent": "<i>Not set</i>"
			},
			{
				"data": "created_at", render: function(data, type, row) {
					if (type === 'sort') {
						if (row.created_at == null) row.created_at = '';
						return row.created_at;
					}
					if (data == null) return '--';
					var result = now.to(data);
					if (result == 'Invalid date') return '--';
					return result;
				},
				"defaultContent": "--"
			},
			{
				"data": "maxtemp", render: function(maxtemp, type, row) {
					if (type === 'sort') {
						if (maxtemp == '--') return undefined;
						return maxtemp;
					}
					if (maxtemp == null) return '--';
					return String(maxtemp) + '°C';
				},
				"defaultContent": "<i>Temp invalide</i>",
				"type": "num"
			},
			{
				"data": "temp_created_at", render: function(data, type, row) {
					if (type === 'sort') {
						if (row.temp_created_at == null) row.temp_created_at = '';
						return row.temp_created_at;
					}

					if (data == null) return '--';
					var result = now.to(data);
					if (result == 'Invalid date') return '--';
					return result + ' à ' + moment(data).format('kk[h]mm');
				},
				"defaultContent": "<i>Not set</i>"
			},
			{
				"data": "action", render: function(data, type, row) {
					return '<button class="btn btn-secondary openModuleModal">+</button>';
				},
				"defaultContent": "<i>Not set</i>"
			}
			/*{"data": "options"},*/
			/*{"data": "updated_at"},*/
		]
		});
		/* Search bar */
		table.columns([1, 2, 3, 4]).every(function() {
			var that = this;
			$('input', this.footer()).on('keyup change clear', function() {
				if (that.search() !== this.value) {
					if (false && [1].includes(that.selector.cols)) {
						that
						.search(`^${this.value}$`, true, false)
						.draw();
					} else {
						that
						.search(this.value)
						.draw();
					}
				}
			});
		});
	    document.addEventListener("backonline", function(e) {
	        table.ajax.reload( null, false );
	    });
	}
	dataTablesEvents();

	function dataTablesEvents() {
		$('#synthesis-table').on('click', '.openModuleModal', function(e) {
			var $modmodal = $('#moduleModal');
			var data = table.row( $(this).parents('tr') ).data();
			if (data && data.module_id) {
		        $.getJSON("/module/module_id/"+data.module_id, function(module_data) {
					active_module = module_data;
					/*
						var table = '<table><tr><th>Clé</th><th>Valeur</th></tr>';
						var f = flatten(module_data);
						for (p in f) {
						table += `<tr><td>${p}</td><td>${f[p]}</td></tr>\n`;
					*/
					var str_address = formatAdress(module_data.locAddress, false);
					$modmodal.find('.toggle-map').toggle(!!module_data.locLat && !!module_data.locLng)
						//.attr('data-loc', str_address)
						.attr('data-loclat', module_data.locLat)
						.attr('data-loclng', module_data.locLng);
					$modmodal.find('.modal-map').html('');
					//$modmodal.find('.modal-pre').html(table + "</table>");
					$modmodal.find('.modal-address').html(
						"<p><b>Adresse: </b> " + str_address + "</p>"
						+ "<p><b>ID du module: </b> " + data.module_id + "</p>"
						+ "<p><b>ID Telit: </b> " + module_data.iccid + "</p>"
						+ (module_data.custom1 ? "<p><b>Custom1: </b> " + module_data.custom1 + "</p>" : '')
						+ (module_data.custom2 ? "<p><b>Custom2: </b> " + module_data.custom2 + "</p>" : '')
						+ (module_data.custom3 ? "<p><b>Custom3: </b> " + module_data.custom3 + "</p>" : '')
					);
					$modmodal.modal("show");
		        })
		    }
		});
		$('#synthesis-table').on('click', 'tr', function (e) {
			var data = table.row( this ).data();
			if (data && data.module_id && !$(e.target).is(".openModuleModal") && !$(e.target).is(".dtr-control")) {
				$('#home-tab').click();
				$('#module-name select').val([data.name]).change();
			}
		} );

		$('.toggle-map').click(function(e) {
			$(this).hide('fast').siblings('.modal-map').html(`<iframe width="100%" height="450" frameborder="0" style="border:0"
				src="https://www.google.com/maps/embed/v1/search?q=${$(this).data('loclat')},${$(this).data('loclng')}&key=AIzaSyC-PpGeJv_tmROsmyi8ZS3p5UY0dsb9wMQ" allowfullscreen></iframe>`);
		})
		function formatAdress(a, escape) {
			if (typeof a == 'undefined') return '';
			var address = `${str(a.streetNumber)} ${str(a.city)} ${str(a.state)} ${str(a.zipCode)} ${str(a.country)}`;
			if (escape) {
				return escape(address);
			}
			return address;
		}
		function str(s) {
			if (!s) return ''; return s;
		}
	}

	_initTable();
});