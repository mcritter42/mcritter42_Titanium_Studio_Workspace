var tbl_data = 
[

];

for(var i =0; i <10; i++){
	var tvr = Ti.UI.createTableViewRow({
		height: 'auto',
		backgroundColor: 'transparent'
	});
	
	var view = Titanium.UI.createView({
  backgroundColor:'white',
  left: '10',
  right: '10',
  height: '100', 
  bottom: '20'
});

var lable = Ti.UI.createLabel({
	title: 'row' + i, 
	backgroundColor: 'grey'
});

tvr.add(view);

view.add(lable);

tbl_data.push(tvr);

}

$.TV.setData(tbl_data);

$.index.open();
