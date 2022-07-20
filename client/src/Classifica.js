import { useEffect,useState } from "react";
import { Table } from "react-bootstrap";
import API from "./API";


function Classifica(){
    
const [classifica,setClassifica]=useState([]);

    // prende la classifica 
    useEffect(()=>{
        API.getClassifica()
        .then(classificaP=>setClassifica(classificaP))
        .catch(error=>console.log(error));
    },[])
    
    //console.log(classifica)
    return (
        <Table striped bordered size="sm">
            <thead>
                <tr>
                <th>Username</th>
                <th>Punteggio</th>
                </tr>
            </thead>
            <tbody>
                {classifica.map((e)=>(
                    <tr key={e.username}>
                        <td>{e.username}</td>
                        <td>{e.punteggio}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default Classifica