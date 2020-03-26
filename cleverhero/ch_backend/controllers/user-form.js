const bcryptejs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


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

    /* TODO: Verification des informations recues */

    bcryptejs.genSalt(10, (error, salt) => {
        bcryptejs.hash(req.body.password, salt)
            .then(hash => {
                /*  Generation des codes de verifications */
                const phoneCode = generateCode(4);
                const emailCode = generateCode(4);

                /*  Generation du token unique */
                var finded = false;
                while(finded){
                    var token = generateCode(4);
                    ///////////////////////////////////////////////:: à modifier rapidement //////////////////////
                    UserCheck.findOne({token: token})
                    .then(user => {
                        if(!user){
                            finded = true;                   
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ 
                            state: 'ERROR',
                            message: 'Impossible de creer un token de création de compte',
                            error 
                        })
                    });     
                    ///////////////////////////////////////////////:: à modifier rapidement //////////////////////
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
exports.confirmUser = (req, res, next) => {

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
    const result = usercaller.add({
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
exports.checkUser = (req, res, next) => {
    User.findOne({ token: req.body.token })
        .then(user => {
            if(!user) {
                return res.status(401).json({ state: 'ERROR', error: 'Utilisateur non trouvé !' });
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
