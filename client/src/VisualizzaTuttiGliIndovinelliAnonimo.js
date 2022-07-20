import { useState, useEffect } from "react";
import {  Table } from "react-bootstrap";
import API from "./API";

function VisualizzaTuttiGliIndovinelliAnonimo(){
    //console.log(props.indovinelli)

    // const [rispostaData,setRisposta]=useState(''); //stato risposta
    // const [indovinelloSelezionato,setIS]=useState([]); //indovinello selezionato per rispondere
    // const [show, setShow] = useState(false); //show modal
    const [indovinelli,setIndovinelli]=useState([]);

    //prende tutti gli indovinelli
    useEffect(()=>{
      API.getAllIndovinelli()
      .then((lista)=>setIndovinelli(lista))
      .catch((error)=>console.log(error))
    },[])

    //timer

    return (
        <>
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
                {indovinelli.map((e)=>(
                    //<RigaIndovinello key={idx oppure e.id} {...e} altri props/>
                    <tr>
                        <td>{e.domanda}</td>
                        <td>{e.livello}</td>
                        {e.stato===0?<td>Chiuso</td>:<td>Aperto</td>}
                        {/**controllo stato per capire se far partire il time o meno */}
                        {/* {e.stato===1 ? setTimeLeft(e.durata) : ''} */}
                        {/* <td>{timeLeft ? timeLeft: e.durata}</td> */}
                        {/* <td>{e.durata}</td> */}
                        {/**controllare log in  */}
                        <td>Accedi per rispondere</td>
                        <td>Non puoi ancora visualizzare i dettagli senza accedere</td> 
                    </tr>
                ))}
            </tbody>
        </Table>
        </>
    );
}
export default VisualizzaTuttiGliIndovinelliAnonimo;