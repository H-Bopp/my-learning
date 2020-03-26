const User = require('../models/user');


/* ajoute une entree dans la table user de la base de donnée mongodb
@param : body = { userID, email, password, phone }
@return : res = { ok : true } / 
                { ok : false, error }
*/
exports.create = (body) => {
    console.log('on entre bien dans /callers/user.js/create');

    const user = new User(body);
    user.save()
        .then(() => {
            console.log('on passe dans le then de create');
            const res = { ok: true };
            console.log(res);
            return res;
        })
        .catch( (error) => { 
            console.log('on passe dans le cache de create');
            const res = { ok: false, 'error': error };
            console.log(res);
            return res;
        });
}

/* recherche si une entree est dans la table user de la base de donnée mongodb
@param : body = { userID, email, password, phone }
@return : res = { ok: true, user } / 
                { ok: false, error: error }
*/
exports.get = (body) => {
    User.findOne({ phone: body.phone })
        .then(user => {
            if(!user) {
                return { ok: true };
            }
            return { ok: true, user: user };
        })
        .catch(error => {
            return { ok: false, error: error };
        })
}

