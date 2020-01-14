define(['datatables.net-bs4', './graphs-chartjs', 'jszip', 'pdfmake', 'pdfmake/build/vfs_fonts.js',
  'flat', './components/datatable-fr', './components/color-event-assoc',
  'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5', 'Buttons/js/buttons.print', 
  'Buttons/js/buttons.flash', './widgets/dateinterval.plugin.js',
  './widgets/noping.plugin.js'],
  function(datatables, Graphs, jszip, pdfmake, pdfFonts, flatten, datatablefr, arrayToSearch) {
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
	        this.api().columns([1, 2]).every(function() {
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
	          "data": "module_id"
	        },
	        /*{"data": "msgId"},*/
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
	          "data": "options", render: function(data, type, row) {
	            try {
	              var obj = JSON.parse(data);
	              if (typeof obj === 'object' && obj != null && obj.hasOwnProperty("maxtemp")) {
	                return obj.maxtemp > -90 ? String(obj.maxtemp) + '°C' : '--';
	              }
	              return '--';
	            } catch (e) {
	              console.warn(e);
	              return '--';
	            }
	        }
	        },
	        {
	          "data": "created_at"
	        }
	        /*{"data": "options"},*/
	        /*{"data": "updated_at"},*/
	      ]
	    });
	    /* Search bar */
	    table.columns([0, 3, 4]).every(function() {
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

_initTable();
});