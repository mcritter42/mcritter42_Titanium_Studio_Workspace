var args = arguments[0] || {};

$.closeBtn.addEventListener("click", function(){
	$.detailWindow.close();
});

$.car.set(arg.data);

$.detailWindow.addeventListener("close", function(){
	$.destroy();
});