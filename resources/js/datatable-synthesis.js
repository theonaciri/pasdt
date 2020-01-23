define(['datatables.net-bs4', './graphs-chartjs', 'pdfmake', 'pdfmake/build/vfs_fonts.js',
  'flat', './components/datatable-fr', './components/color-event-assoc',
  'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5', 'Buttons/js/buttons.print', 
  'Buttons/js/buttons.flash', './widgets/dateinterval.plugin.js',
  './widgets/noping.plugin.js'],
  function(datatables, Graphs, pdfmake, pdfFonts, flatten, datatablefr, arrayToSearch) {
    if (window.location.pathname !== "/home") return ;
    function _initTable() {
	  $(document).ready(function() {
	    /* Setup - add a text input to each footer cell */
	    $('#synthesis-table tfoot th').each(function() {
	      var title = $(this).text();
	      $(this).html('<input type="text" placeholder="Rechercher ' + title + '" />');
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
	          'pdfHtml5',
	          {
	            extend: 'print',
	            text: 'Imprimer',
	          }
	      ],
	      initComplete: function() {
	        /* Dropdown */
	        this.api().columns([0, 1]).every(function() {
	          var column = this;
	          var select = $('<select class="individual-search"><option value=""></option></select>')
	            .appendTo($(column.footer()).empty())
	            .on('change', function() {
	              var val = $.fn.dataTable.util.escapeRegex($(this).val());
	              column.search(val ? '^' + val + '$' : '', true, false).draw();
	            });

	          column.data().unique().sort().each(function(d, j) {
	            if (d != null && typeof d != 'undefined') {
	              select.append('<option value="' + d.toString().replace(/["']/g, "") + '">' + d + '</option>')
	            }
	          });
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
	      },
	      language: datatablefr,
	      "ajax": {
	        //"url": "/json/data/dump.json",
	        "url": "/logs/synth" + (getUrlParameter('company') ? '?company=' + getUrlParameter('company') : ''),
	        "dataSrc": ""
	      },
	      "order": [
	        [0, "desc"]
	      ],
	      "columns": [
	        /* {"data": "id"},*/
	        {
	          "data": "telit_id"
	        },
	        { 
	          "data": "telit_custom2"
	        },
	        { 
	          "data": "msg"
	        },
	        {
	          "data": "created_at"
	        },
	        {
	          "data": "maxtemp"
	        }
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


	    $('#graphs-tab').click( function () {
	      graphdata = table.rows({ 'search': 'applied' }).data();
	      Graphs.loadGraph(graphdata);
	    });

	    $('#realtime-graphs-tab').click( function () {
	      graphdata = table.rows().data();
	      
	      Graphs.loadGraph(graphdata);
	    });
	    $.datepicker.setDefaults($.datepicker.regional["fr"]);

	    $("#datepicker_from").datepicker({
	      dateFormat: "yy-mm-dd",
	      showOn: "button",
	      buttonImage: "images/Calendar.png",
	      buttonImageOnly: false,
	      "onSelect": function(date) {
	        minDateFilter = new Date(date).getTime();
	        table.draw();
	      }
	    }).keyup(function() {
	      minDateFilter = new Date(this.value).getTime();
	      table.draw();
	    });

	    $("#datepicker_to").datepicker({
	      dateFormat: "yy-mm-dd",
	      showOn: "button",
	      buttonImage: "images/Calendar.png",
	      buttonImageOnly: false,
	      "onSelect": function(date) {
	        maxDateFilter = new Date(date).getTime();
	        table.draw();
	      }
	    }).keyup(function() {
	      maxDateFilter = new Date(this.value).getTime();
	      table.draw();
	    });

	    initNopingButtons(table);
	    var filteredData = table
	    .column(3)
	    .data()
	    .filter(function(value, index) {
	      return value != 'Day' ? true : false;
	    });
	  });

	}


	function dataTablesEvents() {
	  $('#synth-table').on('click', 'tr', function () {
	        var data = table.row( this ).data();
	        if (data && data.module_id) {
	          $.getJSON("/module/"+data.module_id, function(module_data) {
	            active_module = module_data;
	            var table = '<table><tr><th>Clé</th><th>Valeur</th></tr>';
	            var f = flatten(module_data);
	            for (p in f) {
	              table += `<tr><td>${p}</td><td>${f[p]}</td></tr>\n`;
	            }
	            var $modmodal = $('#moduleModal');
	            var str_address = formatAdress(module_data.locAddress);
	            $modmodal.find('.toggle-map').toggle(!!str_address.length).attr('data-loc', str_address);
	            $modmodal.find('.modal-map').html('');
	            $modmodal.find('.modal-pre').html(table + "</table>");
	            $modmodal.modal("show");
	          })
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

_initTable();
});