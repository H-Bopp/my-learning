const bcryptejs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userCaller = require('../callers/user');
const userFormCaller = require('../callers/user-form');






/*  Fonction utilisé pour généré les codes de verification */
function generateCode (size) {
    var code = ''
    for (var i = 0; i<size; i++) {
             code = code.concat(Math.floor(Math.random() * Math.floor(10)))
     }
    return code
}

/*
   @param(req) : { email, password, phone }
   @sended if ok : { message: 'SUCCESS', token }
   @sended if ko : { message: 'ERROR', error }
 */
exports.saveUserForm = (req, res, next) => {
    console.log("entré dans saveUserForm");

    /* TODO: Verification des informations recues */

    bcryptejs.genSalt(10, (error, salt) => {
        bcryptejs.hash(req.body.password, salt)
            .then(hash => {
                console.log("entré dans saveUserForm.hash.then");

                /*  Generation des codes de verifications */
                const phoneCode = generateCode(4);
                const emailCode = generateCode(4);

                /*  Generation du token unique */
                var finded = false;
                while(!finded){
                    var token = generateCode(4);
                    var isUniqueToken = userFormCaller.get({token: token});
                    console.log("verification de recherche dans saveUserForm.");
                    console.log('finded = ' + finded);
                    if(isUniqueToken.ok){
                        if(!isUniqueToken.user){
                            finded = true;
                        }
                    } else {
                        res.status(500).json({ 
                            state: 'ERROR',
                            message: 'Impossible de creer un token de création de compte',
                            error 
                        });
                        return;
                    }
                      
                }

                /* Sauvegarde */
                const result = userFormCaller.create({
                    email: req.body.email,
                    password: hash,
                    phone: req.body.phone,
                    token: token,
                    phoneChecker: phoneCode,
                    emailChecker: emailCode
                });
                console.log("verification de creation dans saveUserForm.");
                console.log(result);
                if(result.ok){
                    

                    res.status(201).json({ state: 'SUCCESS', token: token }); 
                } else {
                    res.status(400).json({ 
                        state: 'ERROR', 
                        message: 'Echec lors de la sauvegarde des informations',
                        error 
                    })
                }
            });
    });
};


/*
   @param(req) : { codePhone, codeEmail, token }
   @sended if ok : { state: 'SUCCESS', userId }
   @sended if ko : { state: 'ERROR', message, error? }
 */
exports.signup = (req, res, next) => {

    /* Récupération des informations lié au nouvel utilisateur */
    const finded = userFormCaller.get(req.body);
    if(finded.ok){
        if(!finded.user){
            res.status(400).json({ 
                state: 'ERROR', 
                message: 'Impossible de trouver les informations du formulaire de l\'utilisateur' 
            });
            return;
        }
    } else {
        res.status(500).json({ 
            state: 'ERROR', 
            message: 'Echec lors de la récupération du formulaire de l\'utilisateur',
            error });
        return;
    }

    /* Verification des informations */
    if(req.body.phoneChecker != finded.user.phoneCode){
        res.status(400).json({ state: 'ERROR', message: 'Le code téléphone est invalide' });
        return;
    }
    if(req.body.emailChecker != finded.user.emailChecker){
        res.status(400).json({ state: 'ERROR', message: 'Le code email est invalide' });
        return;
    }

    /* TODO : Génération du userID */
    userId = finded.user.email;

    /* Création du nouvel utilisateur */
    const result = userCaller.add({
        userId: userId,
        email: finded.user.email,
        password: finded.user.password,
        phone: finded.user.phone
    });
    console.log(result);

    /* Creation de la reponse en fonction du bon deroulement de la creation */
    if(result.ok) { 
        res.status(201).json({ state: 'SUCCESS' }); 
    } else { 
        res.status(400).json({ 
            state: 'ERROR', 
            message: 'Echec lors de la création de compte',
            error 
        });
    }

    // TODO : Supprimer l'utilisateur de la des utilisateurs en cours de création

}







/*
exports.signup = (req, res, next) => {

    console.log('on entre bien dans /controllers/user.js/signup');
    bcryptejs.genSalt(10)
        .then(salt => {

            bcryptejs.hash(req.body.password, salt)
                .then(hash => {
                    console.log('on entre bien dans /controllers/user.js/signup/hash');

                    // Ajout dans la base de donnée
                    var result = usercaller.addUser({
                        userId: req.body.userId,
                        email: req.body.email,
                        password: hash,
                        phone: req.body.phone
                    });
                    console.log(result);
        
                    // Creation de la reponse en fonction du bon deroulement de la creation 
                    if(result.ok) { 
                        res.status(201).json({ message: 'SUCCESS' }); 
                    } else { 
                        res.status(400).json({ message: 'ERROR', error });
                    }
                })
        })
};
*/


exports.login = (req, res, next) => {
    // Recuperation du user dans la base de donnee
    const result = userCaller.getUser(req.body);

    // Creation de la reponse en fonction du bon deroulement de la recuperation
    if(result.ok){
        if(!resut.user) {
            res.status(401).json({ error: 'Utilisateur non trouvé !' });
        } else {

            // Verification de la validite du password
            bcryptejs.compare(req.body.password, result.user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                return res.status(200).json({
                    userId: result.user.userId,
                    token: jwt.sign(
                        { userId : result.user.userId },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));    
        }
    } else {
        res.status(500).json(result.error);
    }
}



/*
exports.login = (req, res, next) => {
    User.findOne({ phone:req.body.phone })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcryptejs.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                }
                return res.status(200).json({
                    userId: user.userId,
                    token: jwt.sign(
                        { userId : user.userId },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
*/