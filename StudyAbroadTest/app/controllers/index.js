function doClick(e) {
    $.menu.open();
   } 
function OpenAgenda() {
	var Agenda = Alloy.createController("Agenda").getView();
	Agenda.open();
}

function OpenMap() {
	var Map = Alloy.createController("Map").getView();
	Map.open();
}

function OpenSettings() {
	var Settings = Alloy.createController("Settings").getView();
	Settings.open();
}

$.index.open();