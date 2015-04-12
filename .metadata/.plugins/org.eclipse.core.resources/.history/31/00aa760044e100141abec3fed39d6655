var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController ||{};

function loadComments(_photo_id) {
	
}

$.initialize = function() {
	loadComments();
};

OS_IOS && $.newComentButton.addEventListener("click", handleNewCommentButtonClicked);

function loadComments(_photo_id) {

	var params = {
		photo_id : currentPhoto.id,
		order : '-created_at',
		per_page : 100
	};
	
	var rows = [];	

	comments.fetch({
		data : params,
		success : function(model, response) {
			comments.each(function(comment) {
				var commentRow = Alloy.createController("commentRow", comment);
				rows.push(commentRow.getView());
			});
			
			$.commentTable.data = rows;
		},
		error : function(error) {
			alert('Error loading comments ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}


function doOpen()
{
	if(OS_ANDROID)
	{
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;
		
		activity.onCreateOptionsMenu = function(_event){
			if(actionBar)
			{
				actionBar.displayHomeAsUp = true;
				actionBar.onHomeIconSelected = function(){
					$.getView().close();
				};
			}
			else{
				alert("No Action Bar Found");
			}
		};
		
		var menuItem = _event.menu.add(
			{
				title: "New Comment",
				showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
				icon: Ti.Android.R.drawable.ic_menu_edit
			}
		);
		
		menuItem.addEventListener("click", function(e){
			handleNewCommentButtonClicked();
		});
	}
}

function handleNewCommentButtonClicked(_event) {
	var navWin;
	
	var inputController = Alloy.createController("commentInput", {
		photo : currentPhoto,
		parentController : $,
		callback : function(_event) {
			inputController.getView().close();
			inputCallback(_event);
		}
	});

	inputController.getView().open();
}

