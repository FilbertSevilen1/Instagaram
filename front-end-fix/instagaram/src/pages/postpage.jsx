import React, { useRef, useState } from "react";
import '../css/postpage.css'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useToast, Spinner } from '@chakra-ui/react'
import FormData from 'form-data'

function PostPage () {
    const toast = useToast();
    const navigate = useNavigate();
    const postcontent = useRef();
    const user = useSelector((state) => state);
    const [loading, setLoading] = useState(false)
    const [postPicture, setPostPicture] = useState("");


    const changePostPicture = (event) =>{
        setPostPicture(event.target.files[0])
    }

    if(!user.username){
        navigate("/")
    }
    const onSubmitPost = () =>{
        setLoading(true)
        if(postcontent.current.value.length<10||postcontent.current.value.length>500){
            setLoading(false)
            return toast({
                title: 'Post Error',
                description: "Post must contains 10-500 characters",
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
        }
        let data = new FormData();
        // data = {
        //     username : user.username,
        //     postcontent : postcontent.current.value
        // }
        if(postPicture){
            data.append("postpicture", postPicture, postPicture.name);
        }
        data.append("username", user.username);
        data.append("postcontent", postcontent.current.value)

        Axios.post("http://localhost:5000/api/post", data)
        .then((respond)=>{
            setLoading(false)
            console.log(respond.data)
            toast({
                title: 'Post Success',
                description: "Tell your friends to not get salty!",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            navigate('/')
        })
        .catch((error)=>{
            setLoading(false);
            console.log(error.response.data)
        })

        console.log(data)
    }

    return (
        <div className="postContainer">
            <div className="postForm">
                <div className="postHeader">Share your garam to your friends!</div>
                <div>
                    Picture : <input type="file" onChange = {changePostPicture}></input>
                </div>
                <textarea ref = {postcontent} type="text" className="postInput" style={{marginTop:"15px"}} placeholder="Win a lottery? send garams to tilt your friends"></textarea>
                {
                    loading?
                    <button className="postButton"><Spinner/>Loading</button>
                    :
                    <button className="postButton" onClick={onSubmitPost}>Post Garam</button>
                }
                
            </div>
        </div>
    )
}
export default PostPage;