function initNopingButtons(table) {
	//timeout for whatever reason datatables is not initialised
		$("#noday").click(function(e) {
			ext_search(table, $(e.currentTarget), true);
		});
		/*$('body').click(function(e) {
			if (e.target.id === "noday") return ;
			ext_search(table, $("#noday"), false);
		})*/
		setTimeout(function(){
			ext_search(table, $("#noday"), false);
		}, 100);
}

function ext_search(table, $target, toggle) {
	var togglevalue = localStorage.getItem('noping') == "true";
	togglevalue = toggle ? !togglevalue : !!togglevalue;
	console.log('toogle', togglevalue);
	localStorage.setItem('noping', togglevalue);
	$target.toggleClass('btn-dark', togglevalue);
	$.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
        	if (togglevalue) {
            	return data[3] != 'Day' && data[3] != 'Ack' && data[3] != 'Test';
        	} else {
        		return true;
        	}
        }
    );
    table.draw();
    $('#main-table').find('.th-message').html(togglevalue ? 'Anomalies' : 'Message');
    $('#main-table').find('.th-input-message input').attr('placeholder', togglevalue ? 'Rechercher Anomalie' : 'Rechercher Message');
    $.fn.dataTable.ext.search.pop();
}


window.initNopingButtons = initNopingButtons;