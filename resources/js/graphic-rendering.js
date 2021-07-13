define([
    "jquery",
    "moment",
    "./components/getURLParameter",
    "./components/autorefreshapi",
    "./components/lang",
    "./dependencies/regressive-curve",
    "./components/strcap",
    "./components/moment-fr"
    /* anychart is added dynamically by init.js in anychart-bundle.js */
], function($, moment, getURLParameter, autoReload, lang, regressiveCurve) {
    window.chart = null;
    var $mod_select = $("#graphModuleSelect");
    var $tempsDateSync = $("#temps-date-sync");
    var data = null;
    var is_dry = false;
    var theme = localStorage.getItem("graph-theme") || "darkBlue";
    var active_module_id;
    var interval_var = null;
    var temp_high = 80;
    var temp_xhigh = 90;
    const days_before = 30;
    const days_after = 30;
    let disconnectedEvent = [];
	let connectedEvent = [];
	let noLogIntervals = [];
    var ttt = [[], [], []];

    var t = new URLSearchParams(location.search);

    /* init last update date */
    if (locale != "en-us" && typeof moment_locale !== "undefined") {
        moment.updateLocale(locale.split("-")[0], moment_locale);
    }
    var lastonline = sessionStorage.getItem("logs_time");
    $tempsDateSync.html(moment(lastonline || server_time * 1000).calendar());

    function init() {
        if (chart != null) return; // only one init;
        setModuleSelect();
        setModalTempThresholds();
        autoReload.init({ name: "temps", cb: getTemps });
        getLocalTemps();
    }

    $('#themeSelect option[value="' + theme + '"]').attr(
        "selected",
        "selected"
    );
    $("#themeSelect").on("change", function(e) {
        // recreate chart to reset theme
        theme = this.value;
        onDataReceive();
        localStorage.setItem("graph-theme", this.value);
    });

    function getLocalTemps() {
        var cached_temps = JSON.parse(sessionStorage.getItem("temps") || "{}");
        var cached_events = JSON.parse(
            sessionStorage.getItem("events") || "{}"
        );

        if (!cached_temps.hasOwnProperty(active_module_id)) {
            getTemps();
        } else if (!cached_events.hasOwnProperty(active_module_id)) {
            getEvents();
        } else {
            data = cached_temps[active_module_id];
            setEventGroups(cached_events[active_module_id]);
            onDataReceive(true);
        }
    }

    function getTemps() {
        ttt = [[], [], []];
        //const fromDate = new Date("2018-04-15");
        $.getJSON(
            "/logs/temp/" + active_module_id
        ) /*, { from: fromDate.toJSON(), modules: active_module }*/
            .done(function(_data, a, e) {
                data = _data.temps;
                is_dry = _data.dry;
                if (is_dry) {
                    for (let i = 0; i < data.length; i++) {
                        var _ttt = JSON.parse(data[i].msg);
                        data[i].t 
                        data[i].t1 = _ttt[1];
                        data[i].t2 = _ttt[2];
                        data[i].t3 = _ttt[3];
                    }
                    console.log(data);
                }
                
                // add regressiveCurve to datas
                data = regressiveCurve(data, days_before, days_after, is_dry);

                getEvents();

                var _date = e.getResponseHeader("date");
                var received_date = moment(
                    _date.slice(_date.lastIndexOf(",") + 1)
                );
                $tempsDateSync.html(received_date.calendar());
                sessionStorage.setItem("temps_time", received_date.toJSON());
                //memorize data in cache
                var cached_temps = JSON.parse(
                    sessionStorage.getItem("temps") || "{}"
                );
                cached_temps[active_module_id] = data;
                sessionStorage.setItem("temps", JSON.stringify(cached_temps));
            })
            .fail(function(jqxhr, textStatus, error) {
                // TODO
                console.error("Request Failed: " + error);
            });
    }

    function getEvents() {
        const mod = presynths.find(p => p.id === active_module_id);
        const module_id = mod.module_id;
        $.getJSON("/notifsFor/" + module_id)
            .done(function(events) {
                setEventGroups(events);
                onDataReceive();
                var cached_events = JSON.parse(
                    sessionStorage.getItem("events") || "{}"
                );
                cached_events[active_module_id] = events;
                sessionStorage.setItem("events", JSON.stringify(cached_events));
            })
            .fail(function(jqxhr, textStatus, error) {
                // TODO
                console.error("Request Failed: " + error);
            });
    }

    function setEventGroups(events) {
        const mod = presynths.find(p => p.id === active_module_id);
        connectedEvent = [];
		disconnectedEvent = [];
		noLogIntervals = [];
        events.forEach(event => {
            if (event.type === "NO_LOG") {
				const start = event.created_at.replace(" ", "T");
                let noLogInterval = {start: new Date(start)};
                let time_text = " "  + lang("after") + " "
                + moment.duration(moment(event.resolved ? event.resolved_at : undefined).diff(event.created_at)).humanize();
                disconnectedEvent.push({
                    date: start,
                    description: lang("Module") + " " + mod.name + " " + lang("has been disconnected")
                });
                if (event.resolved) {
					const end = event.resolved_at.replace(" ", "T");
					noLogInterval = {...noLogInterval, end: new Date(end)}
                    connectedEvent.push({
                        date: end,
                        description: lang("Module") + " " + mod.name + " " + lang("has been reconnected") + time_text
                    });
				}
				noLogIntervals.push(noLogInterval);
            }
        });
    }

    function setModuleSelect() {
        active_module_id = +$mod_select.val();
        $mod_select.on("change", function() {
            active_module_id = +$mod_select.val();
            setModalTempThresholds();
            getLocalTemps();
        });
    }

    function setModalTempThresholds() {
        var $modmodalbody = $("#moduleGraphColorModal .modal-body");
        var mod = presynths.find(p => p.id === active_module_id);
        var json = JSON.parse(
            typeof mod.thresholds === "string" && mod.thresholds.length
                ? mod.thresholds
                : "{}"
        );
        temp_high = json.TEMP_HIGH
            ? json.TEMP_HIGH
            : $modmodalbody.data("high");
        temp_xhigh = json.TEMP_CRIT_HIGH
            ? json.TEMP_CRIT_HIGH
            : $modmodalbody.data("xhigh");
        $modmodalbody.find(".temp_high").html(temp_high);
        $modmodalbody.find(".temp_xhigh").html(temp_xhigh);
    }

    function onDataReceive(cached = false) {
        $("#anychart")
            .css("width", window.innerWidth - 30 + "px")
            .css("height", window.innerHeight - 300 + "px");
        if (chart != null) chart.dispose();
        // set theme
        anychart.theme(theme);
        anychart.format.inputLocale("fr-fr");
        anychart.format.outputLocale(locale);
        anychart.format.outputDateTimeFormat("dd MMM");

        var date_options = {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        };

        // create a table
        var dataTable = anychart.data.table("d");

        // add data
        dataTable.addData(data);

        // map data
        var mapping = dataTable.mapAs({ value: "t", x: "d" });

        // create a stock chart
        chart = anychart.stock();
        chart.animation(true);
        chart.crosshair(true);
        chart.title(lang("Evolution of temperatures"));

        // Linear scale (to fix missing point)
		chart.xScale("scatter")
		// Limit number of ticks to prevent overload default
		chart.xScale().ticks([{minor: 'day', major: 'month'}]);
		

        // create the plot
        var plot = chart.plot(0);
        // set grid settings
        plot.yGrid(true)
            .xGrid(true)
			.xMinorGrid(true)
            .legend()
            .titleFormat(function() {
                return (
                    lang("The") +
                    " " +
                    new Date(this.value || this.hoveredDate).toLocaleDateString(
                        locale,
                        date_options
                    )
                );
            })
            .itemsFormat(function() {
                return (
                    this.seriesName +
                    ": " +
                    (this.value ? this.value : "--") +
                    "°C"
                );
            });
        //plot.xAxis().labels().format(function() {return new Date(this.value).toLocaleDateString("fr-FR", date_options)});

        // Add event marker on the chart
		const eventMarkers = plot.eventMarkers();
		
        eventMarkers.group(0, disconnectedEvent).format("🔗").fill("red");
		eventMarkers.group(0).hovered().fill("#ffa1a1").stroke("red", 2);

        eventMarkers.group(1, connectedEvent).format("🔗").fill("green");
		eventMarkers.group(1).hovered().fill("#d1ead9").stroke("green", 2);
		
		// Formating date for events informations
		eventMarkers.tooltip().titleFormat("{%date} {%date}{dateTimeFormat:y} " + lang('at') + " {%date}{dateTimeFormat:H'h'm}");

        var average = plot
            .spline(
                dataTable.mapAs({
                    value: "a",
                    x: "d"
                })
            )
            .name(lang("Average"))
            .stroke(colorForAverage);

            var series = plot
            .spline(mapping)
            .name(getModuleFromId(active_module_id).name)
            .stroke(strokeColorsFct);
        series.hovered().markers(true);

        if (is_dry) {
            
        var t1 = plot
        .spline(
            dataTable.mapAs({
                value: "t1",
                x: "d"
            })
        )
        .name(lang("t1"))
        .stroke(strokeColorsFct);

        var series = plot
        .spline(mapping)
        .name(getModuleFromId(active_module_id).name)
        .stroke(strokeColorsFct);
        var t2 = plot
        .spline(
            dataTable.mapAs({
                value: "t2",
                x: "d"
            })
        )
        .name(lang("t2"))
        .stroke(strokeColorsFct);

        var series = plot
        .spline(mapping)
        .name(getModuleFromId(active_module_id).name)
        .stroke(strokeColorsFct);
        var t3 = plot
        .spline(
            dataTable.mapAs({
                value: "t3",
                x: "d"
            })
        )
        .name(lang("t3"))
        .stroke(strokeColorsFct);

        var series = plot
        .spline(mapping)
        .name(getModuleFromId(active_module_id).name)
        .stroke(strokeColorsFct);
    series.hovered().markers(true);
        }
        // adjust tooltips
        var tooltip = series.tooltip();


        var tooltipchart = chart.tooltip();
        tooltipchart.titleFormat(function() {
            var date = new Date(
                this.x || this.hoveredDate || this.rawHoveredDate
            );
            var transformedDate = date.toLocaleDateString(locale, date_options);
            return lang("The") + " " + transformedDate;
        });

        tooltip.format(function() {
            if (this.value) {
                try {
                    var value = this.value.toFixed(0);
                } catch (e) {
                    var value = "--";
                }
                return lang("temperature").capitalize() + ": " + value + "°C";
            }
        });

        // set Y axis label formatter
        //chart.yScale().minimum(getMinTempOfDataSet(filtered_data) -5);
        //chart.yScale().maximum(getMaxTempOfDataSet(filtered_data) +5);

        // minimap
        var series_minimap = chart.scroller().spline(mapping);
        series_minimap.tooltip().format(function() {
            return date.toLocaleDateString(locale, date_options);
        });

        //Preset zoom option
        const last_date = moment(data[data.length - 1].d).format("YYYY-MM-DD");
        const start_date = moment(last_date)
            .subtract(days_before + days_after, "days")
            .format("YYYY-MM-DD");
        const end_date = moment(last_date)
            .add(days_after, "days")
            .format("YYYY-MM-DD");
        chart.selectRange(start_date, end_date);

        // create range picker
        // var rangePicker = anychart.ui.rangePicker();
        // // init range picker
        // rangePicker.render(chart);

        // // create range selector
        // var rangeSelector = anychart.ui.rangeSelector();
        // // init range selector
        // rangeSelector.render(chart);
        // chart.xAxis().labels().format(function () {
        // 	return new Date(this.value).toLocaleDateString("fr-FR", date_options);
        // });
        // chart.yAxis().labels().format(function () {
        // 	return this.value + '°C';
        // });

        // turn on X Scroller
        // chart.xScroller(true);
        // // turn on Y Scroller
        // chart.yScroller(true);

        // // set container and draw chart
        chart.container("anychart");
        chart.draw();

        //startStream(mapping, dataTable, filtered_data);
    }

    function colorForAverage() {
        let color = "DodgerBlue";
        let dash = "solid";

        if (this.x) {
            color = "cyan";
            if (this.value >= temp_high && this.value < temp_xhigh)
                color = "#ecef17";
            else if (this.value > temp_xhigh) color = "#ee4237";
            const d = new Date(this.x);
            const last_date = new Date(data[data.length - 1].d);
            // change the line style for estimated datas
            if (d > last_date) {
                color = color;
                dash = "5 5";
            }
        }
        return {
            color: color,
            dash: dash
        };
    }

    function strokeColorsFct() {
		var v = this.value;
		const d = new Date(this.x);
        var color = "#2fa85a";
        // color the maximal value
		//if (this.value == this.series.getStat('seriesMax')) return '#94353C';
		
        // color elements depending on the argument
        if (v >= temp_xhigh) color = "#ee4237";
        // 75
		else if (v >= temp_high && v < temp_xhigh) color = "#ecef17"; // 75
		
		noLogIntervals.forEach(interval => {
			if(d > interval.start && d < interval.end)
				color = "0";
		})

        return {
            color: color,
            angle: 90,
            //keys: ['#2fa85a', '#ecef17', '#ee4237'],
            thickness: 3
        };
        // get the default otherwise
        // return this.sourceColor;
    }
    /*
	function startStream(mapping, dataTable, filtered_data) {
		  // set interval of data stream
		clearInterval(interval_var);
		console.warn(filtered_data);
		interval_var = setInterval(function() {
	
		  // append data
	
		  anychart.data.set().append({
			cardId: "1850-00099",
			d: "Sat, 18 Apr 2020 22:16:10 GMT",
			// random value from 1 to 500
			maxtemp : Math.floor((Math.random() * 40)+ 1)
		  });
		}, 2000);
	  };
	
	*/
    /************************************/

    // set X axis labels formatter
    // create custom Date Time scale
    // var dateTimeScale = anychart.scales.dateTime();
    // var dateTimeTicks = dateTimeScale.ticks();
    // dateTimeTicks.interval(0, 6);
    // // apply Date Time scale
    // chart.xScale(dateTimeScale);

    //minimap
    // access labels

    function getModuleFromId(module_id) {
        return presynths.find(function(o) {
            return o.id == module_id;
        });
    }
    /*
	function getMaxDateOfDataSet(dataset) {
		return Math.max.apply(Math, dataset.map(function(o) { return o.date; }))
	}
	function getMaxTempOfDataSet(dataset) {
		return Math.max.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
	}
	function getMinTempOfDataSet(dataset) {
		return Math.min.apply(Math, dataset.map(function(o) { return o.maxtemp; }))
	}
	*/

    return { init: init };
});
