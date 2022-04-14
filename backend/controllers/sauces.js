// Récupération du modèle sauce
const Sauce = require('../models/Sauce');

// Récupération du package file system permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');


// Logiques métiers pour les sauces
// Lecture de toutes les sauces dans la base de données (Get)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};
// Lecture d'une sauce avec son ID (Get/:id)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};
// Création d'une nouvelle sauce (Post)
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		// Création de l'URL de l'image : http://localhost:3000/image/nomdufichier 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
// Enregistrement de l'objet sauce dans la base de données
sauce.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce (Update)
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    // Si il existe déjà une image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; 
    // Si il n'existe pas d'image
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};
// Suppression d'une sauce (Delete)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      // Récupération du nom du fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // On efface le fichier (unlink)
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// like ou non associé a un id
exports.likeSauce = (req, res, next) => {
  
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  // 1. user like pour premiere fois(like === 1)
  // pousser l'userId vers le tableau usersLiked ; incrémenter les likes
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce appréciée" }))
      .catch((error) => res.status(500).json({ error }));
  }

  //likes
  else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce dépréciée" }))
      .catch((error) => res.status(500).json({ error }));
  }
  // Aimer ou pas une sauce
  else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce dépréciée" });
            })
            .catch((error) => res.status(500).json({ error }));
          // 3.2 user is changing his mind on his dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce appréciée" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};

