define(['datatables.net', 'datatables.net-bs4', "moment",/*'pdfmake', 'pdfmake/build/vfs_fonts.js',*/
		/*'flat',*/ './components/datatable-fr', './components/color-event-assoc', './components/getURLParameter',
		"./components/lang", "./components/strcap",  "./components/moment-fr",
		'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5', /*'Buttons/js/buttons.print', 
		'Buttons/js/buttons.flash', */'./widgets/dateinterval.plugin.js', 'datatables.net-responsive',
		'datatables.net-fixedheader-bs4', 'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js'],
function(datatables, datatables_bs, moment, /*pdfmake, pdfFonts, */ datatablefr, arrayToSearch, getURLParameter, lang) {
	if (location.pathname !== "/consultation" && location.pathname !== "/") return ;
	var table;
	var $logsDateSync = $('#synth-date-sync');
 	var $reload_btn = $('#synthesis .force-refresh-button');
	window.synthtable = table;
	const aggressive_cache = true;
	var data_draw = 0;

	function getData(_data, callback, settings) {
		data_draw++;
		var lastsynthonline = sessionStorage.getItem("lastsynthonline");
		var c = getURLParameter('company');
		if (c) {
			_data.company = c;
		}
		if (false && data_draw === 1 && typeof presynths != 'undefined' && typeof presynths != null) {
	    	$logsDateSync.html(moment(lastsynthonline || server_time * 1000).calendar());
			callback({data:presynths});
			return ;
		}
		sendAjax(_data, callback, settings);
	}

	function sendAjax(_data, callback, settings) {
		$.ajax({
	      "url": "/logs/synth",
	      "data": _data,
	      "timeout": 10000,
	    }).done(function(data, a, e) {
	    	var _date = e.getResponseHeader('date');
	    	var received_date = moment(_date.slice(_date.lastIndexOf(',') + 1));
	    	$logsDateSync.html(received_date.calendar());
	      	callback({data:data});

  			var event = new CustomEvent("online", { detail: {request: "synth", data: data }});
			document.dispatchEvent(event);

			if (!_data.company) {
				data.draw = 1;
		        sessionStorage.setItem("presynths", JSON.stringify(data));
		        sessionStorage.setItem("lastsynthonline", received_date.toJSON());
			}
			hideReloadBtn();
	    }).fail(function(data) {
	      	$('#synthesis-table_processing').hide("fast");
  			var event = new CustomEvent("offline", { detail: {request: "synth", data: data }});
			document.dispatchEvent(event);
	    });
	}

	function _initTable() {
		if (typeof locale != "undefined" && locale != "en-us" && typeof moment_locale !== "undefined") {
			moment.updateLocale(locale.split("-")[0], moment_locale);
		}
		var now = moment();
		/* Setup - add a text input to each footer cell */

		table = $('#synthesis-table').DataTable({
	    	processing: true,
			dom: 'Blfrtip',
			lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, lang("All")]],
			pageLength: 10,
			responsive: true,
			fixedHeader: true,
			buttons: [
			{
				extend: 'copyHtml5',
				text: lang("Copy"),
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
				this.api().columns([0]).every(function() {
					var column = this;
					var select = $('<select class="selectpicker form-control" data-live-search="true" multiple><option value=""></option></select>')
					.appendTo($(column.footer()).empty())
					.on('change', function() {
						var val = $(this).val();
						if (typeof table === "undefined") {
							table = $('#synthesis-table').DataTable();
						}
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
					if (locale === "fr-fr") {
			        	select.selectpicker({actionsBox: true});
			        } else {
				        $.ajaxSetup({ cache: true });
						$.getScript('/json/locales/bootstrap-select/defaults-' + locale.split('-')[0] + '_' + locale.split('-')[1].toUpperCase() + '.js')
							.always(function() {
							select.selectpicker({actionsBox: true});
						});
				         $.ajaxSetup({ cache: false });
			        }
				});
			},
			createdRow: function rowColor( row, data, dataIndex) {
				if (data == null) {
					return;
				}
				if (typeof data.msg != 'undefined' && data.msg != null) {
					var foundValue = arrayToSearch.filter(function(obj) { return data.msg.toLowerCase().indexOf(obj.name.toLowerCase()) > 0});
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
				$("td:nth-child(3)", row).attr("title", moment(data.created_at).format("dddd Do MMMM " + lang("to") + " kk:mm:ss").capitalize());
				$("td:nth-child(5)", row).attr("title", moment(data.temp_created_at).format("dddd Do MMMM " + lang("to") + " kk:mm:ss").capitalize());
			},
			language: (locale === "fr-fr") ? datatablefr : {
				url: locale == "en-us" ? "" : "/json/locales/datatables/" + locale + ".json"
			},
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
					"defaultContent": "<i>" + lang("No module name") + "</i>",
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
						return data;
					},
					"defaultContent": "<i>" + lang("Not set") + "</i>"
				},
				{
					"data": "created_at", render: function(data, type, row) {
						now = moment();
						if (type === 'sort') {
							if (row.created_at == null) row.created_at = '';
							return row.created_at;
						}
						if (data == null) return '--';
						var result = now.to(data).capitalize();
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
					"defaultContent": "<i>" + lang("Not set") + "</i>",
					"type": "num"
				},
				{
					"data": "temp_created_at", render: function(data, type, row) {
						now = moment();
						if (type === 'sort') {
							if (row.temp_created_at == null) row.temp_created_at = '';
							return row.temp_created_at;
						}

						if (data == null) return '--';
						var result = now.to(data);
						if (result == 'Invalid date') return '--';
						return result.capitalize() + ' ' + lang("to") + ' ' + moment(data).format('kk[h]mm');
					},
					"defaultContent": "<i>" + lang("Not set") + "</i>"
				},
				{
					"data": "action", render: function(data, type, row) {
						return '<button data-id="' + row.id + '" class="btn btn-secondary openModuleModal" title="+"><span class="oi oi-plus"></span></button>';
					},
					"defaultContent": "<i>" + lang("Not set") + "</i>"
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
		autoReload();
	} /* initTable */

	$reload_btn.on('click', function() {
		table.ajax.reload(null, false);
		hideReloadBtn();
	});

	function hideReloadBtn() {
		$reload_btn.css("opacity", "0").attr('disabled', true);
		setTimeout(function() {
			$reload_btn.css("opacity", "1").attr('disabled', false);
		}, 60000);
	}

	function autoReload() {
		document.addEventListener("backonline", function(e) {
			table.ajax.reload( null, false );
		});
		var seconds_offline = moment().diff(moment(sessionStorage.getItem("lastsynthonline") || server_time * 1000), "seconds");

		if (seconds_offline >= 60) {
	    	$reload_btn.css("opacity", "1").attr('disabled', false);
	    } else {
	    	setTimeout(function() {
	    		$reload_btn.css("opacity", "1").attr('disabled', false);
	    	}, Math.min(60 - seconds_offline) * 1000);
	    }

		setTimeout(function() { // Lancer au plus tard dans 5 mins.
			table.ajax.reload( null, false );
			setInterval( function () { // Boucle reload de 5min
				table.ajax.reload( null, false );
			}, 5 * 60000 );
		}, Math.max(5 * 60 - seconds_offline, 0) * 1000);
	}

	dataTablesEvents();

	function dataTablesEvents() {
		$('#synthesis-table').on('click', '.openModuleModal', function(e) {
			e.preventDefault();
			var $modmodal = $('#moduleModal');
			var data = table.row( $(this).parents('tr') ).data();
			var id = $(this).data('id');
			if (typeof id !== "undefined") {
		        $.getJSON("/module/"+id, function(module_data) {
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
						"<p><b>" + lang("Address") + " : </b> " + str_address + "</p>"
						+ "<p><b>" + lang("Module ID") + " : </b> " + data.module_id + "</p>"
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