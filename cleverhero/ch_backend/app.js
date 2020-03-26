
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./router/user');
const testRouter = require('./test/router-exemple')
const mongoose = require('mongoose');

const app = express();

/*  Utilisation de la bibliotheque bodyParser pour pouvoir parser des objets JSON */
app.use(bodyParser.json());

/*  Connexion avec la base de donnée mongoDB atlas */
mongoose.connect(
    'mongodb+srv://AdminCH:J35ckd54wi7NZL8b@clusterv1-lkpz1.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

/*  Permet de resoudre les erreurs CORS : systeme de securité qui par defaut bloque les appels HTTP 
    entre des serveurs différentes. Ici on authorise tout le monde a communiquer avec notre serveur */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use((req, res, next) => {
    console.log('Requête reçue : { email:' + req.body.email + ', password:' 
                + req.body.password + ', phone:' + req.body.phone + ' }');
    next();
  });
  
/*  Ajout du router permettant d'accéder aux fonctionnalités lié à l'authentification des utilisateurs */
app.use('/api/user', userRouter);

app.use('/test',(req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); 
    next();
 });

 app.use('/scenario', testRouter);




app.use((req, res, next) => {
    console.log('Reponse envoyée : <' + res +'>');
});

module.exports = app;



