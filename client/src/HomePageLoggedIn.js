import { Button, Row, Col,ButtonGroup } from "react-bootstrap"
import { useState } from "react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from './API'
import Classifica from './Classifica'
function HomepageLoggedIn(props){
    const navigate=useNavigate()
    const [punteggioUtente,setPU]=useState([]);

    //carica il punteggio corrente dell'utente
    useEffect(()=>{
        API.getPunteggioCorrente(props.user.id).then((res)=>setPU(res))
    },[])
    //console.log(punteggioUtente)
    return(
        <>
            <Row>
                <Col>
                <h2>Benvenuto utente {props.user.id}</h2><br></br><br></br>
                <h3>Il tuo punteggio: {punteggioUtente.punteggio ? punteggioUtente.punteggio : "0"}</h3>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="primary" onClick={()=>navigate('/inseriscinuovoindovinello')}>Inserisci nuovo indovinello</Button>
                    <Button variant="primary" onClick={()=>navigate('/visualizzatuttigliindovinelli')}>Visualizza tutti gli indovinelli</Button>
                    <Button variant="primary" onClick={()=>navigate('/visualizzatuoiindovinelli')}>Visualizza i tuoi indovinelli</Button>
                </ButtonGroup>
                </Col>
            </Row>
            <br></br><br></br>
            <Row>
                <Col>
                    <Classifica/>
                </Col>
            </Row>
        </>
    )
}


export default HomepageLoggedIn