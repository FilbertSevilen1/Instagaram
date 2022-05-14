import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import '../css/loginregister.css'
import { useNavigate } from 'react-router-dom'
import { Spinner, useToast } from '@chakra-ui/react'

function Login () {
    const toast = useToast();
    const user = useSelector((state) => state)
    const navigate = useNavigate();

    if(user.username){
        navigate('/')
    }
    const username = useRef("");
    const password = useRef("");

    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState();
    const [showPassword, setShowPassword] = useState(false)
    const [keepLogged, setKeepLogged] = useState(false)

    const dispatch = useDispatch()

    const onSubmitButton = () =>{
        setLoading(true);

        if(!username.current.value){
            setLoading(false);
            toast({
                title: 'Username cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Username cannot be empty")
        }
        if(!password.current.value){
            setLoading(false);
            toast({
                title: 'Password cannot be empty',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            return setErrorMessage("Password cannot be empty")
        }

        const data = {
            username : username.current.value,
            password : password.current.value
        }
        console.log(data)
        Axios.post("http://localhost:5000/api/auth/login", data)
        .then((respond)=>{
            console.log(respond.data)
            setErrorMessage("Login Success")
            if(keepLogged){
                localStorage.setItem("token",respond.data.uid)
            }
            dispatch({ type : 'LOGIN', payload : respond.data})
            setLoading(false);
            toast({
                title: 'Login Success!',
                description: "Please be kind and polite to others",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            navigate('/')
        })
        .catch((error)=>{
            setErrorMessage(error.response.data)
            setLoading(false);
        })
    }
    const changeShowState = () =>{
        if(showPassword)return setShowPassword(false)
        return setShowPassword(true)
    }
    const changeKeepLogged = () =>{
        if(showPassword)return setKeepLogged(false)
        return setKeepLogged(true)
    }
    return (
        <div className='loginContainer'>
            <div className='loginForm'>
                <h1 className='loginHeader'>Login</h1>
                <div className='loginFormInput'>
                    <h3 className='loginLabel'>Username</h3>
                    <input type="text" className='Input' ref={username}></input>
                </div>
                <div className='loginFormInput'>
                    <h3 className='loginLabel'>Password</h3>
                    <input type={showPassword?"text":"password"} className='Input' ref={password}></input>
                    <div><input type="checkbox" id="showPassword" onClick={changeShowState} style={{cursor:"pointer"}}></input><label htmlFor='showPassword' style={{cursor:"pointer"}}>Show Password</label></div>
                </div>
                <div className='loginFormInputSmall'>
                    <div><input type="checkbox" id="keepLogged" onClick={changeKeepLogged} style={{cursor:"pointer"}}></input><label htmlFor='keepLogged' style={{cursor:"pointer"}}>Keep me Logged in</label></div>
                </div>
                <div className='loginFormInputSmallBottom'>
                   {errorMessage}
                </div>
                <div>
                    {
                        loading?
                        <button className='submitButton' onClick={onSubmitButton}>
                            <Spinner color='blue.500' size='sm'/> Loading
                        </button>
                        :
                        <button className='submitButton' onClick={onSubmitButton}>
                            Login
                        </button>
                    }
                    
                    <button className='submitButton' onClick={() => navigate('/forget')}>
                        Forget Password
                    </button>
                </div>
                
            </div>
        </div>
    )
}
export default Login;