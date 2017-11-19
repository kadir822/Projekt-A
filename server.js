//Initialisierung des Webservers

const express = require('express');
const app = express();

//Body-parser init
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//EJS Template Engine init
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

//CSS Stylesheet einbinden
app.use(express.static(__dirname + '/public'));

//tingodb setup
const DB_COLLECTION = 'users';
const Db = require('tingodb')().Db;
const db = new Db(__dirname + '/tingodb', {});
const ObjectId = require('tingodb')().ObjectID;

// Name der Collection festlegen
const DB_COLLECTION2 = "products"; 
require('fs').mkdir(__dirname + '/tingodb', (err)=>{});


//session setup
const session = require('express-session');
app.use(session({
    secret: 'this-is-a-secret',     //necessary for encoding
    resave: false,                  //should be set to false, except store needs it
    saveUninitialized: false        //same reason as above.
}));

//password hash, for encoding the pw
const passwordHash = require('password-hash');

//Webserver starten
const port = 8080;
app.listen(port, function(){
	console.log('listening to port' + port);
});

//either go to the landing page (user not logged in) or go to the content page (user logged in)
app.get('/', (request, response) => {
    if (request.session.authenticated) {
        response.render('logged', {'username': request.session.username});
    } else {
        response.sendFile(__dirname + '/index.html');
    }   
});

//Login
app.get('/login', function(request, response) {
	response.sendFile(__dirname + '/login.html');
	
});

//Impressum
app.post('/impressum', function(request, response) {
	response.render('impressum');
	
});

//Verkauf Notebook
app.get('/verkauf_notebook',(request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_notebook_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_notebook.html');
    }   
});

//Verkauf PC
app.get('/verkauf_pc', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_pc_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_pc.html');
	}
});

//Verkauf Maus
app.get('/verkauf_maus', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_maus_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_maus.html');
	}
});

//Verkauf Tastatur
app.get('/verkauf_tastatur', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_tastatur_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_tastatur.html');
	}
});


//Verkauf Kabel
app.get('/verkauf_kabel', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_kabel_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_kabel.html');
	}
});

//Verkauf playStation
app.get('/verkauf_ps', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_ps_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_ps.html');
	}
});

//Verkauf xbox
app.get('/verkauf_xbox', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_xbox_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_xbox.html');
	}
});

//Verkauf nintendo
app.get('/verkauf_nintendo', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_nintendo_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_nintendo.html');
	}
});

//Verkauf Monitor
app.get('/verkauf_monitor', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_monitor_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_monitor.html');
	}
});


//Verkauf Fernseher
app.get('/verkauf_fernseher', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_fernseher_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_fernseher.html');
	}
});

//Verkauf Heimkino
app.get('/verkauf_heimkino', (request, response) => {
	if (request.session.authenticated) {
		response.render('verkauf_heimkino_logged', {'username': request.session.username});
	} else {
        response.sendFile(__dirname + '/verkauf_heimkino.html');
	}
});

//Kontakt
app.post('/kontakt', function(request, response) {
	response.render('kontakt');
	
});



//Homebutton
app.get('/home', (request, response) => {

    response.sendFile(__dirname + '/index.html');
});

app.post('/logged', function(request, response){
	response.render('logged');
});




//Registrieren
app.get('/registrieren', (request, response) => {
    response.sendFile(__dirname + '/registrieren.html');
});


app.post('/registrieren', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    const repPassword = request.body.repPassword;

    let errors = [];
    if (username == "" || username == undefined) {
        errors.push('Bitte einen Username eingeben.');
    } 
    if (password == "" || password == undefined) {
        errors.push('Bitte ein Passwort eingeben.');
    } 
    if (repPassword == "" || repPassword == undefined) {
        errors.push('Bitte ein Passwort zur Bestätigung eingeben.');
    } 
    if (password != repPassword) {
        errors.push('Die Passwörter stimmen nicht überein.');
    }

    db.collection(DB_COLLECTION).findOne({'username': username}, (error, result) => {
        if (result != null) {
            errors.push('User existiert bereits.');
            response.render('errors', {'error': errors});
        } else {
            if (errors.length == 0) {
                const encryptedPassword = passwordHash.generate(password);

                const newUser = {
                    'username': username,
                    'password': encryptedPassword
                }
    
                db.collection(DB_COLLECTION).save(newUser, (error, result) => {
                    if (error) return console.log(error);
                    console.log('user added to database');
                    response.redirect('/');
                });
            } else {
                response.render('errors', {'error': errors});
            }
        } 
    });
});


app.post('/login', (request, response) => {
   const username = request.body.username;
   const password = request.body.password;

   let errors = [];

   db.collection(DB_COLLECTION).findOne({'username': username}, (error, result) => {
        if (error) return console.log(error);

        if (result == null) {
            errors.push('Der User ' + username + ' existiert nicht.');
            response.render('errors', {'error': errors});
            return;
        } else {
            if (passwordHash.verify(password, result.password)) {
                request.session.authenticated = true;
                request.session.username = username;
                response.redirect('/');
            } else {
                errors.push('Das Passwort für diesen User stimmt nicht überein.');
                response.render('errors', {'error': errors});
            }
        }
   });
});

//log the user out again and delete his session, redirect to main page
app.get('/logout', (request, response) => {
    delete request.session.authenticated;
    delete request.session.username;
    response.redirect('/');
}); 


//Artikel hinzufügen

app.get('/addArticle', (request, response) => {
    response.sendFile(__dirname + '/shop.html');
});

app.post('/addToCart', (request, response) => {
    const name = request.body.name;
    const price = request.body.price;

    const article = {'name': name, 'price': price};
    db.collection(DB_COLLECTION2).save(article, (err, result) => {
        if (err) return console.log(err);
        response.redirect('/verkauf_notebook');
    });
});

app.post('/delete/:id', (request, response) => {
    const id = request.params.id;
    const o_id = new ObjectID(id);

    db.collection(DB_COLLECTION2).remove({'_id': o_id}, (error, result) => {
        response.redirect('/verkauf_notebook');
    });
});


/* app.get('/verkauf_notebook', (request, response) => {
    db.collection(DB_COLLECTION2).find().toArray(function (err, result) {
        if (err) return console.log(err);
        response.render('verkauf_notebook_logged2', { 'products': result});
    });   
});
//Produkte auf der Startseite anzeigen lassen
app.get('/verkauf_notebook_logged2', (request, response) => {
    db.collection(DB_COLLECTION2).find().toArray(function (err, result) {
        if (err) return console.log(err);
        response.render('verkauf_notebook_logged2', { 'products': result});
    });   
});
 */






