'use strict';

//import
const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const { body, param, oneOf } = require('express-validator')
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const cors = require('cors');
const userDao = require('./userDao'); // module for accessing the users in the DB
const dao = require('./dao'); // module for accessing the DB
const e = require('express');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy({  // or whatever you want to use
    usernameField: 'username',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'
  },
    function(username, password, done) {
      //console.log("passport riga 21 app js",email,password)
      userDao.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Incorrect username and/or password.' });
          
        return done(null, user);
      })
    }
  ));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    //console.log("Serialize")
    done(null, user);
  });

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        //console.log("deserealize")
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); // NB: Usare solo per sviluppo e per l'esame! Altrimenti indicare dominio e porta corretti

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  //console.log("is logged in server js", req)
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'not authenticated'});
}


// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'Lions they dont compare themselves with humans',
    resave: false,
    saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/
//tutti gli indovinelli
app.get('/api/getIndovinelli',async (req,res)=>{
  await dao 
  .getAllIndovinelli()
  .then((indovinelli) => res.json(indovinelli))
  .catch(() => res.status(500).json("Database unreachable"));
})

//indovinelli aperti con almeno una risposta
app.get('/api/getIndovinelliApertiConRisposta',async (req,res)=>{
  await dao 
  .getIndovinelliApertiConRisposta()
  .then((indovinelli) => res.json(indovinelli))
  .catch(() => res.status(500).json("Database unreachable"));
})

//indovinelli dell'utente
app.get('/api/getIndovinelliUtente/:id',async (req,res)=>{
  await dao 
          .getIndovinelliUtente(req.params.id)
          .then((indovinelli) => res.json(indovinelli))
		      .catch(() => res.status(500).json("Database unreachable"));
})

//tutte le risposte
app.get('/api/getRisposteIndovinello/',async (req,res)=>{
  await dao 
          .getRisposteIndovinello()
          .then((risposte) => res.json(risposte))
		      .catch(() => res.status(500).json("Database unreachable"));
})

//tutte le risposte - indovinello aperto
app.get('/api/getRisposteIndovinelloAperto/:id',async (req,res)=>{
  await dao 
          .getRisposteIndovinelloAperto(req.params.id)
          .then((risposte) => res.json(risposte))
		      .catch(() => res.status(500).json("Database unreachable"));
})

//classifica
app.get('/api/getClassifica/',async (req,res)=>{
  await dao 
          .getClassifica()
          .then((classifica) => res.json(classifica))
		      .catch(() => res.status(500).json("Database unreachable"));
})

//get punteggio utente
app.get('/api/getPunteggioUtente/:id',async (req,res)=>{
  await dao 
          .getPunteggioCorrente(req.params.id)
          .then((punteggio) => res.json(punteggio))
		      .catch(() => res.status(500).json("Database unreachable"));
})

//aggiorna punteggio utente
//puts
app.put('/api/aggiornaPunteggio/:id/:punteggio',
[
  check('id').isInt(),
  check('punteggio').isIn(['1','2','3'])
],
  async(req,res)=>{ 
    await dao.aggiornaPunteggio(req.params.id,req.params.punteggio)
      .then(risultato=>res.json(risultato))
      .catch((err) => {
      console.log(err);
      res.status(500).json({error: `Database error while retrieving courses`}).end()
  });
})

//POST
app.post('/api/inserisciIndovinello',
isLoggedIn,
[ 
  check('domanda').isLength({min:1}),
  check('livello').isIn(['Facile','Medio','Difficile']),
  check('durata').isInt({min:30,max:600}),
  check('suggerimentoUno').isLength({min:1}),
  check('suggerimentoDue').isLength({min:1}),
  check('id_utente').isInt(),
  check('stato').isInt({min:1,max:1}),
],
  async(req,res)=>{
  //console.log("server js",req.body)
  await dao.inserisciIndovinello(req.body.domanda,req.body.livello,req.body.durata,req.body.risposta_corretta,req.body.suggerimentoUno,req.body.suggerimentoDue,
                                req.body.id_utente,req.body.stato)
    .then(result=>{
      res.status(201).json(result)
    })
    .catch(err=>{
      //console.log(err);
      res.json({error:err})
    })
})

app.post('/api/inserisciRisposta',
[ 
  check('id_indovinello').isInt(),
  check('id_utente').isInt(),
  check('risposta').isLength({min:1}),
  check('corretta').isInt({min:0,max:1})
],
  async(req,res)=>{
  //console.log("server js",req.body)
  await dao.inserisciRisposta(req.body.id_indovinello,req.body.id_utente,req.body.risposta,req.body.corretta,req.body.timestamp)
    .then(result=>{
      res.status(201).json(result)
    })
    .catch(err=>{
      //console.log(err);
      res.json({error:err})
    })
})

//PUT
app.put('/api/chiudiIndovinello/',async(req,res)=>{
  await dao.chiudiIndovinello(req.body.id)
    .then(risultato=>res.json(risultato))
    .catch((err) => {
      console.log(err);
      res.status(500).json({error: `Database error while retrieving courses`}).end()
  });
})


/*********** API PER SESSINOE *********************/
// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        //console.log("/api/session",req.user)
        return res.json(req.user);
      });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  
  if(req.isAuthenticated()) {
  res.status(200).json(req.user);}
else
  res.status(401).json({error: 'Unauthenticated user!'});;
});


// Activate the server
app.listen(port, () => {
  console.log(`react-score-server listening at http://localhost:${port}`);
});