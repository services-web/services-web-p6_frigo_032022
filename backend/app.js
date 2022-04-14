const express = require("express");
//Helmet vous aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require ('path');



//Analysez les corps de requête entrants dans un middleware avant vos gestionnaires
const Sauce = require("./models/Sauce");


// Déclaration des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');


const app = express();


//const MONGO_URI =  'mongodb+srv://Etudier83:JeF12mdb@cluster0.r1iha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const {MONGO_URI} = require('./process.env');
mongoose.connect(`${MONGO_URI}`, { useNewUrlParser: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  

// Headers CORS
//Cross-Origin Resource Sharing (CORS).
//une sécurité à vos requêtes GET et POST par défaut. 
//Lorsqu'une demande est faite, elle ne sera autorisée que si elle a la même origine.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Conversion en JSON
app.use(express.json()); 

// Gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Lancement helmet
//lutte contre les attaque XSS, navigateur
/*Node.js a un module de cookies avec HttpOnly,
 et un middleware appelé Helmet. */ 
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' })); //Pour interdire d'inclure cette page dans une iframe




// Lancement des routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;