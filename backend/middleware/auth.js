const jwt = require("jsonwebtoken");

// middleware auth
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error ("Invalid user ID");
    } else {
      next();
    }
  } catch (err){
   // const message = { error : 'Invalid request' };
   // console.log(message);
//res.status(401).json(message);
   res.status(401).json({
     error: err.message,
    });
  }
};
