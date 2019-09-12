function initNopingButtons(table) {
	//timeout for whatever reason datatables is not initialised
	//setTimeout(function(){ 	ext_search(table, $("#noday"), false);
		$("#noday").click(function(e, a, b) {
			ext_search(table, $(e.currentTarget), true);
		});
	//}, 10);
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
            	return data[3] != 'Day' && data[3] != 'Ack';
        	} else {
        		return true;
        	}
        }
    );
    table.draw();
    $.fn.dataTable.ext.search.pop();
}

window.initNopingButtons = initNopingButtons;