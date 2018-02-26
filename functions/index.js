var express = require('express');
var app = express();
const admin = require("firebase-admin");
var functions = require("firebase-functions");
var firebase = require('firebase');
var bodyParser = require('body-parser');
var cookieSession = require('firebase-cookie-session');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    console.log("Authorrized")
    return next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.use(express.static( __dirname + '/public'));
app.set('view engine', 'ejs');
app.use(cookieSession({
  keys: ['ThisIsSecret'],
  // Cookie Options 
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))

admin.initializeApp(functions.config().firebase);


app.get("/hi", (req, res) => {
	req.user.data = {
		name: 'name of person'
	}
  res.send(req.user);

});

app.get("/without", (req,res) => {
	res.send(req.user);
})

app.post("/login", (req, res) => {
	/*console.log("uid: "+req.body.uid);
	console.log(0);
	admin.auth().revokeRefreshTokens(req.body.uid)
    .then(() => {
			console.log(1);
      return admin.auth().getUser(uid);
    })
    .then((userRecord) => {
			console.log(2);
      return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
    })
    .then((timestamp) => {
			console.log(3);
			console.log("Tokens revoked at: ", timestamp);
			const metadataRef = admin.database().ref("metadata/" + req.body.uid);
			metadataRef.set({revokeTime: utcRevocationTimeSecs})
    			.then(() => {
						console.log(4);
 		     	console.log("Database updated successfully.");
  res.redirect("/dashboard")
						
			})
			.catch((err) => {
				console.log(5,err);
			});
		})
		.catch((err) => {
			console.log(6,err);
		});*/

		console.log("request user" + req.user.name);
		res.redirect('/dashboard');
})


app.get('/dashboard', (req, res) => {
		res.render('dashboard.ejs')	
});

app.get("/logout", (req, res) => {
  
})
app.post("/signupsubmit", function (req,res) {
  admin.auth().createUser({
  name: req.body.name,
  email: req.body.email,
  emailVerified: false,
  password: req.body.pass
/* 
  photoURL: "http://www.example.com/12345678/photo.png",
  disabled: false*/
});
});


app.post("/signupsubmit", function (req,res) {

	admin.auth().createUser({
	name: req.body.name,
	email: req.body.email,
	emailVerified: false,
	password: req.body.pass
	/*displayName: "John Doe",
	photoURL: "http://www.example.com/12345678/photo.png",
	disabled: false*/
})
  .then(function(userRecord) {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log("Successfully created new user:", userRecord.uid);
  })
  .catch(function(error) {
    console.log("Error creating new user:", error);
  });
})

app.post("/loginsubmit", function (req,res) {
	var uid = "some-uid";
	var username = req.body.email;
	var password = req.body.pass;
	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function (argument) {
		console.log(argument)
	})


	.catch(function(error) {
  		// Handle Errors here. 
  		var errorCode = error.code;
  		var errorMessage = error.message;
  		// ...
	});
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions




exports.app = functions.https.onRequest(app);