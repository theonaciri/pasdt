define(['jquery'], function($) {

// Date range filter
minDateFilter = "";
maxDateFilter = "";

function getTemp(oSettings, iDataIndex) {
    $temp = $('#' + oSettings.nTable.id + ' .select-temp input');
    //var tempstr = oSettings.aoPreSearchCols[3].sSearch;
    var tempstr = $temp.val();
    if (typeof tempstr == 'undefined' || !tempstr || !tempstr.length) return true;
    var tempval = Number(tempstr);
    var maxtemp = oSettings.aoData[iDataIndex]._aData.maxtemp;
    if (maxtemp == null) return false;
    maxtemp = Number(maxtemp);
    return maxtemp >= tempval;
}

$.fn.dataTableExt.afnFiltering.push(
  function(oSettings, aData, iDataIndex) {
    var ret = getTemp(oSettings, iDataIndex);
    if (oSettings.nTable.id !== 'main-table' ) return ret;
    var elem_date = oSettings.aoData[iDataIndex]._aData.created_at;
    if (typeof minDateFilter == 'string' && minDateFilter.length) {
      if (!elem_date || elem_date <= minDateFilter) {
        return false;
      }
    }

    if (typeof maxDateFilter == 'string' && maxDateFilter.length) {
      if (!elem_date || elem_date >= maxDateFilter) {
        return false;
      }
    }
    return ret;
  });
});