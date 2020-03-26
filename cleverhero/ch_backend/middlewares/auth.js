/*  Ce middleware va permettre de verifier qu'une requete soit envoyé par un utilisateur identifié.
    Il doit donc être appelé par les différents routeurs qui recoivent des requètes ayant besoin d'une
    authentification pour être envoyées 
*/

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
        error: new Error('Invalid request!')
    });
  }
};