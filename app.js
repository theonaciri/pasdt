/*
import KingTable from "kingtable";
import KingTableUtils from "kingtable/utils";
*/

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
	console.warn('yo man', e);
});
console.log('table', table);