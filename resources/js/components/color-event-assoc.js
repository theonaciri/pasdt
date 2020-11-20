define(["./lang"], function(lang) {
	return [
	  {name: lang('temperature') + ' 1',   value: '1', class: 'dt-grey'},
	  {name: lang('temperature') + ' 2',   value: '2', class: 'dt-red'},
	  {name: lang('defaut pression'), value: '3', class: 'dt-blue'},
	  {name: lang('defaut gaz'),      value: '4', class: 'dt-green'},
	  {name: lang('defaut pression') + ' * ' + lang('defaut temperature') + ' 1',      value: '5', class: 'dt-black'},
	  {name: lang('defaut temperature') + ' 2 * ' + lang('defaut temperature') + ' 1', value: '6', class: 'dt-black'},
	  {name: '',                value: '7', class: 'dt-black'}
	];
})

/*

define([], function() {
	return [
	  {name: 'temperature 1',   value: '1', class: 'dt-grey'},
	  {name: 'temperature 2',   value: '2', class: 'dt-red'},
	  {name: 'defaut pression', value: '3', class: 'dt-blue'},
	  {name: 'defaut gaz',      value: '4', class: 'dt-green'},
	  {name: 'defaut pression * defaut temperature 1',      value: '5', class: 'dt-black'},
	  {name: 'defaut temperature 2 * defaut temperature 1', value: '6', class: 'dt-black'},
	  {name: '',                value: '7', class: 'dt-black'}
	];
})

*/