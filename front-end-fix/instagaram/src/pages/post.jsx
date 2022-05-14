import React, { useEffect, useState } from "react";
import '../css/postpage.css'
import Axios from 'axios'
import { ArrowUpIcon, ChatIcon } from '@chakra-ui/icons'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
function Post(key){
    const username = key.post.username
    const toast = useToast();
    const [confirmation, setConfirmation] = useState(false);
    const user = useSelector((state)=>state)
    const [poster, setPoster] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        Axios.get(`http://localhost:5000/api/users/username/${username}`)
        .then((respond)=>{
            setPoster(respond.data[0])
        })
        .catch((error)=>{
            console.log(error.response.data)
            
        })
    },[])

    const deletePost = () =>{
        console.log(key.post.id)
        Axios.delete(`http://localhost:5000/api/post/${key.post.id}`)
        .then((respond)=>{
            setConfirmation(false)
            toast({
                title: 'Delete Post Success!',
                description: "Refresh to update feed",
                status: 'success',
                duration: 5000,
                isClosable: true,
              })
            navigate('/')
        })
        .catch((error)=>{
            console.log(error.response.data)
            toast({
                title: 'Delete Post Failed',
                description: `${error.response.data}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
            setConfirmation(false)
        })
    }
    return (
        <div className="postFormSmall">
            <div className="postUsernameBar">
                <img src={"http://localhost:5000/" + poster.profilepicture} className="postProfile"/>
                <div className="postUsername">{key.post.username}</div>
            </div>
            {
                key.post.postpicture?
                <div>
                    <img src={"http://localhost:5000/posts/" + key.post.postpicture} className="postimage"></img>
                </div>
                :
                <div>
                </div>
            }
            
            <div className="postContent">{key.post.postcontent}</div>
            <div className="postLike">
                <ArrowUpIcon/> {key.post.likecount} 
                <ChatIcon ml="10"/> 0
                {
                    user.username === poster.username?
                    <button className="deleteButton" onClick={()=>setConfirmation(true)}>Delete Post</button>
                    :
                    <div>
                    </div>
                }
                </div>
            {
                confirmation?
                <div className='postAlertContainer'>
                    <div className='postAlertBox'>
                        <h2>Are you sure to delete this post?</h2>
                        <div>
                            <button className='profileButton success' onClick={deletePost}>
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
export default Post;