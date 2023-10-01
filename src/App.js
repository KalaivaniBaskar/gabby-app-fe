import { Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react'
import Login from './Components/Login';
import Register from './Components/Register';
import Chat from './Components/Chat';
import ProfilePic from './Components/ProfilePic';
import { BASE_URL } from './Services/APIServices.js';
import io from "socket.io-client";

function App() {
  const socket = io.connect(BASE_URL);  
  return (
    <div className='App'> 
    <Routes>
      <Route path='/' element={ <Chat socket={socket} />} />
      <Route path='/login' element={ <Login />} />
      <Route path='/register' element={ <Register />} />
      <Route path='/profile-pic' element={ <ProfilePic />} />
      
      <Route path='*' element={ <h3>404 : Page not found</h3>} />

    </Routes>
    </div>
  )
}

export default App;