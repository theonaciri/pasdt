define(["jquery", "./components/lang", "flat", "./dependencies/jquery.ajaxSubmit", "./bootstrap",
		"./components/delete-user", "./blogarticles"],
	function ($, lang, flatten) {
		if (window.location.pathname.indexOf("admin") < 0) return;
		var company_modules = [];
		$('#edit-user-modal').on('shown.bs.modal', function (e) { })

		$(document).ready(function () {
			// bind 'myForm' and provide a simple callback function 
			$('#createCompany').ajaxSubmit({
				success: function (company) {
					$('#createCompanyModal').modal('hide');
					console.log(company);
					let htmlcontent = '';
					htmlcontent += '<tr class="highlight" data-id="' + company.id.toString() + '"><td class="logo" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title="' + lang("Modify the logo") + ' ' + lang("of") + ' ' + company.name + '">';
					if (company.logo) {
						htmlcontent += '<img src="images/companylogos/' + company.logo + '" height="39" alt="' + company.name + '" />';
					}
					htmlcontent += '</td><td class="colors" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title="' + lang("Modify the logo") + ' ' + lang("of") + ' ' + company.name + '">';
					if (company.colors) {
						htmlcontent += '<div style="width: 39px; height: 39px; border-radius: 5px; background-color:' + company.colors + '"></div>';
					}
					htmlcontent += '</td><td class="name" style="cursor:pointer" data-toggle="tooltip" data-placement="top" title="' + lang("Modify the logo") + ' ' + lang("of") + ' ' + company.name + '">' + company.name + '</td><td><button type="button" data-id="' + company.id.toString() + '" title="' + lang("See") + '" name="see" class="btn btn-primary companybtn" data-toggle="modal" data-target="#companyUsersModal"><span class="oi oi-people"></span></button></td><td><button type="button" data-id="' + company.id.toString() + '" title="' + lang("Modify") + '" name="modify" class="btn btn-primary companymodulesbtn" data-toggle="modal" data-target="#company-modules-modal"><span class="oi oi-box"></span></button></td><td><button type="button" data-id="' + company.id.toString() + '" title="' + lang("Delete") + '" name="delete" class="btn btn-danger companydeletebtn" data-toggle="modal" data-target="#company-delete-modal"><span class="oi oi-circle-x"></span></button></td></tr>';
					$('#adminTable tbody').append(htmlcontent);
				}
			});
		});

		$('.revoqbtn').click(function (e) {
			var id = $(this).parent().siblings('.id').html();
			var $p = $(this).parent();
			var n = $p.siblings('.name').html();
			if (confirm(lang("Delete the account of ") + n + ' ?')) {
				location.href = '/user/delete/' + id;
			}
		});

		$('.modifbtn').click(function (e) {
			var $p = $(this).parent();
			var id = $p.siblings('.id').html();
			$('#name').val($p.siblings('.name').html());
			$('#email').val($p.siblings('.email').html());
			//$('#name').val($p.siblings('.name').html());

		});


		$('#colors').on('change', function (e) {
			$('body').css('background-color', $(this).val());
		})

		$('#adminTable td.logo').click(function () {
			location.href = "/client?company=" + $(this).parent().data('id') + "#customize-client";
		});
		$('#adminTable td.colors').click(function () {
			location.href = "/client?company=" + $(this).parent().data('id') + "#customize-client";
		});
		$('#adminTable td.name').click(function () {
			location.href = "/consultation?company=" + $(this).parent().data('id');
		});

		$('.companybtn').click(function (e) {
			var id = $(this).data('id');
			var companyname = $(this).parent().siblings('.name').html();

			$.getJSON("/company/" + id + "/users", function (users) {
				$mod = $('#companyUsersModal');
				$mod.modal("show");
				$mod.find('.modal-title > span').html(companyname);
				console.log(users)
				var htmlcontent = '';
				for (var i = 0; i < users.length; i++) {
					htmlcontent +=
					`<tr ${users[i].is_client_company ? 'class="highlight"' : ''}>
						<td class="name">${users[i].name}</td>
						<td class="email">${users[i].email}</td>
						<td class="button">
							<div class="btn-group btn-vertical" role="group" aria-label="user buttons">
								<a title="${lang("Modify")}" name="modify" class="btn btn-vertical btn-primary"
								href="/client?company=${id}#user${users[i].id}">
									<span class="oi oi-pencil"></span>
								</a>
								<a class="btn btn-danger deleteLink" title="${lang("Delete")}" href="/user/delete/${users[i].id}">
									<span class="oi oi-circle-x"></span>
								</a>
							</div>
						</td>
					<tr>`

				}
				$mod.find('tbody').html(htmlcontent);
			});
			$("#btnAddUser").attr("href", "/register?company=" + id);
		});

		$('.companymodulesbtn').click(function (e) {
			var company_id = $(this).data('id');
			var companyname = $(this).parent().siblings('.name').html();
			$('#company_id').val(company_id);
			$.getJSON("/company/" + company_id + "/modules", function (_modules) {
				company_modules = _modules;
				$mod = $('#companyModulesModal');
				$mod.modal("show");
				$mod.find('.modal-title > span').html(companyname);
				$("#linkmodule").ajaxSubmit({
					url: function () {
						return '/company/' + company_id + '/module/' + $('#selectLinkModule').val();
					},
					success: function (e) {
						$(this).find(`option[value="${$('#selectLinkModule').val()}"]`).remove();
						$('#moduleTable tbody').append(moduleTableTr(e));
					}
				});
				var htmlcontent = '';
				for (var i = 0; i < company_modules.length; i++) {
					htmlcontent += moduleTableTr(company_modules[i]);
				}
				$mod.find('tbody').html(htmlcontent);
			})
		});

		$('.companydeletebtn').click(function (e) {
			var company_id = $(this).data('id');
			var companyname = $(this).parent().siblings('.name').html();
			$('#company_id').val(company_id);
			if (confirm(lang("Delete the company ") + $("<div/>").html(companyname).text() + " ?")) {
				$.ajax({
					type: "DELETE",
					url: "/company/" + company_id,
					dataType: "json",
				}).done(function (response) {
					if (response.ok) {
						$('#adminTable tr[data-id="' + company_id + '"]').remove();
					} else if (response.error) {
						var err = "";
						if (response.modules && response.modules.length) {
							err += lang("Please move") + lang(response.modules.length === 1 ? " this module" : " these modules") + lang(" to another group");
							for (var mod = 0; mod < response.modules.length; mod++) {
								err += (!mod ? " " : ", ") + response.modules[mod].name;
							}
							err += ". ";
						}
						if (response.users && response.users.length) {
							err += lang("Please move") + lang(response.modules.length === 1 ? " this user" : " these users") + lang(" to another group");
							for (var user = 0; user < response.users.length; user++) {
								err += (!user ? " " : ", ") + response.users[user].name;
							}
							err += ".";
						}
						alert(err);
					}
				});
			}
		});

		function moduleTableTr(module) {
			return `<tr data-id="${module.id}">
            		<td class="name">${module.name}</td>
            		<td class="telit_id">${module.telit_id}</td>
            		<td class="module_id">${module.module_id}</td>
            		<td class="details">
	            		<div class="btn-group btn-vertical" role="group" aria-label="user buttons">
	            			<button type="button" data-id="${module.id}" title="${lang('Details')}" name="details" class="btn btn-primary telitmodulebtn" data-toggle="modal" data-target="#moduleModal"><span class="oi oi-eye"></span></button>
	            			<button type="button" data-id="${module.id}" title="${lang('Modify the module')}" name="modify" class="btn btn-primary telitmoduleeditbtn" data-company="${module.company_id}" data-toggle="modal" data-target="#editModuleModal">
	            				<span class="oi oi-pencil"></span>
	            			</button>
	            			<button type="button" data-id="${module.id}" title="${lang('Unlink the module')}" name="unlink" class="btn btn-danger telitmoduleunlinkbtn" data-company="${module.company_id}"><span class="oi oi-link-broken"></span></button>
	            		</div>
	            	</td>
            	</tr>`
		}

		$('body').on("click", '.telitmoduleunlinkbtn', function (e) {
			var csrf = $("input[name='_token']").first().val();
			var $self = $(this);
			$.ajax({
				url: "/company/" + $self.data('company') + "/module/" + $self.data('id') + "/unlink",
				type: "PUT",
				data: { "_token": csrf }
			}).done(function (e) {
				$self.parent().parent().parent().remove();
				$('#selectLinkModule').append(`<option value="${e.id}">${e.name}</option>`);
			});
		});

		$("#addModule").ajaxSubmit({
			success: function (e) {
				$('#addModule input, #addModule textarea').val('');
				$('#selectLinkModule').append(`<option value="${e.id}">${e.name}</option>`);
				$("#unlinkedLogTable").find('tr[data-id="' + e.telit_id + '"]').remove();
			}
		});
		$("#editModule").ajaxSubmit({
			success: function (mod) {
				$('#editModuleModal').modal('hide')
				var $mod = $('#moduleTable tr[data-id="' + mod.id + '"');
				$mod.children('td.name').html(mod.name);
				$mod.children('td.telit_id').html(mod.telit_id);
				$mod.children('td.module_id').html(mod.module_id);

				var index = company_modules.findIndex(function (e) { return e.id == mod.id });
				company_modules[+index] = mod;
			}
		});

		$('body').on('click', '.telitmodulebtn', function (e) {
			var id = $(this).attr('data-id');
			var mod = company_modules.find(function (e) { return e.id == id });
			if (typeof mod == 'undefined') return; // TODO: ERROR MSG

			var modulename = $(this).parent().parent().siblings('.name').html();
			var json = JSON.parse(mod.telit_json && mod.telit_json.length ? mod.telit_json : '{}');
			var f = flatten(json);
			var table = '<table><tr><th scope="col">' + lang("Key") + '</th><th scope="col">' + lang("Value") + '</th></tr>';
			for (p in f) {
				table += `<tr><td>${p}</td><td>${f[p]}</td></tr>\n`;
			}
			var str_address = formatAdress(json.locAddress);
			var $modmodal = $('#moduleModal');
			$modmodal.find('.toggle-map').toggle(!!str_address.length).attr('data-loc', str_address);
			$modmodal.find('.modal-map').html('');
			$modmodal.find('.modal-pre').html(table + "</table>");
		});


		// EDIT Module
		$('body').on('click', '.telitmoduleeditbtn', function (e) {
			var id = $(this).data('id');
			var company = $(this).data('company');
			var mod = company_modules.find(function (e) { return e.id == id });
			if (typeof mod == 'undefined') return; // TODO: ERROR MSG

			var modulename = $(this).parent().parent().siblings('.name').html();
			$form = $('#editModule');
			$form.find('#editmodulename').val(modulename);
			$form.find('#edittelit_json').val(mod.telit_json);
			$form.find('#editpasdt_module_number').val(mod.module_id);
			$form.find('#edittelit_number').val(mod.telit_id);
			$form.attr('action', "/module/" + id);
		});

		$('.toggle-map').click(function (e) {
			$(this).hide('fast').siblings('.modal-map').html(`<iframe width="100%" height="450" frameborder="0" style="border:0"
	src="https://www.google.com/maps/embed/v1/search?q=${$(this).data('loc')}&key=AIzaSyC-PpGeJv_tmROsmyi8ZS3p5UY0dsb9wMQ" allowfullscreen></iframe>`);
		})

		function formatAdress(a) {
			if (typeof a == 'undefined') return '';
			return escape(`${a.streetNumber} ${a.city} ${a.state} ${a.zipCode} ${a.country}`);
		}

		$('textarea').on('change paste keyup', function (e) {
			try {
				var j = JSON.parse($(this).val());
				if (typeof j != 'undefined') {
					$form = $(this).parent().parent();
					if (typeof j.custom1 != 'undefined')
						$form.find('input[name="name"]').val(j.custom1);
					if (typeof j.iccid != 'undefined')
						$form.find('input[name="telit_number"]').val(j.iccid);
					if (typeof j.custom2 != 'undefined')
						$form.find('input[name="pasdt_module_number"]').val(j.custom2);
				}
			} catch (e) {
				console.warn('not json');
			}
		});

});