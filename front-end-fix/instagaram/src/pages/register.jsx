import React, { useRef, useState } from 'react'
import Axios from 'axios';
import '../css/loginregister.css'
import { useNavigate } from 'react-router-dom';
import { Spinner, useToast } from '@chakra-ui/react'

function Register () {
    const username = useRef("");
    const email = useRef("");
    const password = useRef("");
    const repassword = useRef("");
    const toast = useToast();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState();
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const changeShowPasswordState = () =>{
        if(showPassword)return setShowPassword(false)
        return setShowPassword(true)
    }
    const onRegisterButton = () =>{

        setLoading(true)
        if(!username.current.value){
            setLoading(false)
            toast({
                title: 'Username cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Username cannot be empty")
        }
        if(!email.current.value){
            setLoading(false)
            toast({
                title: 'Email cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Email cannot be empty")
        }
        if(!password.current.value){
            setLoading(false)
            toast({
                title: 'Password cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Password cannot be empty")
        }
        if(!repassword.current.value){
            setLoading(false)
            toast({
                title: 'Re-Password cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Re-Password cannot be empty")
        }
        if(password.current.value != repassword.current.value){
            setLoading(false)
            return setErrorMessage("Password and repassword is not same")
        }
        const data = {
            username : username.current.value,
            email : email.current.value,
            password : password.current.value,
            repassword : repassword.current.value
        }
        console.log(data)
        Axios.post("http://localhost:5000/api/auth/register",data)
        .then((respond)=>{
            setLoading(false)
            console.log(respond.data)
            toast({
                title: 'Instagaram account has been created.',
                description: "Please check your email to verify your account.",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            navigate("/")
        })
        .catch((error)=>{
            setLoading(false)
            toast({
                title: 'Register Error',
                description: `${error.response.data}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
            console.log(error.response.data)
            setErrorMessage(error.response.data)
        })
    }
    return (
        <div className='registerContainer'>
            <div className='registerForm'>
                <h1 className='registerHeader'>
                    Register
                </h1>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Username</h3>
                    <input type="text" className='Input' ref={username}></input>
                </div>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Email</h3>
                    <input type="text" className='Input' ref={email}></input>
                </div>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Password</h3>
                    <input type={showPassword?"text":"password"} className='Input' ref={password}></input>
                    <div></div>
                </div>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Re-enter Password</h3>
                    <input type={showPassword?"text":"password"} className='Input' ref={repassword}></input>
                    <div><input type="checkbox" id="showPassword" onClick={changeShowPasswordState} style={{cursor:"pointer"}}></input><label htmlFor='showPassword' style={{cursor:"pointer"}}>Show Password</label></div>
                </div>
                <div className='registerFormInputSmallBottom'>
                   {errorMessage}
                </div>
                {
                    loading?
                    <button className='submitButton'><Spinner color='blue.500' size='sm'/> Loading</button>
                    :
                    <button className='submitButton' onClick={onRegisterButton}>Register</button>
                }
                
            </div>
        </div>
    )
}
export default Register;