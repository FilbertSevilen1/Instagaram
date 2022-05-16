import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import '../css/profile.css'
import '../css/alert.css'
import Axios from 'axios'
import FormData from 'form-data'
import { useToast } from '@chakra-ui/react'

function Profile () {
    const toast = useToast();

    const newUsername = useRef();
    const newFullname = useRef();
    const newBio = useRef();
    const [confirmation, setConfirmation] = useState(false)
    const navigate = useNavigate();

    const user = useSelector((state)=>state)

    if(!user.username){
        navigate('/')
    }

    const [errorMessage, setErrorMessage] = useState("");
    const [newProfilePicture, setNewProfilePicture] = useState("");
    const [editProfilePictureState, setEditProfilePictureState] = useState(false)
    const [editState, setEditState] = useState(false);
    const verified = user.verified
    console.log(user)

    const changeProfilePicture = (event) =>{
        setNewProfilePicture(event.target.files[0])
    }
    const saveProfilePicture = () => {
        const data = new FormData();
        data.append("image", newProfilePicture, newProfilePicture.name)
        data.append("uid", user.uid)
        console.log(data)
        
        Axios.post("http://localhost:5000/api/users/uploadProfilePicture", data)
        .then((respond)=>{
            console.log(respond.data)
            toast({
                title: 'Update Profile Picture Success',
                description: "Refresh to update",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            setEditProfilePictureState(false)
        })
        .catch((error)=>{
            console.log(error.response.data)
            toast({
                title: 'Update Profile Picutre Canceled',
                description: "",
                status: 'error',
                duration: 3000,
                isClosable: true,
              })
            setErrorMessage(error.response.data)
        })
    }

    const saveProfileData = () =>{
        const data = {
            username : newUsername.current.value,
            fullname : newFullname.current.value,
            bio : newBio.current.value
        }
        console.log(data)

        Axios.patch(`http://localhost:5000/api/users/${user.uid}`, data)
        .then((respond)=>{
            console.log(respond.data)
            setErrorMessage("")
            user.username = data.username
            user.fullname = data.fullname
            user.bio = data.bio
            setConfirmation(false);
            setEditState(false);
        })
        .catch((error)=>{
            console.log(error.response.data)
            setErrorMessage(error.response.data)
            setConfirmation(false);
        })
    }

    const sendEmailVerification = () =>{
        const data = {
            uid : user.uid,
            email : user.email
        }

        Axios.post("http://localhost:5000/api/auth/sendVerification", data)
        .then((respond)=>{
            console.log(respond)
            setErrorMessage("")
            alert("Verification Link has been sent")
        })
        .catch((error)=>{
            console.log(error.response.data)
            setErrorMessage(error.response.data)
        })
    }
    return (
        <div className='profileContainer'>
            <div className='profileForm'>
                <div className='profileLeft'>
                    <img src={`http://localhost:5000/` + user.profilepicture} className='profilePicture'></img>
                    {verified?
                        <div className='profileLeftMenu'>
                            {editProfilePictureState?
                                <div className='profileLeftMenuBranch'>
                                    <input type='file' onChange={changeProfilePicture}></input>
                                    <div className=''>
                                        <button className='profileButtonSmall' onClick={saveProfilePicture}>Save Edit</button>
                                        <button className='profileButtonSmall' onClick={()=>setEditProfilePictureState(false)}>Cancel Edit</button>
                                    </div>
                                </div>
                                :
                                <button className='profileButton' onClick={()=>setEditProfilePictureState(true)}>Edit Profile Picture</button>
                            }   
                            {
                                editState?
                                <button className='profileButton' onClick = {()=>setEditState(false)}>Cancel Edit</button>
                                :
                                <button className='profileButton' onClick = {()=>setEditState(true)}>Edit Profile Data</button>
                            }
                        </div>
                        :
                        <div className='profileLeftMenu'>
                            <div className='profileNotification'>You must verify your account to edit your profile</div>
                            <button className='profileButton' onClick={sendEmailVerification}>Send new Email Verification</button>
                        </div> 
                    }
                </div>
                <div className='profileRight'>
                    {
                        editState?
                        <div>
                            <input ref = {newFullname} type="text" className='profileHeader1' style = {{border:"1px solid black"}} defaultValue ={user.fullname}></input><br/>
                            <div className='flex'><input ref = {newUsername} type="text" className='profileHeader2' style = {{border:"1px solid black"}} defaultValue ={user.username}></input>  
                            <h2 className='profileHeader2'>- {user.email}</h2></div>
                            <h1 className='profileHeader1'>My Biodata</h1>
                            <div className='profileBio'>
                                <textarea style = {{border:"1px solid black"}} ref={newBio} className='profileBio'>

                                </textarea>
                            </div>
                            <div>
                                {errorMessage}
                            </div>    
                            <button className='profileButton success' onClick={()=>setConfirmation(true)}>
                                Save Changes
                            </button>
                            <button className='profileButton failure' onClick={()=>setEditState(false)}>
                                Cancel Changes
                            </button>
                        </div>
                        :
                        <div>
                            <h1 className='profileHeader1'>{user.fullname?user.fullname:"<Blank>"}</h1>
                            <h2 className='profileHeader2'>{user.username} - {user.email}</h2>
                            <h1 className='profileHeader1'>My Biodata</h1>
                            <div className='profileBio'>
                                {user.bio?user.bio:"No biodata to show"}
                            </div>
                            <div>
                                {errorMessage}
                            </div>
                        </div>
                    }
                    
                </div>
            </div>
            {
                confirmation?
                <div className='alertContainer'>
                    <div className='alertBox'>
                        <h2>Are you sure to change this profile data?</h2>
                        <div>
                            <button className='profileButton success' onClick={saveProfileData}>
                                Yes
                            </button>
                            <button className='profileButton failure' onClick={()=>setConfirmation(false)}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div>
                </div>
            }
            
        </div>
    )
}
export default Profile;