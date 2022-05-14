import React from "react";
import {Link, useLocation} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import '../css/navbar.css'

function Navigationbar(){
    const location = useLocation()
    const user = useSelector((state) => state)
    const dispatch = useDispatch();

    const onButtonLogout = () =>{
        localStorage.removeItem("token")
        dispatch({type:'LOGOUT'})
    }

    return (
        <div className="navbarContainer">
            <div className="navbarLeft">
                <Link to ='/' className="navbarButton">
                    {location.pathname == '/'?"Instagaram":"Home"}
                </Link>
                {
                    user.username?
                    <Link to ='/postpage' className="navbarButton">
                        Post a Garam
                    </Link>
                    :
                    <div>
                    </div>
                }
                
            </div>
            <div className="navbarRight">
                {
                    user.username?
                    <div className="navbarRightContent">
                        <img src={"http://localhost:5000/" + user.profilepicture} className="navbarAvatar"></img>
                        <Link to ="/profile" className="navbarButton">
                            {user.username}
                        </Link>
                        <div className="navbarButton" onClick={onButtonLogout}>
                            Log Out
                        </div>
                    </div>
                    
                    :
                    <div className="navbarRightContent">
                        <Link to ="/login" className="navbarButton">
                            Login
                        </Link>
                        <Link to ="/register" className="navbarButton">
                            Register
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}
export default Navigationbar;