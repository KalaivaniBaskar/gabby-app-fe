import React from 'react'
import { useState } from 'react';
import { useCTX } from '../Context/ContextProvider.jsx';
import { BASE_URL } from '../Services/APIServices.js';
import ModalInfo from './ModalInfo';
import axios from 'axios';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Tooltip, Avatar, IconButton, Box } from '@mui/material';
import { toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import gabby from '../assets/gabby.png'
import RefreshIcon from '@mui/icons-material/Refresh';

const ContactPanel = ({socket}) => {
    const {user, setUser, setChatUser,
        contactList, setContactList,
        isDraw, setIsDraw,  setRoom } = useCTX();
    const [dialogopen, setDialogOpen] = useState(false);
    const [addCt, setAddCt] = useState("");
    const handleDialogOpen = () => {
      setDialogOpen(!dialogopen);
    };
    const handleDialogClose = () => {
      setDialogOpen(false);
    };
     const emailvalidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const [open, setOpen] = useState(false)
    const [modalMsg, setmodalMsg] = useState("")
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false)} 
    

    const toastOptions = {
      position: "bottom-right",
      autoClose: 5000,
      pauseOnHover: true,
      draggable : true,
      theme: 'dark'
  } 
    
      const addContact = async() => {
        
        handleDialogClose();
        setmodalMsg("Adding Contact")
        handleOpen();
       
        if(!addCt.trim()) {
          toast.error (
            ("Contact Email required"),
            toastOptions
          )
          handleClose()
          
        }
        else if(user.contacts.includes(addCt)){
          handleClose()
          setAddCt("")
          toast.error (
            ("User already in contacts"),
            toastOptions
           )   
        }
        else if(!emailvalidRegex.test(addCt)){
          handleClose()
          setAddCt("")
          toast.error (
            ("Invalid Email address"),
            toastOptions
           )   
        }
        else if(addCt.trim() === user.email){
          handleClose()
          setAddCt("")
          toast.error (
            ("Invalid Email address"),
            toastOptions
           )   
        }
        else {
          const email = localStorage.getItem('email')
          const data = { email, addEmail: addCt.trim()}
          setAddCt("")
          try{  
              const token = localStorage.getItem('tokenAuth')
              const config = { headers : {"x-auth-token" : token}}
              const response = await axios.put(`${BASE_URL}/auth/user/add-contact`, data, config )
              //console.log(response)
              if(response.status=== 200){
                setUser({...user, contacts : [...response.data.contacts]})
                localStorage.setItem("contacts", [...response.data.contacts] )
                handleClose()
                toast.success (
                  ("Added to contacts"),
                  toastOptions
              )
              }
            }
            catch(error){ 
              console.log(error)
              const err = error?.response?.data?.message
              toast.error (
                  (err ? err : "Error occurred!"),
                  toastOptions
              )
              handleClose()
            }     
          }
      }

      const joinRoom = (userA,roomID) => {
          if( userA && roomID ) {
            const data = {name: userA, room: roomID} 
            socket.emit("join_room", data) 
            handleClose()
          }
      }
      
      const handleChatUser = (ctct, idx) => { 
        handleOpen();
       // console.log(ctct._id, user.id) 
        let roomID = "";
        
        if(user.id < ctct._id) 
        roomID = user.id+ctct._id
        else 
        roomID = ctct._id+user.id
       
        setRoom(roomID)
        setChatUser({...ctct})
        if(isDraw)
        setIsDraw(false);
        joinRoom(user.username,roomID);
      }
      
      const getContactList = async() => { 
        
        try{  
          //const contacts = localStorage.getItem('contacts')
          //console.log(contacts, user.contacts)
          handleOpen()
          const token = localStorage.getItem('tokenAuth')
          const config = { headers : {"x-auth-token" : token}}
          const data = {contacts : user.contacts}
          const response = await axios.post(`${BASE_URL}/auth/user/get-contacts`, 
          data, config )
          //console.log(response)
          if(response.status=== 200){
            setContactList(response.data.contactList)
            handleClose()
            toast.success (
              (`${response.data.contactList.length} Contacts fetched`),
              toastOptions
          )
          }
        }
        catch(error){ 
          console.log(error)
          const err = error?.response?.data?.message
          toast.error (
              (err ? err : "Error fetching contacts! ".concat(error.response.status)),
              toastOptions
          )
          handleClose()
        }    
      
      }  

  return (
         <>
           <div className='logo-wrap-panel'> 
                    <img src={gabby} alt="Gabby logo" />
                    <h3>Gabby</h3>
              </div> 
              <div>
             <p style={{fontSize: '18px'}}>Contacts

            <IconButton onClick={getContactList}>
              <RefreshIcon sx={{bgcolor: "white"}} 
               />
            </IconButton>
            <IconButton onClick={handleDialogOpen}>
              <LibraryAddIcon sx={{bgcolor: "white"}} 
               />
            </IconButton>
            </p>
            </div>
            {
              dialogopen && 
              
                <Box sx={{marginY : '7px'}}>
                  <input
                  label="Email *"
                  type="email"   
                  required
                  value={addCt}
                  onChange={(e) => setAddCt(e.target.value)}
                  style={{paddingBlock: '0.5rem', 
                   fontSize: '1rem', 
                    display: 'block' ,
                   marginBottom : '5px'}}              
                   /> 
                   <button 
                   style= {{ display: 'block',
                   padding: '5px',
                  fontFamily: 'Poppins',
                   fontWeight: '550'}}
                   onClick={addContact}> 
                    ADD
                   </button> 
                </Box>
              
            } 
            <Box>
              {
                contactList.length > 0 ?
                 contactList.map((el, i) => (
                  
                  <div className='contact-card' key={i} onClick={()=> handleChatUser(el,i)}  >
                    <Tooltip title= {<p style={{ color: "white", fontSize: '14px' }}>{el.email} </p>}
                    placement="right-end" arrow>
                      <Avatar sx={{ width: 50, height: 50 , bgcolor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}  
                      alt={el.username} src= {el.pic_URL }
                        />
                    </Tooltip>
                    <p>{el.username}</p>
                </div>
                 ))
                 : 
                 <p>Find your contacts...</p>
              }
            </Box>
            <ModalInfo open={open} handleClose={handleClose} modalMsg={modalMsg} />
           
            </>
  )
}

export default ContactPanel