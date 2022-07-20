import { useState, useEffect } from "react";
import { Button, Table, Form, Modal} from "react-bootstrap";
import API from "./API";

function VisualizzaITuoiIndovinelli(props){
    //console.log(props.indovinelli)
    //const [rispostaData,setRisposta]=useState(''); //stato risposta
    const [indovinelloSelezionato,setIS]=useState([]); //indovinello selezionato per rispondere
    const [show, setShow] = useState(false); //show modal
    const [indovinelliUtente,setIndovinelliUtente]=useState([]);
    const [risposteDate,setRisposteDate]=useState([]);
    const [stateData,setSD]=useState('');
    const [indovinelliAperti,setIndovinelliAperti]=useState([]);

    //-------------------------------------------------------

    // ------ funzioni handle modals
    const handleClose = () => {setShow(false)}
    const handleShow = async (e) => {
      setIS(e);
      setShow(true);
    }

    // ------ use effect
    /**
     * 1. prende indovinelli dell'utente
     * 2. prende gli indovinelli aperti con una risposta (la prima)
     * 3. polling della risposta ogni secondo
     * 4. setta la data attuale per diminuire il tempo rimasto
     * 5. diminuisce in background il tempo rimasto degli indovinelli aperti con una risposta
     */
    useEffect(()=>{
          API.getIndovinelliUtente(props.user.id)
          .then((lista)=>setIndovinelliUtente(lista))
          .catch((error)=>console.log(error))
      },[])

    useEffect(()=>{
      API.getIndovinelliApertiConRisposta()
      .then((lista2)=>{setIndovinelliAperti(lista2)})
      .catch((error)=>console.log(error))
  },[])

      useEffect(()=>{
        const interval3 = setInterval(()=>{
        //console.log("triggeratp3")
        API.getRisposteIndovinello().then((lista)=>setRisposteDate(lista)).catch((error)=>console.log(error))
        },1000)
        return () => clearInterval(interval3)
      },[])

      //------TIMER------------
    useEffect(()=>{
      const interval = setInterval(()=>{
      //console.log("triggeratp3")
      setSD(new Date().getTime())
      },1000)
      return () => clearInterval(interval)
    },[])

    useEffect(()=>{
      const interval2 = setInterval(()=>{
      //console.log("triggeratp2")
      diminuisciTempoRimasto()
      },1000)
      return () => clearInterval(interval2)
    },[])

    //mostra timer a schermo - ok
    function getTempoRimasto(is){
      let toRet=null;
      //console.log('is',is)
      if(is.stato===0) toRet="L'indovinello è chiuso"
      else{
        indovinelliAperti.map((e)=>{
          let durata
          if (e.tempoRimasto===null) durata=e.durata
          else durata=e.tempoRimasto
          //let durata=is.durata;
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
      })
      }
      
      return toRet
    }

    //diminuisci in background
    async function diminuisciTempoRimasto(){
      let verificaDaChiudere=await API.getIndovinelliApertiConRisposta()
      //console.log('polling, ',verificaDaChiudere)
      verificaDaChiudere.map((e)=>{
        let durata=e.durata;
        //console.log("durata",durata)
        let fineDelTempo=parseInt(e.timestamp/1000)+durata;
        let tempoAttuale=parseInt(new Date().getTime()/1000)
        //console.log("ta",tempoAttuale," fdt",fineDelTempo)
        e.tempoRimasto=parseInt((fineDelTempo-tempoAttuale))
        //console.log("ct",e.tempoRimasto)
        if (e.tempoRimasto<=0){
          //console.log('chiudo',e.id)
          API.chiudiIndovinello(e.id) 
        }
      })
    }

    return (
        <>
        <Table striped bordered>
            <thead>
                <tr>
                <th>Domanda</th>
                <th>Livello</th>
                <th>Durata</th>
                <th>Stato</th>
                <th>Dettagli</th>
                </tr>
            </thead>
            <tbody>
                {/**e,idx */}
                {indovinelliUtente.map((e)=>(
                    <tr key={e.id}>
                        <td>{e.domanda}</td>
                        <td>{e.livello}</td>
                        <td>{e.durata}</td>
                        {props.loggedIn ?  (e.stato===0 ? <td>Il tuo indovinello è chiuso</td> : 
                        <td>Il tuo indovinello è aperto</td>) : <td>Non dovresti essere qui</td>}
                          <td><Button onClick={()=>{handleShow(e)}}>Dettagli</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Rsposte ricevute</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              {indovinelloSelezionato.domanda}
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
                    <tr key={e.id_utente}>
                      <td>{e.id_utente}</td>
                      <td>{e.risposta}</td>
                      {e.corretta===0?<td>No</td>:<td>Sì</td>}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <span>Suggerimento uno: {indovinelloSelezionato.suggerimentoUno}</span><br></br>
              <span>Suggerimento due: {indovinelloSelezionato.suggerimentoDue}</span><br></br>
              <span>Tempo rimasto: 
              {getTempoRimasto(indovinelloSelezionato) ? 
              getTempoRimasto(indovinelloSelezionato) 
              : "Non sono presenti risposte"}</span>
            </Form.Group>
            <br></br>
        </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        </>
    );
}
export default VisualizzaITuoiIndovinelli;