define(['jquery'], function($) {

// Date range filter
minDateFilter = "";
maxDateFilter = "";

$.fn.dataTableExt.afnFiltering.push(
  function(oSettings, aData, iDataIndex) {
    var elem_date = new Date(oSettings.aoData[iDataIndex]._aData.created_at);
    if (typeof aData._date == 'undefined') {
      aData._date = elem_date.getTime();
    }
    if (minDateFilter && !isNaN(minDateFilter)) {
      if (elem_date < new Date(minDateFilter)) {
        return false;
      }
    }

    if (maxDateFilter && !isNaN(maxDateFilter)) {
      if (elem_date > new Date(maxDateFilter)) {
        return false;
      }
    }
    return true;
  });
});