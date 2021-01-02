// credit to https://yagisanatode.com/2018/05/26/how-to-hide-a-row-based-on-a-cell-value-in-google-sheets-with-filter-or-google-apps-script/ for the base script to hide a row based on cell value.
// onOpen(e) and some of onEdit(e) is from the above. the rest was created by Jacob Grover.
//**GLOBALS**
// Sheet the data is on.
var SHEET = "Orders";
// The value that will cause the row to hide. 
var VALUE = true;
// The column we will be using 
var PICKED_UP_COL = 10;
var ORDER_FORM_COL = 5;
var SORT_BY_COL = 5;

var DATE_LOCATION_OFFSET = [0,-4];
 
function onEdit(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  
  //Ensure on correct sheet.
  if(SHEET == activeSheet.getName()){
    
    var cell = ss.getActiveCell()
    var cellValue = cell.getValue();
    
    //Ensure we are looking at the correct column.
    if(cell.getColumn() == PICKED_UP_COL){
      //If the cell matched the value we require,hide the row. 
      if(cellValue == VALUE){
        activeSheet.hideRow(cell);
      };
    };
    
    if(cell.getColumn() == ORDER_FORM_COL) {
      var dateTimeCell = cell.offset(DATE_LOCATION_OFFSET[0], DATE_LOCATION_OFFSET[1]);
      dateTimeCell.setValue(new Date());
    };
    
    if(cell.getColumn() == SORT_BY_COL) {
      var range = activeSheet.getRange("A2:J199");
      range.sort([{column: SORT_BY_COL, ascending: false}, {column: 1, ascending: true}]);
    }
  };
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Previous Orders')
  .addItem('Show All Completed Orders', 'showCompleted')
  .addItem('Rehide Completed Orders', 'hideCompleted')
  .addToUi();
}
 
function showCompleted(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  
  //Ensure on correct sheet.
  if(SHEET == activeSheet.getName()){
    var lastRow = activeSheet.getLastRow();
    var range = activeSheet.getRange(2,PICKED_UP_COL, lastRow-1, 1);
    var range_values = range.getValues();
    for(var i=0;i < lastRow-1; i++) {
      if(range_values[i][0] == VALUE) {
        ss.unhideRow(range.getCell(i+1, 1));
      }
    }
  }
}

function hideCompleted(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  
  if(SHEET == activeSheet.getName()) {
    var lastRow = activeSheet.getLastRow();
    var range = activeSheet.getRange(2,PICKED_UP_COL, lastRow-1, 1);
    var range_values = range.getValues();
    for(var i=0; i<lastRow-1;i++) {
      if(range_values[i][0] == VALUE) {
        ss.hideRow(range.getCell(i+1, 1));
      }
    }
  }
}
