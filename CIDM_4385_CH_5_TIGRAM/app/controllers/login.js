var args = arguments[0] || {};

$.parentController = args.parentController;

$.showLoginBtn.addEventListener('click', showLoginBtnClicked);
$.showCreateAccountBtn.addEventListener('click', showCreateAccountBtnClicked);
$.cancelCreateAcctBtn.addEventListener('click', cancelActionButtonClicked);
$.cancelLoginBtn.addEventListener('click', cancelActionButtonClicked);


$.doLoginBtn.addEventListener('click', doLoginBtnClicked);
$.doCreateAcctBtn.addEventListener('click', doCreateAcctBtnClicked);


$.showLoginFBBtn.addEventListener('click', doFacebookLoginAction);

/* EVENT HANDLERS 
 *  
 * Here are all of the event handlers
 */
function showLoginBtnClicked() {

	$.createAcctView.hide();
	$.homeView.hide();
	$.loginView.show();
};

function showCreateAccountBtnClicked() {
	$.createAcctView.show();
	$.homeView.hide();
	$.loginView.hide();
};

function cancelActionButtonClicked() {
	$.createAcctView.hide();
	$.loginView.hide();


	Alloy.Globals.loggedIn = false;

	$.homeView.show();
}

/**
 *
 * @param {Object} _event
 */
function faceBookLoginEventHandler(_event) {

	Alloy.Globals.FB.removeEventListener('login', faceBookLoginEventHandler);

	if (_event.success) {
		doFacebookLoginAction(_event.data);
	} else if (_event.error) {
		alert(_event.error);
	} else {
		_event.cancelled && alert("User Canceled");
	}
};

/**
 * A fairly simple means of handling whichever type of error occurs when
 * doing a FB login.
 * @param {Object} _user
 * @param {Object} _error
 */
function faceBookLoginErrorHandler(_user, _error) {
	
	alert("Error: " + _error.code + " " + _error.message);

	Alloy.Globals.loggedIn = false;
	Alloy.Globals.CURRENT_USER = null;
};

/**
 * Logs into facebook to obtain an access token which is then passed to ACS.
 * 
 * @param {Object} _options data from FB login
 */
function doFacebookLoginAction(_options) {
	
	var FB = Alloy.Globals.FB;

	//if not logged in
	if (FB.loggedIn === false) {

		/// Enabling single sign-on using FB
		FB.forceDialogAuth = false;

		// get the app id
		// this is something you set through facebook as a developer
		// while the text is not very detailed about this, you must get this first
		FB.appid = Ti.App.Properties.getString("ti.facebook.appid");

		// set permissions
		//FB.permissions = ["basic_info","email" ];
		FB.permissions = ["read_stream"];

		// login handler with callback
		FB.addEventListener("login", faceBookLoginEventHandler);

		// attempt to authorize user
		FB.authorize();

	} else {
		
		//we are logged in with Facebook
		var user = Alloy.createModel('User');
		
		//use the newly created user object (Alloy Model) to update the login status
		user.updateFacebookLoginStatus(FB.accessToken, {
			success : function(_resp) {

				//establish in the properties store that we've logged in with FB
				Ti.App.Properties.setString("loginType", "FACEBOOK");

				Alloy.Globals.loggedIn = true;
				//this will come from ACS
				Alloy.Globals.CURRENT_USER = _resp.model;

				// save the newly created facebook user
				if (_options.email !== undefined) {
					_resp.model.save(
						{
						"email" : _options.email,
						"username" : _options.username
						}, 
						{
							success : function(_user, _response)
							{
								$.parentController.loginSuccessAction(_resp);
								Alloy.Globals.CURRENT_USER = _user;
							},
							error : faceBookLoginErrorHandler
						}
					);
				} else {
					$.parentController.loginSuccessAction(_resp);
				}
			},
			error : faceBookLoginErrorHandler
		});
	}
}

/**
 * Utility method for handling the async callback when ACS responds 
 * to using the cloud login method. 
 * @param {Object} _resp
 */
function userActionResponseHandler(_resp) {
	if (_resp.success === true) {

		// Do stuff after successful login.
		Alloy.Globals.loggedIn = true;
		Alloy.Globals.CURRENT_USER = _resp.model;

		$.parentController.loginSuccessAction(_resp);

	} else {
		// Show the error message and let the user try again.
		alert("loginFailed", _resp.error.message);

		Alloy.Globals.CURRENT_USER = null;
		Alloy.Globals.loggedIn = false;
	}
};

/**
 * When the user logs in, we create a new user model and 
 * call the login method for user.  This time, we pick this
 * up from the form. 
 */
function doLoginBtnClicked() {

	// create instance of the user model
	var user = Alloy.createModel('User');

	// call the extended model’s function
	user.login($.email.value, $.password.value, userActionResponseHandler);
};

/**
 * Creates a new account, based on user form input, and calls ACS, through
 * the user model, to create the user on the ACS side. 
 */
function doCreateAcctBtnClicked() {
	if ($.acct_password.value !== $.acct_password_confirmation.value) {
		alert("Please re-enter information");
		return;
	}

	var params = {
		first_name : $.acct_fname.value,
		last_name : $.acct_lname.value,
		username : $.acct_email.value,
		email : $.acct_email.value,
		password : $.acct_password.value,
		password_confirmation : $.acct_password_confirmation.value,
	};

	//we create an account model
	var user = Alloy.createModel('User');

	//pass the params and also call the utility method
	user.createAccount(params, userActionResponseHandler);
};

//this opens the view and gets the controller/view rolling
$.open = function(_reset) {
	//Ti.Facebook && Ti.Facebook.logout();
	_reset && cancelActionButtonClicked();
	$.index.open();
};

//we also respond to the view being closed
$.close = function() {
	//debugger;
	$.index.close();
}; 