import React from 'react'
import { useState } from 'react';
import { Button, TextField }  from '@mui/material';
import * as yup from "yup"
import { useFormik } from 'formik' 
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Services/APIServices.js';
import ModalInfo from './ModalInfo';
import gabby from '../assets/gabby.png'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useCTX } from '../Context/ContextProvider.jsx';

 export const loginSchema = yup.object().shape({
    email: yup.string().email().required("Please enter email"),
    password: yup
        .string()
        .required('Password is required')
        .matches(/\w*[a-z]\w*/,  "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/,  "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({ min }) => `Password must be at least ${min} characters`),
    }); 

const Login = () => {
  const [resp, setResp] = useState("")
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [modalMsg, setmodalMsg] = useState("")
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false)} 
  const {setUser} = useCTX();
  const toastOptions = {
      position: "bottom-right",
      autoClose: 5000,
      pauseOnHover: true,
      draggable : true,
      theme: 'dark'
  }
  const {values, 
      handleChange, 
      handleSubmit,
      handleBlur,
      errors,
      touched } = useFormik({
      initialValues: {
          email: "",
          password: "", 
      },
      validationSchema: loginSchema,
      onSubmit: (user) => {
          handleLoginUser(user)
      }
  
  }) 

const handleLoginUser = async(user) => {
  //console.log(user);
  setmodalMsg("Please wait..")
  handleOpen();
  
  try{
  const response = await axios.post(`${BASE_URL}/auth/user/login`, user)
  //console.log(response); 
  if( response.status === 200 ) { 
    toast.success (
        "You are logged in",
        toastOptions
    )    
      setResp("Logging into your account")
      const userdata = response?.data?.userdata;
      setUser({...userdata});
      const accessToken = response?.data?.accessToken;
            localStorage.setItem("tokenAuth", accessToken);
            localStorage.setItem("email", userdata.email)
            localStorage.setItem("role", userdata.role)
            localStorage.setItem("id", userdata.id)  
            localStorage.setItem("pic_URL", userdata.pic_URL)
            localStorage.setItem("pic_URL_ID", userdata.pic_URL_ID)
            localStorage.setItem("phone", userdata.phone)
            localStorage.setItem("contacts", userdata.contacts)
            localStorage.setItem("username", userdata.username)
              
      handleClose()
      navigate('/')
  }
  else {
      setResp("Some error occured")
      handleClose()
      toast.error (
          "Some error occured",
          toastOptions
      )
  }
  }
  catch(error){
      handleClose()
      //console.log(error);
      //console.log(error?.response?.data?.message)
      const err = error?.response?.data?.message
      toast.error (
          (err ? err : "Error occurred!"),
          toastOptions
      )
  }
}

return (
  <>
  <ModalInfo open={open} handleClose={handleClose} modalMsg={modalMsg} />
 
      {
          resp ? <p style={{color: 'white'}}>{resp}</p>
          :
        
          <form className='register-form' onSubmit={handleSubmit} > 
      
              <div className='logo-wrap'> 
                  <img src={gabby} alt="Gabby logo" />
                  <h1>Gabby</h1>
              </div>
              
              <TextField variant="filled"  
              placeholder='Your Email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email" 
              name="email"
              autoComplete='off'
              required>
              </TextField>
              {touched.email && errors.email ? 
              <div className="error-div">
              {errors.email} 
              </div>  : ""}

              <TextField variant="filled"  
              placeholder='Your Password '
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              type="password" 
              name="password"
              autoComplete='off'
              required>
              </TextField>
              {touched.password && errors.password ? 
              <div className="error-div">
              {errors.password} 
              </div>  : ""}

               <Button type='submit' variant='contained' 
               color='success' 
               size='medium' sx={{m: 1, display: 'block' }} >
                  LOG IN
               </Button> 
              
              <div>
               <p><span>Don't have an account?    
               <Link className='link-style' to='/register'> Sign Up </Link> </span>
               </p>
               </div>
          </form>
      }
      <ToastContainer />
  </>
)
}

export default Login