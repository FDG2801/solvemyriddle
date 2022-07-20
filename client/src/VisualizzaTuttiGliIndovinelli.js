import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Form, Modal, Alert} from "react-bootstrap";
import API from "./API";

function VisualizzaTuttiGliIndovinelli(props){
    // -------------------- STATES ---------------------------------------
    const navigate=useNavigate();
    const [rispostaData,setRisposta]=useState(''); //stato risposta
    const [indovinelloSelezionato,setIS]=useState([]); //indovinello selezionato per rispondere
    const [show, setShow] = useState(false); //show modal
    const [showR, setShowR] = useState(false); //show modal
    const [indovinelli,setIndovinelli]=useState([]);
    const [risposteDate,setRisposteDate]=useState([]);
    const [message,setMessage]=useState('');
    const [showM,setShowM]=useState(false);
    const [stateData,setSD]=useState('');
    const [indovinelliAperti,setIndovinelliAperti]=useState([]);

    //----------------- USE EFFECTS -----------------------------------------
    /**
     * 1. prende tutti gli indovinelli
     * 2. prende gli indovinelli aperti con risposta (la prima)
     * 3. prende tutte le risposte
     * 4. setta la data attuale per diminuire il tempo rimasto
     * 5. diminuisce in background il tempo rimasto degli indovinelli aperti con una risposta
     */
    useEffect(()=>{
      API.getAllIndovinelli()
      .then((lista)=>{setIndovinelli(lista);/*setCI(lista)*/})
      .catch((error)=>console.log(error))
    },[])

    useEffect(()=>{
        API.getIndovinelliApertiConRisposta()
        .then((lista2)=>{setIndovinelliAperti(lista2)})
        .catch((error)=>console.log(error))
    },[])

    //use effect per le risposte dei chiusi
    useEffect(()=>{
      // console.log("triggered")
      API.getRisposteIndovinello()
      .then((lista)=>{setRisposteDate(lista)})
      .catch((error)=>console.log(error))
      },[rispostaData])
      
    // --------------------- MODALS --------------------------------------
    const handleClose = () => setShow(false); //risposta
    const handleCloseR = () => setShowR(false); //dettagli

    //risposta
    const handleShow = (e) => {
      setIS(e);
      setShow(true);
    }

    //dettagli
    const handleShowR = (e) => {
      setIS(e);
      setShowR(true);
    }

    //risposta
    const handleSubmit = async(event) => {
      //setDirty(!dirty)
      event.preventDefault();
      let punteggioCorrenteUtente=await API.getPunteggioCorrente(props.user.id)
      //console.log("punteggio correte", punteggioCorrenteUtente)
      //console.log(rispostaData,"rd",indovinelloSelezionato,"Is")
      if(rispostaData.toLocaleLowerCase()===indovinelloSelezionato.risposta_corretta){
        if(indovinelloSelezionato.livello==='Facile'){
          //console.log("Qui")
          // await API.chiudiIndovinello(indovinelloSelezionato.id)
          // await API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime())
          // await API.aggiornaPunteggio(props.user.id,1+punteggioCorrenteUtente.punteggio)
          Promise.all([API.chiudiIndovinello(indovinelloSelezionato.id),
            API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime()),
            API.aggiornaPunteggio(props.user.id,1+punteggioCorrenteUtente.punteggio)])
          //navigate("/")
        }
        else if(indovinelloSelezionato.livello==='Medio'){
          // await API.chiudiIndovinello(indovinelloSelezionato.i)
          // await API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime())
          // await API.aggiornaPunteggio(props.user.id,2+punteggioCorrenteUtente.punteggio)
          Promise.all([API.chiudiIndovinello(indovinelloSelezionato.i),
            API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime()),
            API.aggiornaPunteggio(props.user.id,2+punteggioCorrenteUtente.punteggio)])
          //navigate("/")
        }
        else if(indovinelloSelezionato.livello==='Difficile'){
          //Promise.all([...]) ?
          // await API.chiudiIndovinello(indovinelloSelezionato.id)
          // await API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime())
          // await API.aggiornaPunteggio(props.user.id,3+punteggioCorrenteUtente.punteggio)
          Promise.all([API.chiudiIndovinello(indovinelloSelezionato.id),
            API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),1,new Date().getTime()),
            API.aggiornaPunteggio(props.user.id,3+punteggioCorrenteUtente.punteggio)])
        }
        setMessage("Risposta corretta!")
        setShowM(true)
        setTimeout(function() {navigate('/')}, 2000);
        //setDirty(!dirty)
      }
      else{
        await API.inserisciRisposta(indovinelloSelezionato.id,props.user.id,rispostaData.toLocaleLowerCase(),0,new Date().getTime())
        setMessage('Risposta errata!')
        setShowM(true);
        setTimeout(function() {navigate('/')}, 2000);
      }
    };

    // CHECK SE L'UTENTE HA GIÀ RISPOSTO ALL'INDOVINELLO A CUI VUOLE RISPONDERE
    function checkRisposta(idUtente,idIndovinello){
      let toRet=false
      risposteDate.map((e)=>{
        if(e.id_indovinello===idIndovinello && e.id_utente===idUtente){
          return toRet=true
        }
      })
      return toRet
    }

    //------TIMER------------
