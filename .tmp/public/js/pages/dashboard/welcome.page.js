parasails.registerPage('welcome', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    modal: '',
    pageLoadedAt: Date.now()
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {

    this._initTable();
  },

  //  ╦  ╦╦╦═╗╔╦╗╦ ╦╔═╗╦    ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ╚╗╔╝║╠╦╝ ║ ║ ║╠═╣║    ╠═╝╠═╣║ ╦║╣ ╚═╗
  //   ╚╝ ╩╩╚═ ╩ ╚═╝╩ ╩╩═╝  ╩  ╩ ╩╚═╝╚═╝╚═╝
  // Configure deep-linking (aka client-side routing)
  virtualPagesRegExp: /^\/welcome|table\/?([^\/]+)?\/?/,
  afterNavigate: async function(virtualPageSlug){
    // `virtualPageSlug` is determined by the regular expression above, which
    // corresponds with `:unused?` in the server-side route for this page.
    switch (virtualPageSlug) {
      case 'hello':
      this.modal = 'example';
      break;
      default:
      this.modal = '';
    }
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _initTable() {
      console.log('init');
      $(document).ready( function () {
        // Setup - add a text input to each footer cell
        $('#main-table tfoot th').each( function () {
          var title = $(this).text();
          $(this).html( '<input type="text" placeholder="Rechercher '+title+'" />' );
        } );

        var table = $('#main-table').DataTable({
          // dropdown
          initComplete: function () {
            // Dropdown
            this.api().columns([1, 2, 3]).every( function () {
              var column = this;
              var select = $('<select class="individual-search"><option value=""></option></select>')
              .appendTo( $(column.footer()).empty() )
              .on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                console.warn('a', '^'+val+'$', 'b', val);
                console.warn('this', this);
                console.warn('column ', column);
                column.search( val ? '^'+val+'$' : '', true, false ).draw();
              } );

              column.data().unique().sort().each( function ( d, j ) {
                select.append( d +"\n")
              } );
            } );
          },

          language: {
            processing:     "Traitement en cours...",
            search:         "Rechercher&nbsp;partout&nbsp;:",
            lengthMenu:     "Afficher _MENU_ &eacute;l&eacute;ments",
            info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
            infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            infoPostFix:    "",
            loadingRecords: "Chargement en cours...",
            zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
            emptyTable:     "Aucune donnée disponible dans le tableau",
            paginate: {
              first:      "Premier",
              previous:   "Pr&eacute;c&eacute;dent",
              next:       "Suivant",
              last:       "Dernier"
            },
            aria: {
              sortAscending:  ": activer pour trier la colonne par ordre croissant",
              sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
          },
          "ajax": {
            "url": "/data/dump.json",
            "dataSrc": ""
          },
          "order": [[ 0, "desc" ]],
          "columns": [
         // {"data": "id"},

          {"data": "created_at"},
          {"data": "cardId"},
          //{"data": "msgId"},
          {"data": "eventType"},
          {"data": "msg"}
          //{"data": "options"},
          //{"data": "updated_at"},
        ]
      });
        // Search bar
    table.columns([0]).every( function () {
      var that = this;

      $( 'input', this.footer() ).on( 'keyup change clear', function () {
      console.log('this ', this, ' that ', that);
        if ( that.search() !== this.value ) {
      console.log([1]);
          if (false && [1].includes(that.selector.cols)) {
            that
            .search(`^${this.value}$`, true, false )
            .draw();
          } else {
            that
          .search(this.value)
          .draw();
          }
        }
      } );
    } );

var filteredData = table
    .column( 3 )
    .data()
    .filter( function ( value, index ) {
      console.warn('testing for ', value, index);
        return value != '["DAY"]' ? true : false;
    } );
console.log('F', filteredData);

$.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
      
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

    });
      /*
      var table = new KingTable({
        element:  document.getElementById("main-table"),
        url: "/data/dump.json",
        sortBy: "id",
        columns: {
          options: {
            secret: 1
          }
        }
      });

      table.render();
      table.on("fetch:done", function(e) {
      });
      console.log('table', table);
      */


    },
    clickOpenExampleModalButton: async function() {
      this.goto('/welcome/hello');
      // Or, without deep links, instead do:
      // ```
      // this.modal = 'example';
      // ```
    },

    closeExampleModal: async function() {
      this.goto('/welcome');
      // Or, without deep links, instead do:
      // ```
      // this.modal = '';
      // ```
    },

  }
});
