import MyNavbar from './MyNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

function Layout(props){
    return(
        <>
        <div className="App">
            <Row>
                <MyNavbar loggedIn={props.loggedIn} logout={props.logout}/>
            </Row>
            <Row style={{height:"100vh"}}> 
             <Col  xs={12}>
                    <Outlet/>
            </Col> 
            </Row>              
        </div>
         </>
    )
}

export default Layout;