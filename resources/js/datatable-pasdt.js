define([
  './components/datatable-fr', './components/color-event-assoc', 'datatables.net-bs4',
  /*'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5',*/
  'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js'],
  function(datatablefr, arrayToSearch) {
if (window.location.pathname !== "/home" && window.location.pathname !== "/") return ;
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
$('.clear-cal').on('click', function() {
  cal_interval.clear();
})
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
  });

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
} // dataTablesEvents

function filterColumn($this) {
  var i = $this.parent().attr('data-column');
  console.log('i', i, $this.val());
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
    cal_interval.selectedDates.forEach(function(d) {data.interval.push(flatpickr.formatDate(new Date(d), "Y-m-d"))})
    console.log(data);
    $.ajax({
      "url": "/logs/get",
      "data": data
    }).done(function(data) {
      callback(data);
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
    initComplete: function() {
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