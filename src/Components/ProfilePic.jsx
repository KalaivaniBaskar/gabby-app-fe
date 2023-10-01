import React from 'react'
import { useState } from 'react';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useCTX } from '../Context/ContextProvider.jsx';
import { BASE_URL } from '../Services/APIServices.js';
import ModalInfo from './ModalInfo';
import axios from 'axios';
import { Button, TextField, Box, Paper, Avatar } from '@mui/material';
import {  useNavigate } from 'react-router-dom';

const ProfilePic = () => {
    const {user , setUser} = useCTX();
    //console.log(user)
    const navigate = useNavigate()
    const [image, setImage] = useState({url: user.pic_URL, public_id: user.pic_URL_ID});
    const [delImage, setDelImage] = useState({url: user.pic_URL, public_id: user.pic_URL_ID});
    const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
    const maxFileSize = 1000000; // 1MB
    const preset_key = process.env.REACT_APP_PRESET_KEY;
    const cloud_name = process.env.REACT_APP_CLOUD_NAME;
    //console.log("env", cloud_name, preset_key)
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

  const handleImage = (e) => {
      setFileSizeExceeded(false);
      const file = e.target.files[0]; 
          if(file) {
              if (file.size > maxFileSize) {
                toast.error (
                    ("File size exceeds 1MB"),
                    toastOptions
                )
                  setFileSizeExceeded(true);
                  return; // do not process the file if it exceeds the size limit
              }
             else 
              {
              setImage(e.target.files[0])
          }
        }
        else {
            toast.error (
                ("File not uploaded"),
                toastOptions
            )
        }
    } 

    const handleUpload = async(event) => {
      if(!fileSizeExceeded){
          setmodalMsg("Updating your Avatar")
          handleOpen();
          const imgForm = new FormData();
          imgForm.append("file", image)
          imgForm.append("upload_preset", preset_key)
          imgForm.append("cloud_name",cloud_name) 
          imgForm.append("folder","GabbyAvatars");
      
          const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, imgForm)
           //console.log(response);
          // console.log(response.data.public_id);
          setImage({url: response.data.secure_url, public_id: response.data.public_id}) 
          
          try {
            const email = localStorage.getItem('email')
           const db_response = await updateUserDB({email,
                              pic_URL: response.data.secure_url,
                              pic_URL_ID: response.data.public_id })
          if(db_response.status === 200) {
             //console.log(db_response)
             setUser({...user, pic_URL:response.data.secure_url, pic_URL_ID:response.data.public_id })
          }
          if(delImage.url !== "na" && delImage.public_id !== "na"){
             deleteImage(delImage.public_id)
          }  
          navigate('/');
        }
        catch(err) {
            toast.error (
                ("Error updating avatar!"),
                toastOptions
            )
        }
      }
      else{
        toast.error (
            ("File size should be less than 2MB"),
            toastOptions
        )
      }
    }

       const updateUserDB = async(data) => {
              try{ 
                  const token = localStorage.getItem('tokenAuth')
                  const config = { headers : {"x-auth-token" : token}}
                  const response = await axios.put(`${BASE_URL}/auth/user/set-avatar`, data, config )
                  return response
              }
              catch(error){ 
                toast.error (
                    ("Error occurred!"),
                    toastOptions
                )
                  return error
              }
       }
       
       const deleteImage = async (public_id) => {
          try{
          //console.log("delete old image")
          const token = localStorage.getItem('tokenAuth')
          const config = { headers : {"x-auth-token" : token}}
          const response = await axios.delete(`${BASE_URL}/auth/user/delete-pic?public_id=${public_id}`, config)
          //console.log(response)
          }
          catch(error){ 
              console.log("cloud not updated")
              return error
          }
         }
   

  return (
    <>
    <ModalInfo open={open} handleClose={handleClose} modalMsg={modalMsg} />
    <section className='profile-pic'>
        <Box component={Paper} p={2} 
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
            <h3>Upload Image </h3> 
            <Avatar sx={{ width: 100, height: 100 , bgcolor: '#0E0E0E' }}  
                   alt={user?.username} src= {user?.pic_URL ? user.pic_URL:  "na"}
                    />
            <TextField type='file' onChange={handleImage} fullWidth />
            <Button onClick={handleUpload}>Upload</Button>
            <Button onClick={()=> navigate('/')}>Cancel</Button>
        </Box>
    </section>
    <ToastContainer />
    </>
  )
}

export default ProfilePic