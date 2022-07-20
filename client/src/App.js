import './App.css';
//import files
import Layout from './Layout';
import HomePageAnonimo from './HomePageAnonimo';
import InserisciIndovinello from './InserisciIndovinello';
import HomepageLoggedIn from './HomePageLoggedIn';
import {LoginForm} from './Login';
import VisualizzaTuttiGliIndovinelli from './VisualizzaTuttiGliIndovinelli';
import VisualizzaITuoiIndovinelli from './VisualizzaITuoiIndovinelli';
import VisualizzaTuttiGliIndovinelliAnonimo from './VisualizzaTuttiGliIndovinelliAnonimo';
import API from './API';

//import components and hooks
import { BrowserRouter as Router, Routes, Route,Navigate, useNavigate  } from 'react-router-dom';
import {  useState, useEffect } from 'react';
function App() {
  return (
    <Router>
      <App2 />
    </Router>
  );
}

function App2() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [user,setUser]=useState([]);

  const navigate=useNavigate()

  useEffect(()=> {
    if(loggedIn){
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        setLoggedIn(true);
        setUser(user)
      } catch(err) {
        console.log(err);
      }
    };
    
    checkAuth();
    }
  }, []);

  const doLogIn = (credentials) => {
    //console.log("Sono qui in DoLogIn")
    API.logIn(credentials)
    .then( user =>{
    //console.log("Sono qui in then")
    setLoggedIn(true);
    setUser(user);
    navigate('/homepageloggedin');
  })
  .catch(err => {
    console.log(err);
    navigate('/');
  })
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    navigate('/');
  }

  return (
    
    <>
      <Routes>
        <Route path='/' element = {<Layout loggedIn={loggedIn} logout={doLogOut}/>}>
          <Route path='/' element = {
            //si potrebbe fare un'altro componente con la lista completa + la lista dello studente
          loggedIn ? <Navigate to='/homepageloggedin'/> : 
          <HomePageAnonimo/>
          }/>
          <Route path='/homepageloggedin' element={
            <HomepageLoggedIn user={user}/>
          }/>
          <Route path='/inseriscinuovoindovinello' element={
            <InserisciIndovinello user={user} loggedIn={loggedIn}/>
          }/>
          <Route path='/visualizzatuttigliindovinelli' element={
            <VisualizzaTuttiGliIndovinelli user={user} loggedIn={loggedIn}/>
          }/>
          <Route path='/visualizzaAnonimo' element={
            <VisualizzaTuttiGliIndovinelliAnonimo/>
          }/>
          <Route path='/visualizzatuoiindovinelli' element={
            <VisualizzaITuoiIndovinelli user={user} loggedIn={loggedIn}/>
          }/>
          <Route path='/login' element={loggedIn ? <Navigate to='/'/> : <LoginForm loggedIn={loggedIn} login={doLogIn}></LoginForm>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