<<<<<<< HEAD
    // useEffect(()=>{
    //   const interval = setInterval(()=>{
    //   //console.log("triggeratp")
    //   setSD(new Date().getTime())
    //   },1000)
    //   return () => clearInterval(interval)
    // },[1000])

    // useEffect(()=>{
    //   const interval2 = setInterval(()=>{
    //   //console.log("triggeratp")
    //   diminuisciTempoRimasto()
    //   },1000)
    //   return () => clearInterval(interval2)
    // },[1000])

    // //mostra
    // function getTempoRimasto(is){
    //   let toRet=null;
    //   indovinelliAperti.map((e)=>{
    //       let durata=is.durata;
    //       //console.log("durata",durata)
    //       let fineDelTempo=parseInt(e.timestamp/1000)+durata;
    //       let tempoAttuale=parseInt(stateData/1000);
    //       //console.log("ta",tempoAttuale," fdt",fineDelTempo)
    //       let controllaTempo=parseInt((fineDelTempo-tempoAttuale))
    //       //console.log("ct",controllaTempo)
    //       if (controllaTempo<=0){
    //         toRet='Tempo esaurito'
    //         //await API.chiudiIndovinello(indovinelloSelezionato.id)
    //       }
    //       else{
    //         toRet=controllaTempo
    //       }
