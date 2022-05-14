import React, { useRef, useState } from "react";
import Axios from 'axios'
import '../css/loginregister.css'
import '../css/main.css'
import { useDispatch } from "react-redux";
import { Spinner } from '@chakra-ui/react'

function Forget(){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    dispatch({type:'LOGOUT'})

    const email = useRef();
    const [errorMessage, setErrorMessage] = useState();
    const sendResetPasswordLink = () =>{
        setLoading(true);
        const data = {
            email : email.current.value
        }
        Axios.post('http://localhost:5000/api/auth/resetpassword',data)
        .then((respond)=>{
            setLoading(false);
            console.log(respond.data)
            setErrorMessage("Reset email password has been sent, please check your email.")
        })
        .catch((error)=>{
            setLoading(false);
            console.log(error.response.data)
            setErrorMessage(error.response.data)
        })
    }
    return(
        
        <div className="loginContainer">
            <div className="loginForm">
                <h1 style={{fontSize:"36px", marginTop:"75px", marginBottom:"25px"}}>Forget Password Page</h1>
                <div className="loginFormInput" style={{marginTop:"25px"}}>
                    <h2>Enter your email</h2>
                    <input ref={email} type="text" className="Input"></input>
                </div>
                <div className="loginFormInputSmall">
                    {errorMessage}
                </div>
                {
                loading?
                <button className="submitButton">
                    <Spinner color='blue.500' size='sm'/> Loading
                </button>
                :
                <button className="submitButton" onClick={sendResetPasswordLink}>
                    Submit
                </button>
                }
                
            </div>
        </div>
    )
}
export default Forget;