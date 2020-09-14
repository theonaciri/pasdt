define([
  './components/datatable-fr', './components/color-event-assoc', 'datatables.net-bs4',
  /*'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5',*/
  'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js'],
  function(datatablefr, arrayToSearch) {

    function GetURLParameter(e) {
    for (var t = window.location.search.substring(1).split("&"), n = 0; n < t.length; n++) {
        var a = t[n].split("=");
        if (a[0] == e)
            return typeof a[1] === 'undefined' ? true : a[1];
    }
}

if (window.location.pathname !== "/consultation" && window.location.pathname !== "/") return ;
var table, graphdata, active_module;
var cal_interval = flatpickr('#dateinterval_logtable', {
    mode: "range",
    altInput: true,
    altFormat: "j F Y",
    dateFormat: "d/m/Y",
    maxDate: "today",
    onChange: function() {
      table.ajax.reload( null, false );
    }
});

$('.clear-cal').on('click', function(e) {
  cal_interval.clear();
});

var onlytemp = false; //localStorage.getItem('notemp') === "true";
var noday = false; //localStorage.getItem('noday') === "true";
$("#noday").toggleClass('btn-dark', noday).on('click', function(e) {
  noday = !noday;
  if (onlytemp == noday == true) {
    onlytemp = false;
    $("#notemp").toggleClass('btn-dark', onlytemp);
  }
  localStorage.setItem('noday', noday);
  $("#noday").toggleClass('btn-dark', noday);
  table.ajax.reload( null, false );
});

$("#notemp").toggleClass('btn-dark', onlytemp)
  .on('click', function(e) {
  onlytemp = !onlytemp;
  if (onlytemp == noday == true) {
    noday = false;
    $("#noday").toggleClass('btn-dark', noday);
  }
  localStorage.setItem('notemp', onlytemp);
  $("#notemp").toggleClass('btn-dark', onlytemp);
  table.ajax.reload( null, false );
});

/* old function ?
function toggleAdvancedSearchButtons(e, notoggle) {
  var toggle_ping_value = localStorage.getItem('nosearch') === "true";
  toggle_ping_value = notoggle ? toggle_ping_value : !toggle_ping_value;
  localStorage.setItem('nosearch', toggle_ping_value);
  $(e.target).toggleClass('btn-dark', toggle_ping_value);
  $('#date_filter, .dt-buttons').toggle(toggle_ping_value);
}
*/
function filterColumn($this) {
  var i = $this.parent().attr('data-column');
  table.column( i ).search(
      $this.val()).draw();
}

function getData(data, callback, settings) {
  if (prelogs != null && typeof prelogs === "object") {
    callback(prelogs);
    if (prelogs != null && typeof prelogs === "object" && prelogs.draw) {
      prelogs.draw = +prelogs.draw +1;
    }
  } else {
    data.interval = [];
    cal_interval.selectedDates.forEach(function(d) {data.interval.push(flatpickr.formatDate(new Date(d), "Y-m-d"))});
    data.onlytemp = onlytemp;
    data.noday = noday;
    data.company = GetURLParameter("company");
    $.ajax({
      "url": "/logs/get",
      "data": data,
      "timeout": 10000,
    }).done(function(data) {
      callback(data);
    }).fail(function(data) {
      $('#main-table_processing').hide("fast");
    });
  }
} // getData

function initTable() {
  table = $('#main-table').DataTable({
    processing: true,
    serverSide: true,
    lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Tous"]],
    pageLength: 10,
    dom: 'Blfrtip',
    language: datatablefr,
    ajax: getData,
    order: [[ 0, "desc" ]],
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
    /*columns: {!!json_encode($dt_info['labels'])!!},
    order: {!!json_encode($dt_info['order'])!!},*/
    initComplete: function(settings, json) {
      prelogs = null;
      setInterval( function () {
        table.ajax.reload( null, false ); // user paging is not reset on reload
      }, 5 * 60000 );

      $('#main-table tfoot input').on( 'keyup', function () {
        filterColumn($(this));
      });
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
           column.search(val, true, false).draw();
         }
         var count_after = table.page.info().recordsDisplay;
         if (count_before < 10 && count_after > count_before || count_after < 10) {
           select.selectpicker('toggle');
         }
        });

        if (typeof presynths != 'undefined' && Array.isArray(presynths)) {
          presynths.forEach(function(d, j) {
               if (d != null && typeof d != 'undefined') {
                   select.append('<option value="' + d.name + '">[' + d.module_id + '] ' + d.name + '</option>')
               }
           });
        }
        select.selectpicker({actionsBox: true});
      }); /* / Dropdown */
    } // initComplete
  }); // table
}

initTable();
});