=======
    useEffect(()=>{
      const interval = setInterval(()=>{
      //console.log("triggeratp")
      setSD(new Date().getTime())
      },1000)
      return () => clearInterval(interval)
    },[])

    useEffect(()=>{
      const interval2 = setInterval(()=>{
      //console.log("triggeratp")
      diminuisciTempoRimasto()
      },1000)
      return () => clearInterval(interval2)
    },[])

    //mostra timer a schermo - ok
    function getTempoRimasto(is){
      let toRet=null;
      indovinelliAperti.map((e)=>{
          let durata=is.durata;
          //console.log("durata",durata)
          let fineDelTempo=parseInt(e.timestamp/1000)+durata;
          let tempoAttuale=parseInt(stateData/1000);
          //console.log("ta",tempoAttuale," fdt",fineDelTempo)
          let controllaTempo=parseInt((fineDelTempo-tempoAttuale))
          //console.log("ct",controllaTempo)
          if (controllaTempo<=0){
            toRet='Tempo esaurito'
            //await API.chiudiIndovinello(indovinelloSelezionato.id)
          }
          else{
            toRet=controllaTempo
          }
>>>>>>> 75c8614676232b2916ed3deae9f377f0505d7385
        
    //   })
    //   return toRet
    // }

<<<<<<< HEAD
    // //diminuisci in background
    // function diminuisciTempoRimasto(){
    //   console.log("indovinelli aprti con almeno una risposta finora",indovinelliAperti)
    //   //let toRet=null;
    //   indovinelliAperti.map( (e)=>{
    //     console.log(e.durata,e.id)
    //       // let durata=e.durata;
    //       // //console.log("durata",durata)
    //       // let fineDelTempo=parseInt(e.timestamp/1000)+durata;
    //       // let tempoAttuale=parseInt(stateData/1000);
    //       // //console.log("ta",tempoAttuale," fdt",fineDelTempo)
    //       // let controllaTempo=parseInt((fineDelTempo-tempoAttuale))
    //       // //console.log("ct",controllaTempo)
    //       if(e.durata>0) e.durata=e.durata-1;
    //       else {
    //         e.durata='Tempo esaurito'
    //         setIndovinelliAperti(indovinelliAperti.filter(i=>i.id!==e.id))
    //         console.log("chiudendo indoinvello ",e.id)
    //         API.chiudiIndovinello(e.id)
    //       }
    //   })
    // }
=======
    //diminuisci in background
    async function diminuisciTempoRimasto(){
      let verificaDaChiudere=await API.getIndovinelliApertiConRisposta()
      //console.log('polling, ',verificaDaChiudere)
      verificaDaChiudere.map((e)=>{
        let durata=e.durata;
        //console.log("durata",durata)
        let fineDelTempo=parseInt(e.timestamp/1000)+durata;
        let tempoAttuale=parseInt(new Date().getTime()/1000)
        //("ta",tempoAttuale," fdt",fineDelTempo)
        e.tempoRimasto=parseInt((fineDelTempo-tempoAttuale))
        //console.log("ct",e.tempoRimasto)
        if (e.tempoRimasto<=0){
          //console.log('chiudo',e.id)
          chiudiIndovinelloTimer(e.id)
        }
      })
    }
>>>>>>> 75c8614676232b2916ed3deae9f377f0505d7385

    async function chiudiIndovinelloTimer(id){
      await API.chiudiIndovinello(id)
    }

    return (
        <>
        <h2>Indovinelli aperti</h2>
        <Table striped bordered>
            <thead>
                <tr>
                <th>Domanda</th>
                <th>Livello</th>
                {/* <th>Durata</th> */}
                <th>Stato</th>
                <th>Dettagli</th>
                </tr>
            </thead>
            <tbody>
                {indovinelli.filter((e)=>e.stato===1).map((e)=>(
                    //<RigaIndovinello key={idx oppure e.id} {...e} altri props/>
                    <tr key={e.id}>
                        <td>{e.domanda}</td>
                        <td>{e.livello}</td>
                        {(e.id_utente===props.user.id ? <td>Aperto</td> : <td>
                        <Button onClick={()=>{handleShow(e)}}>Rispondi</Button></td>)} 
                        {e.id_utente===props.user.id?<td>Vai nella tua pagina per i dettagli</td>:<td>Non puoi ancora visualizzare i dettagli</td>}
                    </tr>
                ))}
            </tbody>
        </Table>
        <h2>Indovinelli chiusi</h2>
        <Table striped bordered>
            <thead>
                <tr>
                <th>Domanda</th>
                <th>Livello</th>
                {/* <th>Durata</th> */}
                <th>Stato</th>
                <th>Dettagli</th>
                </tr>
            </thead>
            <tbody>
                {/**e,idx */}
                {indovinelli.filter((e)=>e.stato===0).map((e)=>(
                    //<RigaIndovinello key={idx oppure e.id} {...e} altri props/>
                    <tr key={e.id}>
                        <td>{e.domanda}</td>
                        <td>{e.livello}</td>
                        {/* <td>{e.durata}</td> */}
                        <td>Chiuso</td>
                        <td><Button onClick={()=>{handleShowR(e)}}>Dettagli</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        {/**----------------------MODALS------------------------------------------------------------------------- */}

        {/*------------------------ MODAL RISPOSTA ------------------------- */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Prova a rispondere...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {message ? (showM ? <Alert variant='secondary' onClose={()=>setShowM(false)} dismissible>{message}</Alert> : '') : ''}
              {indovinelloSelezionato.domanda}
              <br></br>
              <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Risposta</Form.Label>
                {/* {console.log(checkRisposta(props.user.id,indovinelloSelezionato.id))} */}
                    {checkRisposta(props.user.id,indovinelloSelezionato.id) ?
                    <Form.Control required={true} 
                    type="text" 
                    disabled
                    placeholder="Hai già inserito una risposta"   />
                    :
                    (getTempoRimasto(indovinelloSelezionato)==='Tempo esaurito' ? 
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire risposta"  
                    value={rispostaData}  
                    onChange={ev => setRisposta(ev.target.value)} 
                    disabled
                    /> :
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire risposta"  
                    value={rispostaData}  
                    onChange={ev => setRisposta(ev.target.value)} />)
                    }
                    {/* {console.log(typeof(indovinelloSelezionato.durata))} */}
                    {/* <CountdownTimer expiryTime={indovinelloSelezionato.durata}/> */}
            </Form.Group>
            {/* {100 + 130 -> timestamp risposta 120 -> 130-120 < 0} */}
<<<<<<< HEAD
           {}
=======
            {
            indovinelliAperti.map((e)=>{
                if(e.id===indovinelloSelezionato.id){
                  return <span>Tempo rimanente: {getTempoRimasto(indovinelloSelezionato)}</span>
                }
              })
            }
            <br></br>
            {getTempoRimasto(indovinelloSelezionato) ? 
            (getTempoRimasto(indovinelloSelezionato)<indovinelloSelezionato.durata/2) ?
            <span>Suggerimento uno: {indovinelloSelezionato.suggerimentoUno}</span>: "" : ""}
            <br></br>
            {getTempoRimasto(indovinelloSelezionato) ? 
            (getTempoRimasto(indovinelloSelezionato)<indovinelloSelezionato.durata/4) ?
            <span>Suggerimento due: {indovinelloSelezionato.suggerimentoDue}</span>: "" : ""}
            <br></br>
>>>>>>> 75c8614676232b2916ed3deae9f377f0505d7385
            {message ? 
            (showM ? <Button type="submit" disabled>Invia</Button>
            : <Button type="submit"> Invia </Button>)
            :
            (getTempoRimasto(indovinelloSelezionato)==='Tempo esaurito'? <Button type="submit" disabled> Invia </Button> :
            (
              checkRisposta(props.user.id,indovinelloSelezionato.id) ? 
              <Button type="submit" disabled>Invia</Button> 
              :
              <Button type="submit" >Invia</Button>
            ))}
            {/* <Button type="submit">
                Invia
            </Button> */}
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
        {/* -------------------------- MODAL DETTAGLI ----------------------------------- */}
        <Modal show={showR} onHide={handleCloseR}>
          <Modal.Header closeButton>
            <Modal.Title>Rsposte ricevute</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {indovinelloSelezionato.domanda} <br></br> 
              <span style={{fontWeight: 'bold'}}>soluzione: {indovinelloSelezionato.risposta_corretta}</span>
              <Form>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Table responsive >
                <thead>
                  <tr>
                    <th>Utente</th>
                    <th>Risposta</th>
                    <th>Corretta</th>
                  </tr>
                </thead>
                <tbody>
                  {risposteDate.filter((e)=>(e.id_indovinello===indovinelloSelezionato.id)).map((e)=>(
                    <tr key={indovinelloSelezionato.id}>
                      <td>{e.id_utente}</td>
                      <td>{e.risposta}</td>
                      {e.corretta===0?<td style={{color:'red'}}>No</td>:<td style={{color:'green'}}>Sì</td>}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form.Group>
            <br></br>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseR}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </>
    );
}

export default VisualizzaTuttiGliIndovinelli;