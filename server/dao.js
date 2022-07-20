'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */
const sqlite = require('sqlite3');
// open the database
const db = new sqlite.Database('indovinelli.sqlite', (err) => {
    if(err) throw err;
});

// Recupera tutti gli indovinelli
exports.getAllIndovinelli = () => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * 
		FROM indovinelli`;
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const indovinelli = rows.map((e) => ({
				id:e.id,
                domanda:e.domanda,
                livello:e.livello,
                durata:e.durata,
                risposta_corretta:e.risposta_corretta,
                suggerimentoUno:e.suggerimentoUno,
                suggerimentoDue:e.suggerimentoDue,
                id_utente:e.id_utente,
                stato:e.stato
			}));
            //console.log('indovinelli',indovinelli)
			resolve(indovinelli);
		});
	});
};

exports.getIndovinelliUtente = (id) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * 
		FROM indovinelli
		WHERE id_utente = ?`;
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const indovinelli = rows.map((e) => ({
				id:e.id,
                domanda:e.domanda,
                livello:e.livello,
                durata:e.durata,
                risposta_corretta:e.risposta_corretta,
                suggerimentoUno:e.suggerimentoUno,
                suggerimentoDue:e.suggerimentoDue,
                id_utente:e.id_utente,
                stato:e.stato
			}));
            //console.log('indovinelli',indovinelli)
			resolve(indovinelli);
		});
	});
};

exports.inserisciIndovinello=(domanda,livello,durata,risposta_corretta,suggerimentoUno,suggerimentoDue,id_utente,stato)=>{
	//console.log("dentro daojs", domanda,livello,durata,suggerimentoUno,suggerimentoDue,id_utente,stato)
	return new Promise((resolve,reject)=>{
	  const sql= `
	  INSERT INTO indovinelli (domanda,livello,durata,risposta_corretta,suggerimentoUno,suggerimentoDue,id_utente,stato) VALUES (?,?,?,?,?,?,?,?)
	  `
	  db.run(sql,[domanda,livello,durata,risposta_corretta,suggerimentoUno,suggerimentoDue,id_utente,stato],(err)=>{
		if(err){
		  reject(err);
		  return;
		}
		resolve(null)
	  })
	})
};

exports.inserisciRisposta=(id_indovinello,id_utente,risposta,corretta,timestamp)=>{
	return new Promise((resolve,reject)=>{
		const sql=`
		INSERT INTO risposte (id_indovinello,id_utente,risposta,corretta,timestamp)
		VALUES (?,?,?,?,?)
		`;
		db.run(sql,[id_indovinello,id_utente,risposta,corretta,timestamp],(err)=>{
			if(err){
			  reject(err);
			  return;
			}
			resolve(null)
		  })
	})
}

exports.getRisposteIndovinello=()=>{
	return new Promise((resolve, reject) => {
		const sql = `SELECT * 
		FROM risposte
		ORDER BY timestamp asc
		`;
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const risposte = rows.map((e) => ({
				id_indovinello:e.id_indovinello,
                id_utente:e.id_utente,
				risposta:e.risposta,
				corretta:e.corretta,
				timestamp:e.timestamp
			}));
            //console.log('indovinelli',indovinelli)
			resolve(risposte);
		});
	});
};

exports.getRisposteIndovinelloAperto=(id)=>{
	return new Promise((resolve, reject) => {
		const sql = `SELECT * 
		FROM risposte
		WHERE id_indovinello=?`;
		db.all(sql, [id], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const risposte = rows.map((e) => ({
				id_indovinello:e.id_indovinello,
                id_utente:e.id_utente,
				risposta:e.risposta,
				corretta:e.corretta,
				timestamp:timestamp
			}));
            //console.log('indovinelli',indovinelli)
			resolve(risposte);
		});
	});
};

exports.getClassifica=()=>{
	return new Promise((resolve, reject) => {
		const sql = `SELECT username,punteggio 
		FROM utenti
		ORDER BY punteggio DESC
		LIMIT 3`;
		db.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
				return;
			}

			const classifica = rows.map((e) => ({
				username:e.username,
				punteggio:e.punteggio
			}));
            //console.log('indovinelli',indovinelli)
			resolve(classifica);
		});
	});
}

exports.getPunteggioCorrente=(id)=>{
	return new Promise((resolve,reject)=>{
		const sql=`select punteggio
		from utenti
		WHERE id=?`
		db.get(sql,[id],(err,row)=>{
			if(err){
			  reject(err);
			  return;
			}
			//console.log(row.punteggio,"row")
			resolve (row)
		  })
		})
}

exports.aggiornaPunteggio=(id,punteggio)=>{
	return new Promise((resolve,reject)=>{
		//totPunti=punteggio+getPunteggioCorrente(id).then();
		const sql=`UPDATE utenti
		SET punteggio=?
		WHERE id=?`
		db.run(sql,[punteggio,id],(err,row)=>{
			if(err){
			  reject(err);
			  return;
			}
			//console.log(row)
			resolve (row)
		  })
		})
}

exports.chiudiIndovinello=(id)=>{
	return new Promise((resolve,reject)=>{
		const sql=`
		UPDATE indovinelli
		SET stato=0
		WHERE id=(?)
		`
		db.run(sql,[id],(err,row)=>{
		  if(err){
			reject(err);
			return;
		  }
		  //console.log(row)
		  resolve (row)
		})
	  })
}

exports.getIndovinelliApertiConRisposta=()=>{
	return new Promise((resolve,reject)=>{
		const sql=`SELECT *, min(timestamp)
		FROM risposte,indovinelli
		WHERE risposte.id_indovinello=indovinelli.id AND indovinelli.stato=1
		group by id`;
		db.all(sql,[],(err,rows)=>{
			if (err){
				reject(err);
				return;
			}
			const risultato=rows.map((e)=>({
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
			resolve(risultato)
		})
	})
}
