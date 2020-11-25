define(['jquery', 
  './components/datatable-fr', './components/color-event-assoc', 'moment/moment', './components/getURLParameter', "./components/lang", 'datatables.net-bs4',  "./components/moment-fr",
  /*'Buttons/js/buttons.bootstrap4', 'Buttons/js/buttons.html5',*/
  'bootstrap-select', 'bootstrap-select/js/i18n/defaults-fr_FR.js', 'datatables.net-responsive', 'datatables.net-fixedheader-bs4'],
  function($, datatablefr, arrayToSearch, moment, getURLParameter, lang) {
var table, graphdata, active_module, cal_interval;
var $logsDateSync = $('#logs-date-sync');
window.logtable = table;
var onlytemp = false; //localStorage.getItem('notemp') === "true";
var noday = false; //localStorage.getItem('noday') === "true";
var aggressive_cache = true;

function createCalendar() {
  cal_interval = flatpickr('#dateinterval_logtable', {
    mode: "range",
    altInput: true,
    altFormat: locale === "en-us" ? "F j Y" : "j F Y",
    dateFormat: locale === "en-us" ? "m/d/Y": "d/m/Y",
    locale: locale.split("-")[0],
    maxDate: "today",
    onChange: function() {
      table.ajax.reload( null, false );
    }
  });
  $('.clear-cal').on('click', function(e) {
    cal_interval.clear();
  });
}

if (locale !== "en-us" && locale !== "fr-fr") {
  $.ajaxSetup({ cache: true });
  $.getScript('/json/locales/flatpickr/' + locale.split('-')[0] + '.js')
  .done(createCalendar);
  $.ajaxSetup({ cache: false });
} else {
  createCalendar();
}

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

function filterColumn($this) {
  var i = $this.parent().attr('data-column');
  table.column( i ).search(
      $this.val()).draw();
}

function getData(_data, callback, settings) {
  if (prelogs != null && typeof prelogs === "object" && _data.draw === 1) {
    //console.warn('IF: ', _data);
    callback(prelogs);
  } else if (aggressive_cache && _data.draw === 2 && _data.search.value == ""
        && !_data.columns.find(e => e.search.value != "") && _data.start == 0
        && moment().diff(moment(sessionStorage.getItem("lastonline") || server_time * 1000), "minutes") < 5
        && sessionStorage.getItem("prelogs")) {
    // enter if diff between now and lastonline > 5 mins. If no lastonline, make it so lastonline is 10 mins
    // moment().diff(moment(sessionStorage.getItem("lastonline") || moment().subtract(10, 'minutes'))
    // console.warn('Else if: Received log too soon', _data);
    var data = JSON.parse(sessionStorage.getItem("prelogs"));
    $logsDateSync.html(moment(sessionStorage.getItem("lastonline") || server_time * 1000).calendar());
    data.draw = 2;
    callback(data);
  } else {
    // console.warn('Else: ', _data);
    _data.interval = [];
    cal_interval.selectedDates.forEach(function(d) {_data.interval.push(flatpickr.formatDate(new Date(d), "Y-m-d"))});
    _data.onlytemp = onlytemp;
    _data.noday = noday;
    _data.company = getURLParameter("company");
    $.ajax({
      "url": "/logs/get",
      "data": _data,
      "timeout": 10000,
    }).done(function(data, a, e) {
      var _date = e.getResponseHeader('date');
      var received_date = moment(_date.slice(_date.lastIndexOf(',') + 1));
      console.log('received at ', received_date);
      $logsDateSync.html(received_date.calendar());
      callback(data);
      var event = new CustomEvent("online", { detail: {request: "logs", data: data }});
      document.dispatchEvent(event);
      if (_data.search.value == "" && !_data.columns.find(e => e.search.value != "") && _data.start == 0) {
        data.draw = 1;
        // console.warn('storing', data);
        sessionStorage.setItem("prelogs", JSON.stringify(data));
        sessionStorage.setItem("lastonline", received_date.toJSON());
      }
    }).fail(function(data) {
      $('#main-table_processing').hide("fast");
      var event = new CustomEvent("offline", { detail: {request: "logs", data: data }});
      document.dispatchEvent(event);
    });
  }
} // getData

function initTable() {
  if (typeof locale != "undefined" && locale != "en-us" && typeof moment_locale !== "undefined") {
    moment.updateLocale(locale.split("-")[0], moment_locale);
  }
        
  $.ajaxSetup({ cache: true });
  table = $('#main-table').DataTable({
    processing: true,
    serverSide: true,
    lengthMenu: [[5, 10, 25, 50, 100], [5, 10, 25, 50, 100]],
    pageLength: 10,
    dom: 'Blfrtip',
    responsive: true,
    fixedHeader: true,
    language: (locale === "fr-fr") ? datatablefr : {
      url: locale == "en-us" ? "" : "/json/locales/datatables/" + locale + ".json"
    },
    ajax: getData,
    order: [[ 0, "desc" ]],
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
      'csvHtml5'
    ],
    initComplete: function(settings, json) {
      var table = settings.oInstance.api();
      prelogs = null;
      if (server_time) {
        $logsDateSync.html(moment(server_time*1000).calendar());
      }
      setInterval( function () {
        //console.warn('relog');
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
            // /!\ No escape security
            column.search(!val.length || val.length == 1 && !val[0].length ? "" : val, true, false).draw();
            var count_after = table.page.info().recordsDisplay;
            if (count_before < 10 && count_after > count_before || count_after < 10) {
              select.selectpicker('toggle');
            }
        });

        var geturlmoduleid = getURLParameter('moduleid');
        if (typeof presynths != 'undefined' && Array.isArray(presynths)) {
          presynths.forEach(function(d, j) {
               if (d != null && typeof d != 'undefined') {
                   select.append('<option value="' + d.name + '"'
                    + (typeof geturlmoduleid != 'undefined' && geturlmoduleid === d.module_id ? "selected" : "")
                    + '>[' + d.module_id + '] ' + d.name + '</option>')
               }
           });
        }
        geturlmoduleid = undefined;
        table
        .on( 'init.dt', function() {
            //show nothing
            setTimeout(function(){
                //show element
                console.log('access to: ', $(this) );
                if (locale === "fr-fr") {
                  select.selectpicker({actionsBox: true}).change();
                } else {
                  $.ajaxSetup({ cache: true });
                  $.getScript('/json/locales/bootstrap-select/defaults-' + locale.split('-')[0] + '_' + locale.split('-')[1].toUpperCase() + '.js')
                  .done(function() {
                    select.selectpicker({actionsBox: true}).change();
                  });
                  $.ajaxSetup({ cache: false });
                }
            }, 0);
        });
      }); /* / Dropdown */
      document.addEventListener("backonline", function(e) {
        //console.warn('back online');
        table.ajax.reload( null, false );
      });
    } // initComplete
  }); // table
  $.ajaxSetup({ cache: false });
}
initTable();
});