import {Form,Button} from 'react-bootstrap';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import API from './API';

function FormIndovinelli(props){
    //stati utili
    const [domanda,setDomanda]=useState("");
    const [livello,setLivello]=useState("");
    const [durata,setDurata]=useState(30);
    const [risposta_corretta,setRisposta]=useState("");
    const [suggerimentoUno,setSuggerimentoUno]=useState("");
    const [suggerimentoDue,setSuggerimentoDue]=useState("");
    const [errorMsg, setErrorMsg] = useState();

    //navigate per spostamento
    const navigate = useNavigate();
    async function addIndovinello(indovinello){
        await API.inserisciIndovinello(indovinello)
    }
    //handle submit
    // =========================================================================================================
    /*
    - verifica
    - creazione oggetto
    - aggiunta indovinello (comunicazione con db)
    - navigate to homepage
    */
    const handleSubmit=(event)=>{
        event.preventDefault();
        if (domanda.trim().length === 0) {
            setErrorMsg('La domanda è vuota');
        }
        else if (livello===undefined){
            setErrorMsg("Le categorie dell'indovinello deve essere: facile o medio o difficile")
        }
        else if (durata<30){
            setErrorMsg('La durata non può essere inferiore a 30 secondi')
        }
        else if (durata>600){
            setErrorMsg('La durata non può essere superiore a 600 secondi')
        }
        else if (risposta_corretta.trim().length === 0) {
            setErrorMsg('La risposta è vuota');
        }
        else if (suggerimentoUno.trim().length === 0) {
            setErrorMsg('Inserire suggerimento uno');
        }
        else if (suggerimentoDue.trim().length === 0) {
            setErrorMsg('Inserire suggerimento due');
        }
        else {
            const newIndovinello={
                domanda:domanda.trim(),
                livello:livello.trim(),
                durata:durata,
                risposta_corretta:risposta_corretta.trim(),
                suggerimentoUno:suggerimentoUno.trim(),
                suggerimentoDue:suggerimentoDue.trim(),
                id_utente:props.user.id,
                stato:1
            }
            addIndovinello(newIndovinello)
            navigate('/');
        }
    }
    
    return (
        <>
        <br></br>
        {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Domanda</Form.Label>
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire domanda"  
                    value={domanda}  
                    onChange={ev => setDomanda(ev.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Livello</Form.Label>
                <Form.Select aria-label="tipo" onChange={(ev)=>{setLivello(ev.target.value)}}>
                    <option value={undefined}>Scegli per favore la difficoltà</option>
                    <option value="Facile">Facile</option>
                    <option value="Medio">Medio</option>
                    <option value="Difficile">Difficile</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Durata</Form.Label>
                    <Form.Control required={true} 
                    type="number" 
                    min="30"
                    max="600"
                    placeholder="Inserire durata (da 30 a 600 secondi)"  
                    value={durata}  
                    onChange={ev => setDurata(ev.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Risposta corretta</Form.Label>
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire soluzione"  
                    value={risposta_corretta}  
                    onChange={ev => setRisposta(ev.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Suggerimento uno</Form.Label>
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire suggerimento uno"  
                    value={suggerimentoUno}  
                    onChange={ev => setSuggerimentoUno(ev.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicUser">
                <Form.Label>Suggerimento due</Form.Label>
                    <Form.Control required={true} 
                    type="text" 
                    placeholder="Inserire suggerimento due"  
                    value={suggerimentoDue}  
                    onChange={ev => setSuggerimentoDue(ev.target.value)} />
            </Form.Group>
            <br></br>
            <Button type="submit">
                Submit
            </Button>
            &nbsp;
            <Button variant="secondary" onClick={() => {navigate('/')}} >Cancel</Button>
        </Form>
        </>
    );
}

export default FormIndovinelli;