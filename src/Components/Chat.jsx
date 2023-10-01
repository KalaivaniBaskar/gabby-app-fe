import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalInfo from './ModalInfo';
import loader from '../assets/colorloader.gif'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Drawer, Avatar, Tooltip, IconButton} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useCTX } from '../Context/ContextProvider.jsx';
import ContactPanel from './ContactPanel';
import ChatBox from './ChatBox';
import MenuIcon from '@mui/icons-material/Menu';
import ContactPanelSide from './ContactPanelSide';

const Chat = ({socket}) => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [modalMsg, setmodalMsg] = useState("")
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false)} 
  const {user, setUser, chatUser, setChatUser, setContactList, isDraw, setIsDraw} = useCTX();
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable : true,
    theme: 'dark'
} 

  const handleLogout = () => {
          
            localStorage.clear();
            setUser({})
            setContactList([])
            setChatUser("")
  } 
  
  
  useEffect(() => {
    const token = localStorage.getItem("tokenAuth")
    const email = localStorage.getItem("email")
      if( !token || !email || !user.email)  
        navigate('/login')
  }, [user])
  
  
  return (
    <>
        
       <ModalInfo open={open} handleClose={handleClose} modalMsg={modalMsg} />
       {
        user?.email &&
       
       <section className='chat'>
         <div className='contact-wrap' >
           <ContactPanel socket={socket} />
           </div>
         <div className='chat-box'>
               <div className='nav-wrap'>
               <div className='user-wrap'> 
                    <Tooltip title={<p style={{ color: "white", fontSize: '14px' }}>Edit Avatar </p>} 
                    placement="top-start" arrow>
                  <Avatar sx={{ width: 50, height: 50 , bgcolor: '#0E0E0E' }}  
                   alt={user?.username} src= {user?.pic_URL ? user.pic_URL:  "na"}
                   onClick={()=> navigate('/profile-pic')} />
                </Tooltip>
                    <h4>{user.email}</h4>
                </div> 
                <div className='logo-wrap'>              
                <IconButton color='secondary' 
                onClick={handleLogout}>
                  <PowerSettingsNewIcon fontSize='medium' />
                </IconButton>
                <div className='menu'>
                <IconButton  color='secondary' 
                 onClick={() => setIsDraw(true)}>
                  <MenuIcon fontSize='medium' />
                </IconButton>
                </div>
                </div>
               </div>
                <div className='chat-list'>
                  {
                    chatUser ? 
                     <ChatBox socket={socket} />
                    : 
                    <div className='load-chat'> 
                    <h3>Hi, {user.username} !</h3> 
                    <h3> Welcome to Gabby Chat</h3> 
                    <img className="wheel" src={loader} alt="color wheel" />
                    <p> Chat Away !</p>
                   </div> 
                  }
                </div>

         </div>
       </section> 
       
      }
      {/* Default behaviour is to be hidden */}
      <Drawer anchor='left' open={isDraw} onClose={()=> setIsDraw(false)}>
          <ContactPanelSide socket={socket} />
        </Drawer>
       <ToastContainer />
    </>
  )
}

export default Chat