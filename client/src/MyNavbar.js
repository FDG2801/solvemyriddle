import {Navbar} from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {BsCollectionPlay} from "react-icons/bs";
import {FaUserCircle} from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";

function MyNavbar(props) {
  const navigate = useNavigate()

    return (
        <Navbar bg="dark" variant='dark' expanded sticky="top" /* style={{zIndex:-1}} */>
          
        <Container fluid >
          <div>
          <IconContext.Provider value={{size:"2em", color:"white"}}>
              <BsCollectionPlay />
            </IconContext.Provider>
          
            <Navbar.Brand className="text-light" onClick={() => {navigate('/')}}>Indovinelli</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </div>
            <div>
            <IconContext.Provider value={{size:"2em", color:"white"}}>
            {props.loggedIn ? <Button variant="outline-danger" onClick={props.logout}>Logout</Button> : ''}&nbsp;
              <FaUserCircle/> 
            </IconContext.Provider>   
            </div>
        </Container>
      </Navbar>
    );
  }
  
  export default MyNavbar;