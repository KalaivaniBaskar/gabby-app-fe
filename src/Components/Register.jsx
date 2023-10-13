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

 export const registerSchema = yup.object().shape({
    username: yup.string().required("Please enter name").min(3, 'Too Short!').max(20, 'Too Long!'),
    email: yup.string().email().required("Please enter email"),
    phone: yup.string(),
    password: yup
        .string()
        .required('Password is required')
        .matches(/\w*[a-z]\w*/,  "Password must have a small letter")
        .matches(/\w*[A-Z]\w*/,  "Password must have a capital letter")
        .matches(/\d/, "Password must have a number")
        .matches(/[!+@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
        .min(8, ({ min }) => `Password must be at least ${min} characters`),
    password2: yup.string()
        .required("Confirm your password")
        .oneOf([yup.ref("password")], "Password does not match")
    }); 

const Register = () => { 
    const { toastOptions} = useCTX();
    const [resp, setResp] = useState("")
    const navigate = useNavigate();
    const [open, setOpen] = useState(false)
    const [modalMsg, setmodalMsg] = useState("")
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false)} 
    
    const {values, 
        handleChange, 
        handleSubmit,
        handleBlur,
        errors,
        touched } = useFormik({
        initialValues: {
            username: "",
            email: "",
            phone: "",
            password: "",
            password2: ""
        },
        validationSchema: registerSchema,
        onSubmit: (newUser) => {
            handleAddUser(newUser)
        }
    
    }) 

  const handleAddUser = async(newUser) => {
    //console.log(newUser);
    const user = {
        username : newUser.username,
        email : newUser.email,
        phone: newUser.phone,
        password: newUser.password
    } 
    //console.log(user)
    setmodalMsg("Creating account..")
    handleOpen();
    toast.success (
        "form submitted",
        toastOptions
    )
    try{
    const response = await axios.post(`${BASE_URL}/auth/user/register`, user)
    //console.log(response); 
    if(response.status === 201 || response.status === 200 ) { 
        setResp("Account created successfully!")
        handleClose()
        toast.success (
            "Account created! Login",
            toastOptions
        )
        navigate('/login')
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
                placeholder='Enter Username'
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text" 
                name="username"
                autoComplete='off'
                required>
                </TextField>
                {touched.username && errors.username ? 
                <div className="error-div" >
                {errors.username} 
                </div>  : ""}

                <TextField variant="filled"  
                placeholder='Enter Email'
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

                <TextField  variant="filled"  
                placeholder='Enter Phone number'
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text" 
                name="phone"
                autoComplete='off'
                >
                {touched.phone && errors.phone ? 
                <div className="error-div">
                {errors.phone} 
                </div>  : ""}
                </TextField>

                <TextField variant="filled"  
                placeholder='Enter Password '
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

                <TextField  variant="filled"  
                placeholder='Confirm Password '
                value={values.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password" 
                name="password2"
                autoComplete='off'
                required>
                </TextField>
                {touched.password2 && errors.password2 ? 
                <div className="error-div">
                {errors.password2} 
                </div>  : ""}
                                
                 <Button type='submit' variant='contained' 
                 color='success' 
                 size='medium' sx={{m: 1, display: 'block' }} >
                    SIGN UP
                 </Button> 
                
                <div>
                 <p><span>Already have an account?    
                 <Link className='link-style' to='/login'> Login </Link> </span>
                 </p>
                 </div>
            </form>
        }
        <ToastContainer />
    </>
  )
}

export default Register;