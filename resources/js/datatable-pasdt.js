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
define(['datatables.net', 'datatables.net-bs4', /*'./graphs-chartjs',*/'moment/moment',/*'jszip',*/
  'flat', './components/datatable-fr', './components/color-event-assoc', './widgets/noping.plugin.js',
  'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5', /*'Buttons/js/buttons.print', 
  'Buttons/js/buttons.flash', */
  'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js'],
  function(datatables, datatables_bs/*Graphs, jszip*/, moment, flatten, datatablefr, arrayToSearch, noping) {
if (window.location.pathname !== "/home" && window.location.pathname !== "/") return ;
var table, graphdata, active_module;
//window.pdfMake = true;

/*
var originalPdfHtml5Action = $.fn.dataTableExt.buttons.pdfHtml5.action;
$.fn.dataTableExt.buttons.pdfHtml5.action = function pdfHtml5Action(e, dt, button, config){
    var that = this;
    require.ensure(['pdfmake', 'pdfmake/build/vfs_fonts'], function _pdfHtml5Action(){
        window.pdfMake = require('pdfmake');
        var vfs = require('pdfmake/build/vfs_fonts');
        window.pdfMake.vfs = vfs.pdfMake.vfs;

        originalPdfHtml5Action.apply(that, [e, dt, button, config]);
    });
};*/
String.prototype.capFirstLetter = function () {
    return /[a-z]/.test(this.trim()[0]) ? this.trim()[0]
        .toUpperCase() + this.slice(1) : this;
}

function getData(data, callback, settings) {
    if (typeof prelogs == "string") {
      callback(JSON.parse(prelogs));
    } else {
      $.ajax({
        "url": "/logs/get",
        "data": data
      }).done(function(data) {
        callback(data);
      });
    }
  }

function _initTable() {
  table = $('#main-table').DataTable({
    processing: true,
    serverSide: true,
    lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tous"]],
    pageLength: 10,
    dom: 'Blfrtip',
    language: datatablefr,
    "ajax": getData,
    "order": [[ 0, "desc" ]],
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
      'csvHtml5'
    ],
    initComplete: function (settings, data) {
      prelogs = null;
      console.error('deleting');
    },
    /*columns: {!!json_encode($dt_info['labels'])!!},
    order: {!!json_encode($dt_info['order'])!!},*/
    // initComplete: function() {
    //   /* Dropdown */
    //   this.api().columns([1]).every(function() {
    //     var column = this;
    //     var select = $('<select class="selectpicker form-control" data-live-search="true" multiple><option value=""></option></select>')
    //       .appendTo($(column.footer()).empty())
    //       .on('change', function() {
    //         var val = $(this).val();
    //         var count_before = table.page.info().recordsDisplay;
    //         if (!val.length || val.length == 1 && !val[0].length) {
    //           column.search('', true, false).draw();
    //         } else { // /!\ No escape security
    //           column.search('^' + val.join('|') + '$', true, false).draw();
    //         }
    //         var count_after = table.page.info().recordsDisplay;
    //         if (count_before < 10 && count_after > count_before || count_after < 10) {
    //           select.selectpicker('toggle');
    //         }
    //         //var a = $.fn.dataTable.util.escapeRegex(val.join('|'));
    //       });
    //       column.data().unique().sort().each(function(d, j) {
    //       if (d != null && typeof d != 'undefined') {
    //         var val = d.toString().replace(/["'$$$]/g, "");
    //         select.append('<option value="' + val + '">' + val + '</option>')
    //       }
    //     });
    //     select.selectpicker({actionsBox: true});
    //   });
    //   noping.initNopingButtons(table);
    // },
  });
setInterval( function () {
  //table.ajax.reload( null, false ); // user paging is not reset on reload
}, 60000 );
}
function _0initTable() {
  // app.js  table.style.width = _fnStringToCss( total );
  /*
      if (!$('#main-table').is(':visible')) {
        $('#main-tab').one('click', _initTable);
        console.warn('CC false');
        return ;
      }
      */

    /* Setup - add a text input to each footer cell */  
    $('#main-table tfoot th').each(function() {
      var title = $(this).text();
      $(this).html('<input type="text" class="form-control" placeholder="Rechercher ' + title + '" />');
    });
    table = $('#main-table').DataTable({
      serverSide: true,
      language: datatablefr,
      sAjaxSource: "/logs/get",
      fnServerData: function ( sSource, aoData, fnCallback, oSettings ) {
        if (typeof prelogs == "string") {
          debugger;
          fnCallback(prelogs);
          prelogs = null;
          return ;
        }
        /*oSettings.jqXHR = $.ajax( {
          "dataType": 'json',
          "type": "POST",
          "url": sSource,
          "data": aoData,
          "success": fnCallback
        } );*/
      },
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
          }*/
      ],
      initComplete: function() {
        /* Dropdown */
        this.api().columns([1]).every(function() {
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
              //var a = $.fn.dataTable.util.escapeRegex(val.join('|'));
            });
            column.data().unique().sort().each(function(d, j) {
            if (d != null && typeof d != 'undefined') {
              var val = d.toString().replace(/["'$$$]/g, "");
              select.append('<option value="' + val + '">' + val + '</option>')
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
          $(row).find(":nth-child(4)").addClass(color);
        }
        if (typeof data.vbat != 'undefined' && data.vbat != null && data.vbat != '--') {
          var color = "dt-green";
          if (data.vbat <= 12 && data.vbat > 11) color = "dt-orange";
          else if (data.vbat <= 11 ) color = "dt-red";
          $(row).find(":nth-child(5)").addClass(color);
        }
        $("td:nth-child(3)", row).attr("title", "Num PASDT & SIM: " + data.cardId);
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
          data: "created_at", render: function(data, type, row) {
            if (type === 'sort') {
              return row.created_at;
            }
            var ret = moment(data).format('lll');
            if (ret == 'Invalid date') return '--';
            return ret;
            //return data;//new Date(data).toLocaleString("fr-FR")
          }
        }, {
          data: "module_name",
          render: function ( data, type, row ) {
            if (type === 'sort' || type === 'filter') {
              return typeof row.module_name == 'string' && typeof row.cardId == 'string' ? row.cardId + ' - ' + row.module_name : '--';
            }
              return typeof row.module_name == 'string' ? row.module_name : '--';
          },
          data: function(row, type, val, meta) {
            return row.cardId + '$$$ - ' + row.module_name;
          }
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
              if (maxtemp == '--' || maxtemp == -99 || maxtemp == 785) return undefined;
              return maxtemp;
            }
            if (maxtemp == null || maxtemp == -99 || maxtemp == 785) return '--';
            return String(maxtemp) + '°C';
          },
          "type": "num"
        },
        {
          "data": "vbat", render: function(vbat, type, row) {
            if (type === 'sort') {
              if (vbat == '--') return undefined;
              return vbat;
            }
            if (vbat == null || vbat == "") return '--';
            return String(vbat) + ' V';
          },
          "type": "num"
        }
        /*{"data": "options"},*/
        /*{"data": "updated_at"},*/
      ]
    });
    /* Search bar */
    table.columns([0, 2, 3, 4]).every(function() {
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
      //Graphs.loadGraph(graphdata);
    });

    $('#realtime-graphs-tab').click( function () {
      graphdata = table.rows().data();
      
      //Graphs.loadGraph(graphdata);
    });

    var $datepicker_from = $("#datepicker_from");
    var $datepicker_to = $("#datepicker_to");
    var today = new Date().toISOString().split("T")[0];

    $datepicker_from.attr('max', today)
    .change(function(e, a, c) {
      var dat = $(this).val();
      minDateFilter = dat ? dat + ' 00:00:00' : '';
      $datepicker_to.attr('min', dat);
      table.draw();
    });

    $datepicker_to.attr('max', today)
    .change(function(e, a, c) {
      var dat = $(this).val();
      maxDateFilter = dat ? dat + ' 23:59:59' : '';
      $datepicker_from.attr('max', dat ? dat : today);
      table.draw();
    });
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
              /*var table = '<table><tr><th>Clé</th><th>Valeur</th></tr>';
              var f = flatten(module_data);
              for (p in f) {
                table += `<tr><td>${p}</td><td>${f[p]}</td></tr>\n`;
              }*/
              var $modmodal = $('#moduleModal');
              var str_address = formatAdress(module_data.locAddress);
              $modmodal.find('.toggle-map').toggle(!!module_data.locLat && !!module_data.locLng)
                //.attr('data-loc', str_address)
                .attr('data-loclat', module_data.locLat)
                .attr('data-loclng', module_data.locLng);
              $modmodal.find('.modal-map').html('');
              //$modmodal.find('.modal-pre').html(table + "</table>");
              $modmodal.find('.modal-address').html(
                "<p><b>Adresse: </b> " + str_address + "</p>"
                + "<p><b>ID du module: </b> " + data.cardId + "</p>"
                + "<p><b>ID Telit: </b> " + module_data.iccid + "</p>"
                + (module_data.custom1 ? "<p><b>Custom1: </b> " + module_data.custom1 + "</p>" : '')
                + (module_data.custom2 ? "<p><b>Custom2: </b> " + module_data.custom2 + "</p>" : '')
                + (module_data.custom3 ? "<p><b>Custom3: </b> " + module_data.custom3 + "</p>" : '')
                );
              $modmodal.modal("show");
            })
          }
      } );

    $('.toggle-map').click(function(e) {

        $(this).hide('fast').siblings('.modal-map').html(`<iframe width="100%" height="450" frameborder="0" style="border:0"
      src="https://www.google.com/maps/embed/v1/search?q=${$(this).data('loclat')},${$(this).data('loclng')}&key=AIzaSyC-PpGeJv_tmROsmyi8ZS3p5UY0dsb9wMQ" allowfullscreen></iframe>`);
      })
    function formatAdress(a, escape = false) {
      if (typeof a == 'undefined') return '';
      var str = `${a.streetNumber ? a.streetNumber : ''} ${a.city} ${a.state} ${a.zipCode} ${a.country}`;
      return escape ? escape(str) : str;
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