var args = arguments[0] || {};

OS_IOS &&
$.cameraButton.addEventListener("click", function(_event)
	{
		$. cameraButtonClicked(_event);
	}
);

$.cameraButtonClicked = function(_event){
	alert("User clicked camera button");
};