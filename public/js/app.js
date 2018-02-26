var xhttp = new XMLHttpRequest();
var config = {
    apiKey: "AIzaSyB9SU9h9myh6hg1cQet_5MFB7Dy9-8EPTU",
    authDomain: "safe-side-project.firebaseapp.com",
    databaseURL: "https://safe-side-project.firebaseio.com",
    projectId: "safe-side-project",
    storageBucket: "safe-side-project.appspot.com",
    messagingSenderId: "178491336655"
  };
  firebase.initializeApp(config);


function signup() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('signuppass').value;
	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function(odj) {
			var user = firebase.auth().currentUser;
			user.sendEmailVerification().then(function() {
					window.location.assign('/dashboard');
					
				}).catch(function(error) {
				  // An error happened.
				});
		})
		.catch(function(error) {
		  // Handle Errors here.
		  var errorMessage = error.message;
		  var errorCode = error.code;
			if(errorCode=="auth/weak-password") {
				Materialize.toast("Your password is weak",4000);	
			}
			else if(errorCode=="auth/email-already-in-use") {
				Materialize.toast("The email is already in use",4000);		
			}
			else {
				Materialize.toast("Something went wrong. Try again!",4000);		
				
			}
		  // ...
	});
}

function login() {
	var user =  document.getElementById('loginuser').value;
	var pass =  document.getElementById('loginpass').value
	firebase.auth().signInWithEmailAndPassword(user, pass)
		.then(function() {

			/* Does an authenticated request to a Firebase Functions endpoint using an Authorization header.
			firebase.auth().currentUser.getToken().then(function(token) {
				console.log('Sending request to', '/hi', 'with ID token in Authorization header.');
				var req = new XMLHttpRequest();
				req.onload = function() {
					//this.responseContainer.innerText = req.responseText;
					setTimeout(function() {
						console.log(req.responseText);
					},1000)
					
				}.bind(this);
				req.onerror = function() {
					//this.responseContainer.innerText = 'There was an error';
					console.log("There was an error");
				
				}.bind(this);
				req.open('GET', '/hi', true);
				req.setRequestHeader('Authorization', 'Bearer ' + token);
				req.send();

				
			}.bind(this));*/
			//// Does an authenticated request to a Firebase Functions endpoint using a __session cookie
			firebase.auth().currentUser.getToken(true).then(function(token) {
				// set the __session cookie
				document.cookie = '__session=' + token + ';max-age=3600';
		
				console.log('Sending request to', '/hi', 'with ID token in __session cookie.');
				var req = new XMLHttpRequest();
				req.onload = function() {
					//this.responseContainerCookie.innerText = req.responseText;
					setTimeout(function() {
						console.log(req.responseText);
					},1000)
				}.bind(this);
				req.onerror = function() {
					this.responseContainerCookie.innerText = 'There was an error';
				}.bind(this);
				req.open('GET', '/hi', true);
				req.send();
				window.location.assign('/dashboard');
			}.bind(this));

			/*
				var user = firebase.auth().currentUser;
				console.log(user.uid);
				document.getElementById("uid").value = user.uid;
				console.log("uid value" + document.getElementById("uid").value)
				$(document).ready(function() {
					$('#logform').submit();
				}) */
				
		})
		.catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// ...Yeah
			console.log(errorCode + " " + errorMessage );
			if(errorCode=="auth/wrong-password") {
				Materialize.toast("Your password is wrong", 4000);
			}
			else if(errorCode=="auth/user-not-found") {
				Materialize.toast("Your username is wrong",4000);
			}
			else {
				Materialize.toast("Something went wrong. Try again!")
			}
	});
}

function signout() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful. 
	  window.location.assign('/');
	})
	.catch(function(error) {
		// An error happened.
		
	});
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
		console.log("user signed in and user is " + user);
		console.log(user);
  } else {
	var user = firebase.auth().currentUser
	console.log("user logged out");
	console.log(user);
	

  }
});