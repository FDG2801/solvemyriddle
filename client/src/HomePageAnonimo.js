import { Button, Row, Col,ButtonGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import Classifica from './Classifica'
function HomePageAnonimo(props){
    const navigate=useNavigate()
    return(
        <>
            <Row>
                <Col>
                <h2>Benvenuto utente anonimo</h2><br></br><br></br>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="primary" onClick={()=>navigate('/login')}>Log - in</Button>
                    <Button variant="primary" onClick={()=>navigate('/visualizzaAnonimo')}>Visualizza tutti gli indovinelli</Button>
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


export default HomePageAnonimo