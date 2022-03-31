const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Sauce = require("./models/Sauce");
const app = express();

// Déclaration des routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/users');

const path = require ('path');


mongoose.connect('mongodb+srv://Etudier83:JeF12mdb@cluster0.r1iha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  

// Headers CORS
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
app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' })); //Pour interdire d'inclure cette page dans une iframe




// Lancement des routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;