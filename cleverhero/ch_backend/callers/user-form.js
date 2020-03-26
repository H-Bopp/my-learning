const Userform = require('../models/user-form');

/* ajoute une entree dans la table user de la base de donnée mongodb
@param : body = { email, password, phone, token, phoneChecker, emailChecker }
@return : res = { ok : true } / 
                { ok : false, error }
*/
exports.create = (body) => {
    console.log('on entre bien dans /callers/user-form.js/create');

    const user = new Userform(body);
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
@param : body = { token }
@return : res = { ok: true, user } / 
                { ok: false, error: error }
*/
exports.get = (body) => {
    Userform.findOne(body)
        .then(user => {
            console.log("get.ok = true");
            if(!user) return { ok: true };
            return { ok: true, user: user };
        })
        .catch(error => {
            console.log("get.ok = false");
            return { ok: false, error: error };
        })
    console.log("on passe ici lol");
    console.log("on passe ici lol");
    
}

