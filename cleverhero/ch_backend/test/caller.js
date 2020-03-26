// caller.js

const Table = require('./model');


exports.findme = (body) => {
    Table.findOne(body)
        .then(elem => {
            console.log("get.ok = true");
            if(!elem) return { ok: true };
            return { ok: true, elem: elem };
        })
        .catch(error => {
            console.log("get.ok = false");
            return { ok: false, error: error };
        })

    // on passe ici ce qui logiquement implique qu'on est pas entré dans le then() et le catch()
    console.log("coucou X.X");    
}
