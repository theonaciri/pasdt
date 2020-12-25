define(["jquery", "moment"], function($, moment) {

	function autorefresh(options) {
		var opt = {
			url: null,
			type: "GET",
			data: {},
			timeout: 10,
			name: "online",
			refresh_time: 5 * 60,
			refresh_btn_time: 30,
			cb: console.log,
			cb_err: console.error,
			cb_on_back_online: $.noop,
			cb_on_offline: $.noop,
			interval_refresh: undefined
		}
		$.extend(opt, options);

		document.addEventListener("backonline", opt.cb_on_back_online);
		var seconds_offline = moment().diff(moment(sessionStorage.getItem(opt.name + '_time') || server_time * 1000), "seconds");
		opt.$refresh_btn = $("#" + opt.name + "-refresh-btn")
		.on('click', function(e) { setRefreshInterval(opt); });

		if (seconds_offline >= opt.refresh_btn_time) {
			opt.$refresh_btn.attr('disabled', false);
		} else {
			setTimeout(function() {
				opt.$refresh_btn.attr('disabled', false);
			}, Math.min(opt.refresh_btn_time - seconds_offline) * 1000);
		}

		// Lancer au plus tard dans ~5 mins.
	    setTimeout(function() { 
	    	setRefreshInterval(opt);
	  }, Math.max(opt.refresh_time - seconds_offline, 0) * 1000);
	}

	function setRefreshInterval(opt) {
		clearInterval(opt.interval_refresh);
		opt.interval_refresh = setInterval( function () { // Boucle refresh de 5min
	      	resetRefreshBtn(opt);
      	}, opt.refresh_time * 1000 );
		resetRefreshBtn(opt);
	}

	function resetRefreshBtn(opt) {
		opt.$refresh_btn.attr('disabled', true);
		setTimeout(function() {
			opt.$refresh_btn.attr('disabled', false);
		}, opt.refresh_btn_time * 1000);
		opt.cb(opt.data);
	}

	return {
		init: autorefresh
	};
});