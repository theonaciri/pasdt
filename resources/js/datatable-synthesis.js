define(['datatables.net-bs4', './graphs-chartjs', /*'pdfmake', 'pdfmake/build/vfs_fonts.js',*/
  'flat', './components/datatable-fr', './components/color-event-assoc', 'moment/moment',
  'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5',/*'Buttons/js/buttons.print', 
  'Buttons/js/buttons.flash', */'./widgets/dateinterval.plugin.js'],
  function(datatables, Graphs, /*pdfmake, pdfFonts, */flatten, datatablefr, arrayToSearch, moment) {
	if (window.location.pathname !== "/home" && window.location.pathname !== "/") return ;
    function _initTable() {
    	/*
    	if (!$('#synthesis-table').is(':visible')) {
    		$('#synth-tab').one('click', _initTable);
    		console.warn('BB false');
    		return ;
    	}*/
			console.log('BB true');
	    /* Setup - add a text input to each footer cell */
	    $('#synthesis-table tfoot th').each(function() {
	      var title = $(this).text();
	      $(this).html('<input type="text" class="form-control" placeholder="Rechercher ' + title + '" />');
	    });

	    table = $('#synthesis-table').DataTable({
	      dom: 'Blfrtip',
	      lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tous"]],
	      pageLength: 10,
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
	        this.api().columns([0, 1]).every(function() {
	          var column = this;
	          var select = $('<select class="selectpicker form-control" multiple><option value=""></option></select>')
	            .appendTo($(column.footer()).empty())
	            .on('change', function() {
	              var val = $(this).val();
	              if (!val.length || val.length == 1 && !val[0].length) {
	                column.search('', true, false).draw();
	              } else { // /!\ No escape security
	                column.search('^' + val.join('|') + '$', true, false).draw();
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
	        /*if (typeof data.created_at != 'undefined' && data.created_at != null && data.created_at != '') {
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
	        }*/
	        $("td:nth-child(2)", row).attr("title", "Num PASDT & SIM: " + data.card_number + (data.telitId ? ' Num Telit: ' + data.telitId : ''));
	      },
	      language: datatablefr,
	      "ajax": {
	        //"url": "/json/data/dump.json",
	        "url": "/logs/synth" + (getUrlParameter('company') ? '?company=' + getUrlParameter('company') : ''),
	        "dataSrc": ""
	      },
	      "order": [
	        [2, "desc"]
	      ],
	      "columns": [
	        /* {"data": "id"},*/
	        {
	        	"data": "name",
	        	"defaultContent": "<i>Pas de nom de module</i>",
	        	render: function ( data, type, row ) {
	        		if (type === 'sort' || type === 'filter') {
	        			return typeof row.name == 'string' && typeof row.card_number == 'string' ? row.card_number + ' - ' + row.name : '--';
	        		}
	        		return typeof row.name == 'string' ? row.name : '--';
	        	},
	        	data: function(row, type, val, meta) {
	        		return row.card_number + '$$$ - ' + row.name;
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
	            var ret = moment(data).format('lll');
	            if (ret == 'Invalid date') return '--';
	            return ret;
	          },
	          "defaultContent": "<i>Not set</i>"
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
	          "defaultContent": "<i>Not set</i>",
	          "type": "num"
	        },
	        {
	          "data": "temp_created_at", render: function(data, type, row) {
	          	if (type === 'sort') {
		            if (row.temp_created_at == null) row.temp_created_at = '';
	              	return row.temp_created_at;
	            }

	            if (data == null) return '--';
	            var ret = moment(data).format('lll');
	            if (ret == 'Invalid date') return '--';
	            return ret;
	          },
	          "defaultContent": "<i>Not set</i>"
	        },
	        /*{"data": "options"},*/
	        /*{"data": "updated_at"},*/
	      ]
	    });
	    /* Search bar */
	    table.columns([2, 3, 4]).every(function() {
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


		dataTablesEvents();
		function dataTablesEvents() {
		  $('#synthesis-table').on('click', 'tr', function () {
		        var data = table.row( this ).data();
		        if (data) {
		          	$('#home-tab').click();
		          	$('#main-table #module-name .selectpicker')
		          		.selectpicker('val', data.card_number + ' - ' + data.name)
		          		.trigger('change');
		        }
		    } );

		  $('.toggle-map').click(function(e) {
		      $(this).hide('fast').siblings('.modal-map').html(`<iframe width="100%" height="450" frameborder="0" style="border:0"
		    src="https://www.google.com/maps/embed/v1/search?q=${$(this).data('loc')}&key=AIzaSyC-PpGeJv_tmROsmyi8ZS3p5UY0dsb9wMQ" allowfullscreen></iframe>`);
		    })
		  function formatAdress(a) {
		    if (typeof a == 'undefined') return '';
		    return escape(`${a.streetNumber} ${a.city} ${a.state} ${a.zipCode} ${a.country}`);
		  }
		}
	}

	setTimeout(_initTable, 1);
});