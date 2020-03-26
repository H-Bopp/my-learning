// controller.js

const caller = require('./caller');


exports.traitementExemple = (req, res, next) => {
    console.log("Entre dans traitementExemple ...");

    const token = "1234";

    console.log("Recherche du token dans la base de donnee ...");
    var result = caller.findme({token: token});
    if(result.ok){
        if(!result.elem){
            result = true;
        }
    } else {
        res.status(500).json({ 
            state: 'ERROR',
            error: error 
        });
        return;
    }
   
    // suite du traitement qui nous importe peu ...
    res.status(200).json({ state: 'SUCCESS', token: token });
}