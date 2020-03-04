/*
require( 'datatables.net-colreorder-bs4' );
require( 'datatables.net-fixedheader-bs4' );
require( 'datatables.net-keytable-bs4' );
require( 'datatables.net-responsive-bs4' );
require( 'datatables.net-rowgroup-bs4' );
require( 'datatables.net-scroller-bs4' );
*/

//var rowColor = require('./widgets/created-row-color.plugin.js');
// jszip is commented because excel import does not work. CSV works
define(['datatables.net-bs4', './graphs-chartjs', 'moment/moment',/*'jszip',*/
  'flat', './components/datatable-fr', './components/color-event-assoc', './widgets/noping.plugin.js',
  'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5', 'Buttons/js/buttons.print', 
  'Buttons/js/buttons.flash', './widgets/dateinterval.plugin.js',
  'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js'],
  function(datatables, Graphs/*, jszip*/, moment, flatten, datatablefr, arrayToSearch, noping) {
if (window.location.pathname !== "/home" && window.location.pathname !== "/") return ;
var table, graphdata, active_module;
window.pdfMake = true;

var originalPdfHtml5Action = $.fn.dataTableExt.buttons.pdfHtml5.action;

$.fn.dataTableExt.buttons.pdfHtml5.action = function pdfHtml5Action(e, dt, button, config){
    var that = this;
    require.ensure(['pdfmake', 'pdfmake/build/vfs_fonts'], function _pdfHtml5Action(){
        window.pdfMake = require('pdfmake');
        var vfs = require('pdfmake/build/vfs_fonts');
        window.pdfMake.vfs = vfs.pdfMake.vfs;

        originalPdfHtml5Action.apply(that, [e, dt, button, config]);
    });
};
String.prototype.capFirstLetter = function () {
    return /[a-z]/.test(this.trim()[0]) ? this.trim()[0]
        .toUpperCase() + this.slice(1) : this;
}

function _initTable() {
  // app.js  table.style.width = _fnStringToCss( total );
  /*
      if (!$('#main-table').is(':visible')) {
        $('#main-tab').one('click', _initTable);
        console.warn('CC false');
        return ;
      }
      */
  console.warn('CC true');
    /* Setup - add a text input to each footer cell */  
    $('#main-table tfoot th').each(function() {
      var title = $(this).text();
      $(this).html('<input type="text" class="form-control" placeholder="Rechercher ' + title + '" />');
    });

    window.pdfMake = true;


    table = $('#main-table').DataTable({
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
            action: function(e, dt, button, config) {
               
              // Add code to make changes to table here
       
              // Call the original action function afterwards to
              // continue the action.
              // Otherwise you're just overriding it completely.
              if ($.fn.dataTable.ext.buttons.csvHtml5.available( dt, config )) {
                      $.fn.dataTable.ext.buttons.csvHtml5.action(e, dt, button, config);
              }
              else {
                  $.fn.dataTable.ext.buttons.csvFlash.action(e, dt, button, config);
              }
            }
          }
      ],
      initComplete: function() {
        /* Dropdown */
        this.api().columns([1]).every(function() {
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
              //var a = $.fn.dataTable.util.escapeRegex(val.join('|'));
            });

          column.data().unique().sort().each(function(d, j) {
            if (d != null && typeof d != 'undefined') {
              select.append('<option value="' + d.toString().replace(/["']/g, "") + '">' + d + '</option>')
            }
          });
          select.selectpicker({actionsBox: true});
        });
        noping.initNopingButtons(table);
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
        if (typeof data.maxtemp != 'undefined' && data.maxtemp != null && data.maxtemp != '--') {
          var color = "dt-green";
          if (data.maxtemp >= 80 && data.maxtemp < 90) color = "dt-orange";
          else if (data.maxtemp >= 90) color = "dt-red";
          $(row).find(":nth-child(5)").addClass(color);
        }
        $("td:nth-child(2)", row).attr("title", "Num PASDT & SIM: " + data.cardId);
      },
      language: datatablefr,
      "ajax": {
        //"url": "/json/data/dump.json",
        "url": "/logs" + (getUrlParameter('company') ? '?company=' + getUrlParameter('company') : ''),
        "dataSrc": ""
      },
      "order": [
        [0, "desc"]
      ],
      "columns": [
        /* {"data": "id"},*/
        {
          "data": "created_at", render: function(data, type, row) {
            if (type === 'sort') {
              return row.created_at;
            }
            var ret = moment(data).format('lll');
            if (ret == 'Invalid date') return '--';
            return ret;
            //return data;//new Date(data).toLocaleString("fr-FR")
          }
        },
        {
          "data": "module_name"
        },
        /*{"data": "msgId"},
        {
          "data": "customer"
        },*/
        { 
          "data": "msg", render: function(data, type, row) {
            if (data == null) {
              return '';
            }
            var msg = data.replace(/\"|\[|\]|/gi, '').replace(/,/gi, ' ').toLowerCase().capFirstLetter();
            if (msg === "Ack") return "Acquittement";
            return msg;
          }
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
          "type": "num"
        }
        /*{"data": "options"},*/
        /*{"data": "updated_at"},*/
      ]
    });
    /* Search bar */
    table.columns([0, 2, 3]).every(function() {
      var that = this;
      $('input', this.footer()).on('keyup change clear', function() {
        if (that.search() !== this.value) {
          if (false && [1].includes(that.selector.cols)) {
            that
              .search(`^${this.value}$`, true, false)
              .draw();
          } else if (that.selector.cols == 3) {
            that.draw();
          } else {  
            that
              .search(this.value)
              .draw();
          }
        }
      });
    });
    //table.columns.adjust.draw();
    dataTablesEvents();


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
      dateFormat: "dd/mm/yy",
      showOn: "button",
      buttonImage: "images/Calendar.png",
      buttonImageOnly: false,
      beforeShow: function( input, inst){
        console.warn(input, inst);
        $(inst).addClass('btn btn-secondary');
      },
      "onSelect": function(date, d) {
        var dateObj = new Date(d.selectedYear, d.selectedMonth, d.selectedDay);
        minDateFilter = new Date(dateObj).getTime();
        table.draw();
      }
    }).keyup(function() {
        var dateObj = new Date(this.value);
        minDateFilter = new Date(dateObj).getTime();
        table.draw();
    }).next(".ui-datepicker-trigger").addClass("btn btn-secondary");

    $("#datepicker_to").datepicker({
      dateFormat: "dd/mm/yy", 
      showOn: "button",
      buttonImage: "images/Calendar.png",
      buttonImageOnly: false,
      "onSelect": function(date, d) {
        var dateObj = new Date(d.selectedYear, d.selectedMonth, d.selectedDay);
        dateObj.setDate(dateObj.getDate() + 1);
        maxDateFilter = new Date(dateObj).getTime();
        table.draw();
      }
    }).keyup(function() {
        var dateObj = new Date(this.value);
        dateObj.setDate(dateObj.getDate() + 1);
        maxDateFilter = new Date(dateObj).getTime();
        table.draw();
    }).next(".ui-datepicker-trigger").addClass("btn btn-secondary");

    var filteredData = table
    .column(2)
    .data()
    .filter(function(value, index) {
      return value != 'Day' ? true : false;
    });

  function dataTablesEvents() {
    $('#main-table').on('click', 'tr', function () {
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
    function toggleAdvancedSearchButtons(e, notoggle) {
      var toggle_ping_value = localStorage.getItem('nosearch') === "true";
      toggle_ping_value = notoggle ? toggle_ping_value : !toggle_ping_value;
      localStorage.setItem('nosearch', toggle_ping_value);
      $(e.target).toggleClass('btn-dark', toggle_ping_value);
      $('#date_filter, .dt-buttons').toggle(toggle_ping_value);
    }

    $('.toggle-buttons').on("click", toggleAdvancedSearchButtons);
    //toggleAdvancedSearchButtons({target: $('.toggle-buttons')}, true);
  }
}

setTimeout(_initTable, 1);

});