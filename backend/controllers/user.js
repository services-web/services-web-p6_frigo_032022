
//algorithmes de hachage.
//axés sur la sécurité que sur l'efficacité.
// Cela signifie que le cassage de ces algorithmes exige plus de ressources.
const bcrypt = require("bcrypt");
const User = require("../models/User");
//middleware d'authentification
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

// User signup controller
exports.signup = (req, res, next) => {
  const isValidateEmail = validator.validate(req.body.email);
  if (!isValidateEmail) {
    res.writeHead(400, 'Email incorrect !"}', {
      "content-type": "application/json",
    });
    res.end("Le format de l'email est incorrect.");
  } else {
    //Le hachage permet de générer une empreinte unique pour une entrée.
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// user login controller
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
//console.log(req.body.password, user.password);
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //console.log(user, process.env);
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.JWT, {
              //limitez la durée de l'ID de session ;
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
