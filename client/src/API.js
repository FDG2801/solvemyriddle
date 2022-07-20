async function getAllIndovinelli(){
  
  const response = await fetch(new URL('http://localhost:3001/api/getIndovinelli'));
  const indovinelliJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return indovinelliJson.map((e) => ({
        id:e.id,
        domanda:e.domanda,
        livello:e.livello,
        durata:e.durata,
        risposta_corretta:e.risposta_corretta,
        suggerimentoUno:e.suggerimentoUno,
        suggerimentoDue:e.suggerimentoDue,
        id_utente:e.id_utente,
        stato:e.stato
      }))
    } 
    else{
      throw indovinelliJson;
  }    
}

// get indovinelli utente
async function getIndovinelliUtente(id){
  
  const response = await fetch(new URL(`http://localhost:3001/api/getIndovinelliUtente/${id}`));
  const indovinelliJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return indovinelliJson.map((e) => ({
        id:e.id,
        domanda:e.domanda,
        livello:e.livello,
        durata:e.durata,
        risposta_corretta:e.risposta_corretta,
        suggerimentoUno:e.suggerimentoUno,
        suggerimentoDue:e.suggerimentoDue,
        id_utente:e.id_utente,
        stato:e.stato
      }))
    } 
    else{
      throw indovinelliJson;
  }    
}

async function getPunteggioCorrente(id){
  
  const response = await fetch(new URL(`http://localhost:3001/api/getPunteggioUtente/${id}`));
  const punteggioJson= await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
    //console.log(punteggioJson,"punteggio")
      return punteggioJson
    } 
    else{
      throw punteggioJson;
  }    
}

//get risposte
async function getRisposteIndovinello(){
  const response = await fetch(new URL(`http://localhost:3001/api/getRisposteIndovinello/`));
  const indovinelliJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return indovinelliJson.map((e) => ({
        id_indovinello:e.id_indovinello,
        id_utente:e.id_utente,
        risposta:e.risposta,
        corretta:e.corretta,
        timestamp:e.timestamp
      }))
    } 
    else{
      throw indovinelliJson;
  }    
}

async function getRisposteIndovinelloAperto(id){ 
  const response = await fetch(new URL(`http://localhost:3001/api/getRisposteIndovinelloAperto/${id}`));
  const indovinelliJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return indovinelliJson.map((e) => ({
        id_indovinello:e.id_indovinello,
        id_utente:e.id_utente,
        risposta:e.risposta,
        corretta:e.corretta
      }))
    } 
    else{
      throw indovinelliJson;
  }    
}

async function getClassifica(){
  
  const response = await fetch(new URL(`http://localhost:3001/api/getClassifica/`));
  const classificaJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return classificaJson.map((e) => ({
        username:e.username,
        punteggio:e.punteggio
      }))
    } 
    else{
      throw classificaJson;
  }    
}

async function getIndovinelliApertiConRisposta(){
  
  const response = await fetch(new URL(`http://localhost:3001/api/getIndovinelliApertiConRisposta/`));
  const rispostaJson = await response.json();
  //console.log(indovinelliJson,"Indovinelli json")
  if(response.ok){
      return rispostaJson.map((e) => ({
				//indovinelli
				id:e.id,
				domanda:e.domanda,
				livello:e.livello,
				durata:e.durata,
				risposta_corretta:e.risposta_corretta,
				suggerimentoUno:e.suggerimentoUno,
				suggerimentoDue:e.suggerimentoDue,
				id_utente:e.id_utente,
				stato:e.stato,
				//risposte
				risposta:e.risposta,
				corretta:e.corretta,
				timestamp:e.timestamp,
				tempoRimasto:null
      }))
    } 
    else{
      throw rispostaJson;
  }    
}

// post -> nuovo indovinello
async function inserisciIndovinello(indovinello){
  //console.log("api js",indovinello)
  return new Promise ((resolve,reject)=>{
      fetch(new URL(`http://localhost:3001/api/inserisciIndovinello`), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({domanda:indovinello.domanda,
      livello:indovinello.livello,
      durata:indovinello.durata,
      risposta_corretta:indovinello.risposta_corretta,
      suggerimentoUno:indovinello.suggerimentoUno,
      suggerimentoDue:indovinello.suggerimentoDue,
      id_utente:indovinello.id_utente,
      stato:indovinello.stato}),
    }).then((res)=>{
      if(res.ok){
          resolve (null); 
      }
      else {
          res.json()
              .then((message)=>{ return (message);})
              .catch(()=>{return {error: 'Cannot parse server response'} });
      }
  })
  .catch(() => { return ({ error: "Cannot communicate with the server." }) });
})
}

async function inserisciRisposta(id_indovinello,id_utente,risposta,corretta,timestamp){
  //console.log("api js",id_indovinello,id_utente,risposta,corretta)
  return new Promise ((resolve,reject)=>{
      fetch(new URL(`http://localhost:3001/api/inserisciRisposta`), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_indovinello:id_indovinello,
        id_utente:id_utente,
        risposta:risposta,
        corretta:corretta,
        timestamp:timestamp
      }),
    }).then((res)=>{
      if(res.ok){
          resolve (null); 
      }
      else {
          res.json()
              .then((message)=>{ return (message);})
              .catch(()=>{return {error: 'Cannot parse server response'} });
      }
  })
  .catch(() => { return ({ error: "Cannot communicate with the server." }) });
})
}

async function aggiornaPunteggio(id,punteggio){ 
  return new Promise((resolve,reject)=>{
    fetch(new URL(`http://localhost:3001/api/aggiornaPunteggio/${id}/${punteggio}`), {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body:JSON.stringify({id:id,punteggio:punteggio}),
  }).then((res)=>{
        if(res.ok){
            return resolve(null); 
        }
        else {
          res.json()
            .then((message)=>{ reject(message);})
            .catch(()=>{reject({error: 'Cannot parse server response'}) });
          }
        })
      .catch(() => { reject({ error: "Cannot communicate with the server." }) });
  })
}

async function chiudiIndovinello(id){
  return new Promise((resolve,reject)=>{
    fetch(new URL(`http://localhost:3001/api/chiudiIndovinello/`), {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body:JSON.stringify({id:id}),
  }).then((res)=>{
        if(res.ok){
            return resolve(null); 
        }
        else {
          res.json()
            .then((message)=>{ reject(message);})
            .catch(()=>{reject({error: 'Cannot parse server response'}) });
          }
        })
      .catch(() => { reject({ error: "Cannot communicate with the server." }) });
  })
}


/*
    =============================
    POST: /sessions -> login
    =============================
*/
const APIURL=new URL('http://localhost:3001/api/');

async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }

  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }

const API = {logIn,logOut,
            getAllIndovinelli,getIndovinelliUtente,inserisciIndovinello,getRisposteIndovinello,getClassifica,
            getRisposteIndovinelloAperto,aggiornaPunteggio,inserisciRisposta,chiudiIndovinello,getIndovinelliApertiConRisposta,
            getPunteggioCorrente
          }
export default API;