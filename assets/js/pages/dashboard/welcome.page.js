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
          $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
        } );

        var table = $('#main-table').DataTable({
          // dropdown
          initComplete: function () {
            this.api().columns([1,  4]).every( function () {
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
                select.append( '<option value="'+d.replace(/["']/g,  "")+'">'+d+'</option>' )
              } );
            } );
          },

          language: {
            processing:     "Traitement en cours...",
            search:         "Rechercher&nbsp;:",
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
          "columns": [
          {"data": "id"},
          {"data": "cardId"},
          {"data": "msgId"},
          {"data": "msg"},
          {"data": "eventType"},
          //{"data": "options"},
          {"data": "created_at"},
          {"data": "updated_at"},
        ]
      });
    table.columns([0, 2, 3, 5, 6]).every( function () {
      var that = this;
      $( 'input', this.footer() ).on( 'keyup change clear', function () {
      console.log('this ', this, ' that ', that);
        if ( that.search() !== this.value ) {
          if ([0].includes(that.selector.cols)) {
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
