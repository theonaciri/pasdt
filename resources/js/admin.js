define(["jquery", "flat", "./dependencies/jquery.ajaxSubmit", "./bootstrap"], function($, flatten) {
    if (!window.location.pathname.includes("admin")) return ;
    var modules = [];
	$('#edit-user-modal').on('shown.bs.modal', function (e) {


	})

	$('.revoqbtn').click(function(e) {
		var id = $(this).parent().siblings('.id').html();
		var $p = $(this).parent();
		var n = $p.siblings('.name').html();
		if (confirm('Supprimer le compte de ' +  n + ' ?')) {
			console.log('should delete', id);
			location.href='/user/delete/' + id;
		}
	});

	$('.modifbtn').click(function(e) {
		var $p = $(this).parent();
		var id = $p.siblings('.id').html();
		$('#name').val($p.siblings('.name').html());
		$('#email').val($p.siblings('.email').html());
		//$('#name').val($p.siblings('.name').html());

	});


	$('#colors').on('change', function(e) {
		$('body').css('background-color', $(this).val());
	})


	$('.companybtn').click(function(e) {
		var id = $(this).attr('data-id');
		console.warn('clicked', id);
		var companyname = $(this).parent().siblings('.name').html();
		$.getJSON("/company/"+id+"/users", function(users) {
			console.warn('res', users);
            $mod = $('#companyUsersModal');
            $mod.modal("show");
            $mod.find('.modal-title').html("Liste d'utilisateurs de " + companyname);
            var htmlcontent = '';
            for (var i = 0; i < users.length; i++) {
            	htmlcontent +=
            	`<tr ${users[i].is_client_company ? 'class="highlight"' : ''}>
            		<td class="name">${users[i].name}</td>
            		<td class="email">${users[i].email}</td>
            	 <tr>`
            }
            $mod.find('tbody').html(htmlcontent);
        })
    });

	$('.companymodulesbtn').click(function(e) {
		var id = $(this).attr('data-id');
		console.warn('clicked', id);
		var companyname = $(this).parent().siblings('.name').html();
		$('#companyid').val(id);
		$.getJSON("/company/"+id+"/modules", function(_modules) {
			console.warn('res', _modules);
			modules = _modules;
            $mod = $('#companyModulesModal');
            $mod.modal("show");
            $mod.find('.modal-title').html("Liste de modules de " + companyname);
            $mod.find('')
            var htmlcontent = '';
            for (var i = 0; i < modules.length; i++) {
            	htmlcontent +=
            	`<tr ${modules[i].is_client_company ? 'class="highlight"' : ''}>
            		<td class="name">${modules[i].name}</td>
            		<td class="email">${modules[i].card_number}</td>
            		<td class="details"><button type="button" data-id="${modules[i].id}" title="Détails" name="Détails" data-json="${modules[i].telit_json}" class="btn btn-primary telitmodulebtn" data-toggle="modal" data-target="#moduleModal">M</button></td>
            	 </tr>`
            } 
            $mod.find('tbody').html(htmlcontent);
        })
    });

    $("#addModule").ajaxSubmit({
		success: function(e) {
			console.warn('success', e);
		}
	});

	$('body').on('click', '.telitmodulebtn', function(e) {
		var id = $(this).attr('data-id');
		var mod = modules.find(function(e) {return e.id = id});
		if (typeof mod == 'undefined') return; // TODO: ERROR MSG

		var modulename = $(this).parent().siblings('.name').html();
		var json = JSON.parse(mod.telit_json);
		var f = flatten(json);

	    var table = '<table><tr><th>Clé</th><th>Valeur</th></tr>';
	    for (p in f) {
	      table += `<tr><td>${p}</td><td>${f[p]}</td></tr>\n`;
	    }
	    $('#moduleModal').find('.modal-map').html(`<iframe width="100%" height="450" frameborder="0" style="border:0"
	src="https://www.google.com/maps/embed/v1/search?q=${formatAdress(json.locAddress)}&key=AIzaSyC-PpGeJv_tmROsmyi8ZS3p5UY0dsb9wMQ" allowfullscreen></iframe>`);
	    $('#moduleModal').find('.modal-pre').html( table + "</table>");
	});

	function formatAdress(a) {
	  return escape(`${a.streetNumber} ${a.city} ${a.state} ${a.zipCode} ${a.country}`);
	}

});	