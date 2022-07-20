import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function LoginForm(props) {
    const [username, setUsername] = useState(props.message ? '' : 'testuser@polito.it'); //almeno tre film ed assegnare
    const [password, setPassword] = useState(props.message ?  '' : 'password');
    const [errorMessage, setErrorMessage] = useState(props.message ?  props.message : '') ;

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        
        let valid = true; 
        if(username === '' || password === '')
            valid = false;
        if(valid)
        {
          props.login(credentials);
            
        }
        else {
          setErrorMessage('Incorrect username and/or password.')
        }
    };

return (
    <Container>
        <Row>
            <Col>
                <h2>Login</h2>
                {errorMessage ? <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>{errorMessage}</Alert> : false}
                <Form onSubmit={handleSubmit}>
                
                    <Form.Group controlId='username'>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                    </Form.Group>
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                    </Form.Group>
                    <br></br>
                    <Button type="submit">Login</Button>
                </Form>
            </Col>
        </Row>
    </Container>)
}

function LogoutButton(props) {
return(
  <Col> 
    <span>User: {props.user?.name}</span>{' '}<Button variant="outline-primary" onClick={props.logout}>Logout</Button>
  </Col>
)
}

export { LoginForm, LogoutButton };