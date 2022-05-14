import Axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import '../css/loginregister.css'
function ResetPassword () {
    const dispatch = useDispatch();
    dispatch({type:'LOGOUT'})

    const password = useRef("");
    const repassword = useRef("");
    const [errorMessage, setErrorMessage] = useState("")

    const [showPassword, setShowPassword] = useState(false)

    const pathname = useLocation().pathname;
    const uid = pathname.substring(16,pathname.length)

    const changeShowPasswordState = () =>{
        if(showPassword)return setShowPassword(false)
        return setShowPassword(true)
    }

    const sendResetPasswordData = () =>{
        if(!password.current.value){
            return setErrorMessage("Password cannot be empty")
        }
        if(password.current.value!=repassword.current.value){
            return setErrorMessage("Password and Repassword is not same")
        }
        const data = {
            uid : uid,
            password : password.current.value,
            repassword : repassword.current.value
        }
        console.log(data)
        Axios.patch("http://localhost:5000/api/auth/inputresetpassword", data)
        .then((respond)=>{
            console.log(respond.data)
            setErrorMessage("Change password success")
        })
        .catch((error)=>{
            console.log(error.response.data)
            setErrorMessage(error.response.data)
        })
    }

    return(
        <div className="loginContainer">
            <div className="loginForm">
                <h1>Input new Password</h1>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Password</h3>
                    <input type={showPassword?"text":"password"} className='Input' ref={password}></input>
                </div>
                <div className='registerFormInput'>
                    <h3 className='loginLabel'>Re-enter Password</h3>
                    <input type={showPassword?"text":"password"} className='Input' ref={repassword}></input>
                    <div><input type="checkbox" id="showPassword" onClick={changeShowPasswordState} style={{cursor:"pointer"}}></input><label htmlFor='showPassword' style={{cursor:"pointer"}}>Show Password</label></div>
                </div>
                <div className="loginFormInputSmall">
                    {errorMessage}
                </div>
                <button className="submitButton" onClick={sendResetPasswordData}>Submit</button>
            </div>
        </div>
    )
}
export default ResetPassword;