//var dt = require( 'datatables.net' );
require( 'datatables.net-bs4' );
require( 'jszip' );
var pdfFonts = require( 'pdfmake/build/vfs_fonts.js' );
var pdfmake = require( 'pdfmake' );
require( 'datatables.net-buttons-bs4' );
require( 'datatables.net-buttons/js/buttons.html5.js' );
require( 'datatables.net-buttons/js/buttons.print.js' );
/*
require( 'datatables.net-colreorder-bs4' );
require( 'datatables.net-fixedheader-bs4' );
require( 'datatables.net-keytable-bs4' );
require( 'datatables.net-responsive-bs4' );
require( 'datatables.net-rowgroup-bs4' );
require( 'datatables.net-scroller-bs4' );
*/
require('./widgets/dateinterval.plugin.js');
require('./widgets/noping.plugin.js');
//var rowColor = require('./widgets/created-row-color.plugin.js');
var arrayToSearch = [
  {name: 'temperature 1',   value: '1', class: 'dt-grey'},
  {name: 'temperature 2',   value: '2', class: 'dt-red'},
  {name: 'defaut pression', value: '3', class: 'dt-blue'},
  {name: 'defaut gaz',      value: '4', class: 'dt-green'},
  {name: 'defaut pression * defaut temperature 1',      value: '5', class: 'dt-black'},
  {name: 'defaut temperature 2 * defaut temperature 1', value: '6', class: 'dt-black'},
  {name: '',                value: '7', class: 'dt-black'}
];
var table;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
String.prototype.capFirstLetter = function () {
    return /[a-z]/.test(this.trim()[0]) ? this.trim()[0]
        .toUpperCase() + this.slice(1) : this;
}

function _initTable() {
  console.log('init');
  $(document).ready(function() {
    /* Setup - add a text input to each footer cell */
    $('#main-table tfoot th').each(function() {
      var title = $(this).text();
      $(this).html('<input type="text" placeholder="Rechercher ' + title + '" />');
    });

    table = $('#main-table').DataTable({
      dom: 'Bfrtip',
      buttons: [
          'copyHtml5',
          'excelHtml5',
          'csvHtml5',
          'pdfHtml5'
      ],
      initComplete: function() {
        /* Dropdown */
        this.api().columns([1, 2]).every(function() {
          var column = this;
          var select = $('<select class="individual-search"><option value=""></option></select>')
            .appendTo($(column.footer()).empty())
            .on('change', function() {
              var val = $.fn.dataTable.util.escapeRegex($(this).val());
              console.warn('a', '^' + val + '$', 'b', val);
              console.warn('this', this);
              console.warn('column ', column);
              column.search(val ? '^' + val + '$' : '', true, false).draw();
            });

          column.data().unique().sort().each(function(d, j) {
            select.append('<option value="' + d.replace(/["']/g, "") + '">' + d + '</option>')
          });
        });
      },
      createdRow: function rowColor( row, data, dataIndex) {
        //console.log('testing ', data.msg.toLowerCase().indexOf("temperature 1")> 0);
        if (typeof data.msg != 'undefined') {
          var foundValue = arrayToSearch.filter(obj=>data.msg.toLowerCase().indexOf(obj.name) > 0);
          //console.log('found', foundValue);
          if (foundValue.length) {
            $(row).addClass(foundValue[foundValue.length -1].class);
          }
        }
      },
      language: {
        processing: "Traitement en cours...",
        search: "Rechercher&nbsp;partout&nbsp;:",
        lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
        info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix: "",
        loadingRecords: "Chargement en cours...",
        zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable: "Aucune donnée disponible dans le tableau",
        paginate: {
          first: "Premier",
          previous: "Pr&eacute;c&eacute;dent",
          next: "Suivant",
          last: "Dernier"
        },
        aria: {
          sortAscending: ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      },
      "ajax": {
        "url": "/json/data/dump.json",
        "dataSrc": ""
      },
      "order": [
        [0, "desc"]
      ],
      "columns": [
        /* {"data": "id"},*/

        {
          "data": "created_at", render: function(data, type, row) {
            return data;//new Date(data).toLocaleString("fr-FR")
          }
        },
        {
          "data": "cardId"
        },
        /*{"data": "msgId"},*/
        {
          "data": "eventType"
        },
        {
          "data": "msg", render: function(data, type, row) {
            return data.replace(/\"|\[|\]|/gi, '').replace(/,/gi, ' ').toLowerCase().capFirstLetter();
          }
        }
        /*{"data": "options"},*/
        /*{"data": "updated_at"},*/
      ]
    });
    /* Search bar */
    table.columns([0, 3]).every(function() {
      var that = this;
      $('input', this.footer()).on('keyup change clear', function() {
        console.log('this ', this, ' that ', that);
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
        console.warn('testing for ', value, index);
        return value != 'Day' ? true : false;
      });
    console.log('F', filteredData);

  });

}


_initTable();